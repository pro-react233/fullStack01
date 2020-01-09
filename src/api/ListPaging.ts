export interface ListRequest<TSortBy = string> {
    search: string | undefined;
    skip: number;
    take: number;
    sortBy?: TSortBy;
    sortDirection?: "asc" | "desc";
}

export interface PagingInfo<T = string> extends ListRequest<T> {
    page: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
}

/** Builds a paging object from a parsed query string. */
export function listRequestFromQuery(query: any = {}): ListRequest {
    const result: ListRequest = {
        skip: query.skip ? parseInt(query.skip, 10) || 0 : 0,
        take: query.take ? parseInt(query.take, 10) || 10 : 10,
        search: query.search ? query.search : undefined,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection
    };

    return result;
}

export function pagingFromListRequest<T>(
    listRequest: ListRequest<T>,
    totalRecords: number
): PagingInfo<T> {
    return {
        ...listRequest,
        page: Math.floor(listRequest.skip / listRequest.take) + 1,
        totalPages: Math.ceil(totalRecords / listRequest.take),
        pageSize: listRequest.take,
        totalRecords
    };
}

export function toListRequest<T>(pagingInfo: PagingInfo<T>): ListRequest<T> {
    return {
        search: pagingInfo.search,
        sortBy: pagingInfo.sortBy,
        sortDirection: pagingInfo.sortDirection,
        skip: (pagingInfo.page - 1) * pagingInfo.pageSize,
        take: pagingInfo.pageSize
    };
}
