export function sort<T>(source: T[], ...sortingTerms: SortingTerm<T>[]): T[] {
    if (!source) {
        throw new Error("Source is not defined");
    }

    const sortBy = (sortingTerms || []).map<[SortBySelector<T>, SortDirection]>(
        t => (typeof t === "function" ? [t, "asc"] : t)
    );

    return source
        .map(item => ({
            item,
            sortingValues: sortBy.map<[any, SortDirection]>(
                ([term, direction]) => [term(item), direction]
            )
        }))
        .sort((a, b) => {
            for (let i = 0; i < a.sortingValues.length; i++) {
                const [aVal, direction] = a.sortingValues[i];
                const [bVal] = b.sortingValues[i];

                if (aVal === bVal) {
                    continue;
                }

                return (aVal > bVal ? 1 : -1) * (direction === "asc" ? 1 : -1);
            }

            return 0;
        })
        .map(a => a.item);
}

export type SortBySelector<T> = (item: T) => any;
export type SortDirection = "asc" | "desc";

export type SortingTerm<T> =
    | SortBySelector<T>
    | [SortBySelector<T>, SortDirection];
