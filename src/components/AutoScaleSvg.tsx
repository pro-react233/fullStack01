import * as React from "react";
import { useCallback, useLayoutEffect, useRef } from "react";

export interface AutoScaleSvgProps {
    viewportWidth?: number;
    viewportHeight?: number;
    className?: string;
    children?: React.ReactChild | React.ReactChild[];
}

export function AutoScaleSvg({
    viewportWidth,
    viewportHeight,
    className,
    children
}: AutoScaleSvgProps) {
    viewportWidth =
        viewportWidth === null || viewportWidth === undefined
            ? 100
            : viewportWidth;
    viewportHeight =
        viewportHeight === null || viewportHeight === undefined
            ? 100
            : viewportHeight;

    const svgRef = useRef<SVGSVGElement>(null);
    const onResize = useCallback(() => {
        if (svgRef.current) {
            onResizeSvg(svgRef.current, viewportWidth, viewportHeight);
        }
    }, [viewportWidth, viewportHeight]);

    useLayoutEffect(() => {
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, [viewportWidth, viewportHeight]);

    useLayoutEffect(() => {
        if (svgRef.current) {
            svgRef.current.addEventListener("resize", onResize);
            onResize();
        }

        return () =>
            svgRef.current &&
            svgRef.current.removeEventListener("resize", onResize);
    }, [svgRef.current, viewportWidth, viewportHeight]);

    return (
        <svg
            className={className}
            viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
            preserveAspectRatio="xMidYMid meet"
            ref={svgRef}
        >
            {children}
        </svg>
    );
}

/** Update base font size to keep 1em = 1px ratio. */
function onResizeSvg(
    svg: SVGSVGElement,
    viewportWidth: number,
    viewportHeight: number
): void {
    if (svg) {
        const rect = svg.getClientRects()[0];

        if (!rect) {
            return;
        }

        const xRatio = viewportWidth / rect.width;
        const yRatio = viewportHeight / rect.height;

        const { actualSize, viewportSize } =
            xRatio < yRatio
                ? { actualSize: rect.height, viewportSize: viewportHeight }
                : {
                      actualSize: rect.width,
                      viewportSize: viewportWidth
                  };

        const scale = viewportSize / actualSize;

        svg.style.fontSize = `${scale}px`;
    }
}
