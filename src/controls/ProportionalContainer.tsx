import * as React from "react";
import "./ProportionalContainer.less";

export interface ProportionalContainerProps {
    heightPercent?: number;
    children: React.ReactChild | React.ReactChild[];
}

/** Container which have always the same proportions of width and height */
export function ProportionalContainer({
    heightPercent,
    children
}: ProportionalContainerProps) {
    const style: React.CSSProperties | undefined = React.useMemo(() => {
        return heightPercent !== undefined
            ? {
                  paddingTop: `${heightPercent}%`
              }
            : undefined;
    }, [heightPercent]);

    return (
        <div className="ProportionalContainer" style={style}>
            <div className="ProportionalContainer__inner">{children}</div>
        </div>
    );
}
