import { Select } from "antd";
import * as React from "react";
import { createObjectComparer } from "@utils";

const arePropsEqual = createObjectComparer({
    comparerName: "SelectList",
    considerFunctionsEqual: true
});

export type TSelectListValueTypes = string | number | string[];

export interface SelectListProps<TItem> {
    items: TItem[];
    getValue: (item: TItem) => TSelectListValueTypes;
    getItemEnabled?: (item: TItem) => boolean;
    value: TSelectListValueTypes;
    includeEmptyItem?: boolean;
    emptyItemText?: string;
    emptyItemValue?: TSelectListValueTypes;
    disabled?: boolean;
    children: (item: TItem) => React.ReactChild;
    onChange?: (newValue?: TSelectListValueTypes) => void;
}

export class SelectList<TItem> extends React.Component<SelectListProps<TItem>> {
    render() {
        const {
            items,
            value,
            disabled,
            includeEmptyItem,
            emptyItemText,
            emptyItemValue,
            getValue,
            getItemEnabled,
            children
        } = this.props;

        return (
            <Select
                value={value.toString()}
                onChange={this.handleChange}
                disabled={disabled}
            >
                {includeEmptyItem && (
                    <Select.Option
                        value={
                            emptyItemValue === null ||
                            emptyItemValue === undefined
                                ? ""
                                : emptyItemValue.toString()
                        }
                        key="__$$empty$$__"
                    >
                        <em>{emptyItemText || "None"}</em>
                    </Select.Option>
                )}
                {items.map(item => (
                    <Select.Option
                        value={getValue(item).toString()}
                        key={getValue(item).toString()}
                        disabled={
                            getItemEnabled ? !getItemEnabled(item) : false
                        }
                    >
                        {children(item)}
                    </Select.Option>
                ))}
            </Select>
        );
    }
    shouldComponentUpdate(nextProps: SelectListProps<TItem>) {
        return !arePropsEqual(this.props, nextProps);
    }

    private handleChange = (value: any) =>
        this.props.onChange && this.props.onChange(value);
}
