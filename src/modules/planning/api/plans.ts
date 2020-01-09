import {
    apiUrl,
    customFetch,
    ListRequest,
    PageResult,
    PropsOf,
    ApiValidationError
} from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";
import { PlanInfo, PlanData, PlanningEventInfo } from "./api";

const reduxMw = reduxHttpMiddlewareFactory();

export type PlanSortableProps = PropsOf<PlanInfo, "id" | "name" | "isActive">;

export type PlanListRequest = ListRequest<PlanSortableProps>;

export const getPlansListRequest = reduxMw.register(
    http
        .get<PlanListRequest>(apiUrl("/planning/plan"), true)
        .withFetch(customFetch)
        .resultFromJson<PageResult<PlanInfo>>()
        .build()
);

export const getPlanByIdRequest = reduxMw.register(
    http
        .get<{ id: string }>(apiUrl("/planning/plan/:id"), false)
        .withFetch(customFetch)
        .resultFromJson<PlanData>()
        .build()
);

export const postPlanRequest = reduxMw.register(
    http
        .post<{}>(apiUrl("/planning/plan"))
        .withFetch(customFetch)
        .jsonBody<PlanData>()
        .resultFromJson<PlanData, ApiValidationError[]>()
        .build()
);

export const getPlanningEventsRequest = reduxMw.register(
    http
        .get<{ planId: number }>(
            apiUrl("/planning/planning-events/:planId"),
            false
        )
        .withFetch(customFetch)
        .resultFromJson<PlanningEventInfo[]>()
        .build()
);
