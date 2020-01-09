export interface CustomAttributeValueInfo {
    attributeKey: string;
    refId: number;
    title: string;
    parentAttributeKey: string | null;
    parentId: number;
    isActive: boolean;
}

export interface CustomAttributeSet {
    [attributeKey: string]: CustomAttributeValueInfo[];
}

export interface CustomAttributeValue {
    attribute: string;
    ref: number;
}
