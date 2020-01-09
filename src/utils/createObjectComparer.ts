import { arePropsEqual } from "./arePropsEqual";
import { AreEqualFn, shallowCompareReactChildren } from "./comparers";

export interface ObjectComparerOptions<T> {
    comparerName?: string;
    considerFunctionsEqual?: boolean;
    compareReactChildren?: boolean;
    propertyComparers?: { [P in keyof T]?: AreEqualFn<T[P]> };
    debug?: boolean;
}

let debugObjectComparerMode: "all-on" | "all-off" | "use-comparer-settings" =
    "all-off";

export function toggleObjectComparerDebug(
    mode: typeof debugObjectComparerMode
): void {
    debugObjectComparerMode = mode;
}

export function createObjectComparer<T>(
    options?: ObjectComparerOptions<T>
): AreEqualFn<T> {
    options = options || {
        considerFunctionsEqual: false,
        compareReactChildren: false,
        propertyComparers: undefined,
        comparerName: "",
        debug: false
    };

    const debug =
        debugObjectComparerMode === "all-off"
            ? false
            : debugObjectComparerMode === "all-on"
            ? true
            : !!options.debug;

    const customPropertyComparers = options.compareReactChildren
        ? {
              children: (a: any, b: any) => {
                  if (debug) {
                      console.groupCollapsed("Compare as React children");
                  }
                  const result = shallowCompareReactChildren(a, b, debug);

                  if (debug) {
                      console.groupEnd();
                  }

                  return result;
              },
              ...(options.propertyComparers || {})
          }
        : options.propertyComparers;

    return (a: T, b: T) => {
        if (debug) {
            console.groupCollapsed(
                `${options.comparerName || "Unnamed comparer"} comparison`
            );
            console.log(a, b);
        }

        const result = arePropsEqual(
            a,
            b,
            customPropertyComparers,
            options.considerFunctionsEqual,
            debug
        );

        if (debug) {
            console.groupEnd();
        }
        return result;
    };
}

export function invert<T>(comparer: AreEqualFn<T>): AreEqualFn<T> {
    return (a: T, b: T) => !comparer(a, b);
}
