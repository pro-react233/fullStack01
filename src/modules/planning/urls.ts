import { createPath } from "rd-url-utils";
import { PlanListRequest } from "./api";

export const PLAN_MODULE_PREFIX = "/planning";

export const PlanListUrl = createPath<{}, PlanListRequest>(
    PLAN_MODULE_PREFIX + "/plans"
);
export const PlanDetailsUrl = createPath<
    { id: string },
    { copyFromPlan?: string }
>(PLAN_MODULE_PREFIX + "/plans/:id");
