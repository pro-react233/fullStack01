import * as React from "react";
import { Button } from "@material-ui/core";
import PrevIcon from "@material-ui/icons/KeyboardArrowLeft";
import NextIcon from "@material-ui/icons/KeyboardArrowRight";

export interface PagerProps {
    currentPage: number;
    totalPages: number;

    onGoToPage?: (page: number) => void;

    renderPage?: (
        pageInfo: PageInfo,
        goToPageHandler: (page: number) => void,
        key: string
    ) => React.ReactChild;
}

export type PageType = "page" | "current-page" | "prev" | "next" | "middle";

export function Pager({
    currentPage,
    totalPages,
    renderPage,
    onGoToPage
}: PagerProps) {
    onGoToPage = onGoToPage || (() => {});
    const pages = createPagerModel(currentPage, totalPages);
    const renderer = renderPage || defaultPageRenderer;

    return (
        <div className="Pager">
            {pages.map((p, index) => renderer(p, onGoToPage, `${index}`))}
        </div>
    );
}

function defaultPageRenderer(
    pageInfo: PageInfo,
    onGoToPage: (page: number) => void,
    key: string
) {
    return (
        <Button
            size="small"
            onClick={() => pageInfo.enabled && onGoToPage(pageInfo.pageNumber)}
            disabled={!pageInfo.enabled}
            key={key}
        >
            {(function() {
                switch (pageInfo.type) {
                    case "prev":
                        return <PrevIcon />;
                    case "next":
                        return <NextIcon />;
                    default:
                        return pageInfo.pageNumber;
                }
            })()}
        </Button>
    );
}

function createPagerModel(currentPage: number, totalPages: number): PageInfo[] {
    currentPage = Math.min(totalPages, Math.max(1, currentPage));
    return [...buildPager(totalPages, currentPage)];
}

interface PageInfo {
    pageNumber: number;
    type: PageType;
    enabled: boolean;
}

function* buildPager(
    totalPages: number,
    currentPage: number,
    currentPagePadding: number = 3
): IterableIterator<PageInfo> {
    yield {
        pageNumber: Math.max(1, currentPage - 1),
        type: "prev",
        enabled: currentPage !== 1
    };

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            yield {
                pageNumber: currentPage,
                type: "current-page",
                enabled: false
            };
            continue;
        }

        if (i === 1 || i === totalPages) {
            yield {
                pageNumber: i,
                type: "page",
                enabled: currentPage !== i
            };
            continue;
        }

        if (Math.abs(currentPage - i) <= currentPagePadding) {
            yield {
                pageNumber: i,
                type: "page",
                enabled: true
            };
            continue;
        }
    }

    yield {
        pageNumber: Math.min(totalPages, currentPage + 1),
        type: "next",
        enabled: currentPage !== totalPages
    };
}
