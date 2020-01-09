import * as moment from "moment";

export const specialFields = {
    momentDate(required: boolean) {
        return {
            parse(value: any): string {
                if (!value) {
                    if (required) {
                        throw new Error("Value is required");
                    } else {
                        return undefined;
                    }
                }

                const parsed = moment(value);

                if (!parsed.isValid()) {
                    throw new Error("Value is not valid date");
                }

                return parsed.toISOString();
            },
            formatForDisplay(value: any) {
                if (!value && !required) {
                    return value;
                }

                return moment(value);
            },
            formatForEditing(value: any) {
                if (!value) {
                    return null;
                }

                return moment(value);
            }
        };
    }
};
