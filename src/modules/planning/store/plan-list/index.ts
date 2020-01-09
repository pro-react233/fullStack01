import { createGenericList } from "@store";
import { getPlansListRequest } from "../../api";
import { PlanListUrl } from "../../urls";

const { defaultState: defaultPlanListState, reducer: planListReducer, saga: planListSaga } = createGenericList(
    getPlansListRequest,
    PlanListUrl
);

export { defaultPlanListState, planListReducer, planListSaga };
