import { CustomAttributeSetState } from "./custom-attribute-set";
import { combineReducers } from "redux";
import { getCustomAttributeSetRequest } from "../api/custom-attributes";

export interface CustomAttributeModuleState {
    customAttributes: CustomAttributeSetState;
}

export const customAttributeModuleReducer = combineReducers<CustomAttributeModuleState>({
    customAttributes: getCustomAttributeSetRequest.reducer
});
