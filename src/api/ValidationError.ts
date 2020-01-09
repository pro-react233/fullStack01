export interface ApiValidationError {
    propertyName: string;
    errorMessage: string;
    errorCode: string;
    formattedMessagePlaceholderValues: {
        PropertyName: string;
        PropertyValue: string;
    };
}

/** Normalizes server-side validation errors. */
export function toFormValidationErrors(
    errors: ApiValidationError[],
    prefix?: string
): { [property: string]: string[] } {
    return (prefix
        ? extractNestedErrors(errors, prefix)
        : convertValidationErrors(errors)
    ).reduce((fields, err) => {
        fields[err.propertyName] = [err.errorMessage];
        return fields;
    }, {});
}

/** Selects a validation errors started with specified prefix. */
function extractNestedErrors(
    errors: ApiValidationError[],
    prefix: string
): ValidationErrorInfo[] {
    if (!prefix) {
        throw new Error("Prefix is required");
    }

    const nestedErrors = errors
        .filter(e =>
            e.propertyName.toLowerCase().startsWith(prefix.toLowerCase())
        )
        .map(e => ({
            ...e,
            propertyName: e.propertyName.substring(prefix.length)
        }))
        .map(e => ({
            ...e,
            propertyName: e.propertyName.substring(
                e.propertyName.startsWith(".") ? 1 : 0
            )
        }));

    return convertValidationErrors(nestedErrors);
}

export function convertValidationErrors(
    errors: ApiValidationError[]
): ValidationErrorInfo[] {
    return errors.map<ValidationErrorInfo>(e => {
        const props = parseAndNormalizePropertyPath(e.propertyName);

        return {
            errorMessage: e.errorMessage,
            propertyPath: formatPropertyPath(props),
            propertyName: props[props.length - 1].property
        };
    });
}

export interface ValidationErrorInfo {
    errorMessage: string;
    propertyPath: string;
    propertyName: string;
}

/** Converts property path to camel-case */
function parseAndNormalizePropertyPath(propertyPath: string): PathInfo[] {
    if (!propertyPath) {
        throw new Error("Property Path is required");
    }

    return propertyPath.split(".").map<PathInfo>(prop => {
        const name =
            prop.indexOf("[") === -1
                ? prop
                : prop.substring(0, prop.indexOf("["));
        const index =
            prop.indexOf("[") === -1
                ? undefined
                : prop.substring(prop.indexOf("[") + 1, prop.indexOf("]"));

        return {
            property: toCamelCase(name),
            index
        };
    });
}

function formatPropertyPath(path: PathInfo[]): string {
    return path
        .map(p => {
            return p.property + (p.index === undefined ? "" : `[${p.index}]`);
        })
        .join(".");
}

interface PathInfo {
    property: string;
    index?: string;
}

function toCamelCase(val: string): string {
    if (!val) {
        return val;
    }

    return val.substring(0, 1).toLowerCase() + val.substring(1);
}
