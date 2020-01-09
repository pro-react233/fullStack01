import {
    AreEqualFn,
    areValuesStrictOrNullishEqual,
    shallowCompareArrays,
    shallowCompareValues
} from "./comparers";

export function arePropsEqual(
    a: any,
    b: any,
    customPropComparers: { [key: string]: AreEqualFn } | undefined,
    considerFuncAlwaysEqual: boolean,
    debug: boolean
): boolean {
    if (areValuesStrictOrNullishEqual(a, b, debug)) {
        if (debug) {
            console.log("Values are strict or nullish equal");
        }

        return true;
    }

    // Return false because one of values is null or undefined and other is not
    if (a == null || b == null) {
        return false;
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            if (debug) {
                console.log("Not equal: one value is array, other is not");
            }

            return false;
        }

        if (debug) {
            console.groupCollapsed("Comparing as arrays");
        }

        const result = shallowCompareArrays(a, b, undefined, debug);

        if (debug) {
            console.log(`Arrays are ${result ? "equal" : "not equal"}`);
            console.groupEnd();
        }

        return result;
    }

    if (
        typeof a === "bigint" ||
        typeof a === "boolean" ||
        typeof a === "number" ||
        typeof a === "string" ||
        typeof a === "symbol"
    ) {
        const result = a === b;

        if (debug) {
            console.log("Compared by value with result", result);
        }

        return result;
    }

    if (a instanceof Date && b instanceof Date) {
        const result = a.valueOf() === b.valueOf();

        if (debug) {
            console.log(
                "Values are Dates, compared values with result",
                result
            );
        }

        return result;
    }

    if (typeof a === "function") {
        const result = considerFuncAlwaysEqual === true ? true : a === b;

        if (debug) {
            console.log(
                "Values are functions, compared with result",
                result,
                ", considered fns always equal: ",
                considerFuncAlwaysEqual
            );
        }

        return result;
    }

    if (debug) {
        console.log("Comparing properties");
    }

    for (const key of Object.keys(a)) {
        if (debug) {
            console.groupCollapsed(key);
        }

        const aVal = a[key];
        const bVal = b[key];

        if (debug) {
            console.log(aVal, bVal);
        }

        if (considerFuncAlwaysEqual) {
            if (typeof aVal === "function" && typeof bVal === "function") {
                if (debug) {
                    console.log(
                        "Property values are functions and fns equality mode is on"
                    );
                    console.groupEnd();
                }

                continue;
            }
        }

        if (debug) {
            if (customPropComparers && key in customPropComparers) {
                console.log("Using custom property comparer");
            }
        }

        const comparer = customPropComparers
            ? customPropComparers[key] ||
              ((a, b) => shallowCompareValues(a, b, debug))
            : (a: any, b: any) => shallowCompareValues(a, b, debug);

        if (!comparer(aVal, bVal)) {
            if (debug) {
                console.groupEnd();
                console.log(
                    "Objects are not equal: values of property ",
                    key,
                    " are not equal: ",
                    aVal,
                    bVal
                );
            }

            return false;
        }

        if (debug) {
            console.log("Propery values are equal");
            console.groupEnd();
        }
    }

    for (const key of Object.keys(b)) {
        if (!(key in a)) {
            // This check is required because
            // propery may not exists in a but be null or undefined in b
            // and this would not break the equality.
            if (!shallowCompareValues(a[key], b[key], debug)) {
                return false;
            }
        }
    }

    if (debug) {
        console.log("Props are equal");
    }

    return true;
}
