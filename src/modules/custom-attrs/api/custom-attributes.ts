import { apiUrl, customFetch } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";
import { CustomAttributeSet } from "./api";

const reduxMw = reduxHttpMiddlewareFactory();

export const getCustomAttributeSetRequest = reduxMw.register(
    http
        .get(apiUrl("/attr/attributes"), true)
        .withFetch(customFetch)
        .resultFromJson<CustomAttributeSet>()
        .build()
);
