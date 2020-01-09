import { createObjectComparer, invert } from "@utils";
import { Form } from "antd";
import * as cn from "classnames";
import { FieldInfo } from "rd-redux-forms";
import * as React from "react";
import { compose, setDisplayName, shouldUpdate } from "recompose";

const arePropsEqual = createObjectComparer<FieldProps>({
    comparerName: "Field",
    compareReactChildren: true,
    considerFunctionsEqual: true,
    debug: true,
    propertyComparers: {
        field: createObjectComparer({
            comparerName: "Field.field"
        }),
        children: (a, b) => true
    }
});

export interface FieldProps {
    field?: FieldInfo;
    label: string;
    isRequired?: boolean;
    disabled?: boolean;
    className?: string;
    children?: React.ReactChild | React.ReactChild[];
}

export class AntdField extends React.PureComponent<FieldProps> {
    render() {
        const { className, children, field, label } = this.props;
        const hasError = field && field.visualState === "invalid";

        return (
            <div
                className={cn(
                    "ant-row ant-form-item ant-form-item-with-help",
                    className
                )}
            >
                <div className="ant-form-item-label">
                    <label title={label}>{label}</label>
                </div>
                <div className="ant-form-item-control-wrapper">
                    <div
                        className={cn("ant-form-item-control", {
                            "has-error": hasError
                        })}
                    >
                        <span className="ant-form-item-children">
                            {children}
                        </span>
                        {hasError && (
                            <div className="ant-form-explain">
                                {field &&
                                field.visualState === "invalid" &&
                                (field.isParsed == false ||
                                    field.hasCustomErrors)
                                    ? field.errors[0]
                                    : undefined}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    shouldComponentUpdate(nextProps: FieldProps) {
        return !arePropsEqual(this.props, nextProps);
    }
}

export const Field = compose<FieldProps, FieldProps>(
    setDisplayName("Field"),
    shouldUpdate(
        invert(
            createObjectComparer<FieldProps>({
                comparerName: "Field",
                compareReactChildren: true,
                considerFunctionsEqual: true,
                debug: true,
                propertyComparers: {
                    field: createObjectComparer({
                        comparerName: "Field.field"
                    })
                }
            })
        )
    )
)(function(props: FieldProps) {
    const { className, children, field, isRequired, label } = props;
    return (
        <Form.Item
            label={label}
            validateStatus={
                field && field.visualState === "invalid"
                    ? "error"
                    : field && field.visualState === "valid"
                    ? "success"
                    : ""
            }
            className={className}
            required={!!isRequired}
            help={
                field &&
                field.visualState === "invalid" &&
                (field.isParsed == false || field.hasCustomErrors)
                    ? field.errors[0]
                    : undefined
            }
        >
            {children}
        </Form.Item>
    );
});
