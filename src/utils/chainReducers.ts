import { Action } from "redux";

export type ReducerFn<TState> = (state: TState, action: Action) => TState;

export function chainReducers<TState>(
    ...reducers: ReducerFn<TState>[]
): ReducerFn<TState> {
    return (state: TState, action: Action) =>
        reducers.reduce(
            (newState, reducer) => reducer(newState, action),
            state
        );
}
