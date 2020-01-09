import * as React from "react";

export type AreEqualFn<T = any> = (
    a: T | null | undefined,
    b: T | null | undefined
) => boolean;

export function shallowCompareValues(a: any, b: any, debug: boolean) {
    if (areValuesStrictOrNullishEqual(a, b, debug)) {
        return true;
    }

    // Return false because one of values is null or undefined and other is not
    if (a == null || b == null) {
        if (debug) {
            console.log(
                "One of values is nullish while other is not, considered not equal",
                a,
                b
            );
        }
        return false;
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            if (debug) {
                console.log(
                    "First value is array, other is not, considered not equal",
                    a,
                    b
                );
            }

            return false;
        }

        if (debug) {
            console.log("Both values are arrays, compare arrays", a, b);
        }

        if (debug) {
            console.groupCollapsed("Comparing as arrays");
        }

        const result = shallowCompareArrays(a, b, null, debug);
        if (debug) {
            console.groupEnd();
        }

        return result;
    }

    if (debug) {
        console.log("Compare values using strict equality", a, b);
    }

    return a === b;
}

export function shallowCompareArrays(
    a: any[] | undefined | null,
    b: any[] | undefined | null,
    compareValues: AreEqualFn | undefined,
    debug: boolean
): boolean {
    if (areValuesStrictOrNullishEqual(a, b, debug)) {
        return true;
    }

    // Return false because one of values is null or undefined and other is not
    if (a == null || b == null) {
        return false;
    }

    if (a.length !== b.length) {
        if (debug) {
            console.log(
                "Arrays not equal because have different length",
                a.length,
                b.length
            );
        }

        return false;
    }

    compareValues =
        compareValues || ((a, b) => shallowCompareValues(a, b, debug));

    for (let i = 0; i < a.length; i++) {
        if (debug) {
            console.groupCollapsed(`[${i}]`);
            console.log(a[i], b[i]);
        }

        if (!compareValues(a[i], b[i])) {
            if (debug) {
                console.log(
                    "Elements are different, arrays considered not equal"
                );
                console.groupEnd();
            }
            return false;
        }

        if (debug) {
            console.groupEnd();
        }
    }

    if (debug) {
        console.log("Arrays considered equal", a, b);
    }

    return true;
}

export function shallowCompareReactChildren(
    a: any,
    b: any,
    debug: boolean
): boolean {
    if (areValuesStrictOrNullishEqual(a, b, debug)) {
        return b === null || b === undefined;
    }

    const childrenA = React.Children.toArray(a);
    const childrenB = React.Children.toArray(b);

    const result = shallowCompareArrays(childrenA, childrenB, null, debug);

    return result;
}

export function areValuesStrictOrNullishEqual(
    a: any,
    b: any,
    debug: boolean
): boolean {
    if (a === b) {
        if (debug) {
            console.log("Values are strictly equal");
        }

        return true;
    }
    const result =
        (a === null || a === undefined) && (b === null || b === undefined);

    if (debug) {
        console.log("Comparing for nullish equality: ", result);
    }

    return result;
}
