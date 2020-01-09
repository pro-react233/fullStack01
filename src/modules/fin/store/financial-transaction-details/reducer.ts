import { combineReducersPartial, defineActionGroup } from "rd-redux-utils";
import {
    getTransactionDetailsRequest,
    postTransactionRequest
} from "../../api";
import { finTransactionForm } from "./form";
import {
    defaultFinTransactionDetailsDataState,
    defaultTransactionDetailsState,
    FinancialTransactionDetailsState
} from "./state";
import { copyTransactionAction } from "./actions";
import { chainReducers } from "@utils";

const finTransactionActionGroup = defineActionGroup<{ id: string }>(
    "FIN TRANSACTION EDIT"
)
    .includeAction(getTransactionDetailsRequest.actions.isMy, a => ({
        id: a.params.id
    }))
    .includeAction(finTransactionForm.actions.isMyAction, a => ({
        id: a.meta.id
    }))
    .includeAction(postTransactionRequest.actions.isMy, a => ({
        id: a.params.id
    }))
    .includeAction(copyTransactionAction.is, a => ({
        id: "new"
    }));

const finTransDetailsReducer = combineReducersPartial(
    {
        data: getTransactionDetailsRequest.reducer,
        form: chainReducers<typeof finTransactionForm.types.state>(
            finTransactionForm.reducer,
            (state, action) => {
                if (copyTransactionAction.is(action)) {
                    return finTransactionForm.state.withData({
                        ...action.copyFromTransaction
                    });
                }
                return state;
            }
        ),
        saving: postTransactionRequest.reducer
    },
    defaultFinTransactionDetailsDataState
);

export const financialTransactionDetailsReducer = combineReducersPartial<
    FinancialTransactionDetailsState
>(
    {
        finTransactions: finTransactionActionGroup.hashedReducer(
            a => a.id,
            finTransDetailsReducer
        )
    },
    defaultTransactionDetailsState
);
