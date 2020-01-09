import { Field } from "@controls";
import { AppState } from "@store";
import { sort, createObjectComparer } from "@utils";
import { FetchingState } from "rd-redux-http";
import * as React from "react";
import { connect } from "react-redux";
import { CustomAttributeSet, CustomAttributeValue } from "../api";
import { Row, Col, Select } from "antd";

interface CustomAttributeEditorComponentProps {
    value: CustomAttributeValue[];
    all: CustomAttributeSet;
    fieldClassName?: string;
    disabled: boolean;
    onChange: (newValue: CustomAttributeValue[]) => void;
}

function CustomAttributeEditorComponent({
    all,
    value,
    fieldClassName,
    disabled,
    onChange
}: CustomAttributeEditorComponentProps) {
    return (
        <Row gutter={16}>
            {Object.keys(all).map(attrName => {
                const attrValues = sort(
                    all[attrName],
                    [a => a.isActive, "desc"],
                    a => a.title
                );
                const attrValue = (value || []).find(
                    v => v.attribute === attrName
                );

                return (
                    <Col key={`AttrKey-${attrName}`} xs={24}>
                        <Field label={attrName} className={fieldClassName}>
                            <Select
                                value={attrValue ? attrValue.ref : 0}
                                disabled={disabled}
                                onChange={e => {
                                    const newAttr: CustomAttributeValue = {
                                        attribute: attrName,
                                        ref: e
                                    };

                                    const newValue = [
                                        ...value.filter(
                                            v =>
                                                v.attribute !==
                                                newAttr.attribute
                                        ),
                                        ...(newAttr.ref === 0 ? [] : [newAttr])
                                    ];

                                    onChange(newValue);
                                }}
                            >
                                <Select.Option value={0} key="empty">
                                    <em>None</em>
                                </Select.Option>
                                {attrValues.map(i => (
                                    <Select.Option
                                        value={i.refId}
                                        key={`AttrValue-${i.refId}`}
                                        disabled={!i.isActive}
                                    >
                                        {i.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Field>
                    </Col>
                );
            })}
        </Row>
    );
}

export interface CustomAttributeEditorProps {
    value: CustomAttributeValue[];
    disabled: boolean;
    fieldClassName?: string;
    onChange: (value: CustomAttributeValue[]) => void;
}

export const CustomAttributeEditor = connect(
    (appState: AppState, ownProps: CustomAttributeEditorProps) => {
        return {
            disabled: ownProps.disabled,
            value: ownProps.value,
            all: FetchingState.getDataOrDefault(
                appState.customAttrs.customAttributes,
                {}
            ),
            fieldClassName: ownProps.fieldClassName,
            onChange: ownProps.onChange
        };
    },
    undefined,
    undefined,
    {
        areStatePropsEqual: createObjectComparer({
            comparerName: "CustomAttributeEditor"
        }),
        getDisplayName: () => "CustomAttributeEditor"
    }
)(CustomAttributeEditorComponent);
