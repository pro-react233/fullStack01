type ValuePropertyNames<T> = {
    [P in keyof T]: T[P] extends Function ? never : P
}[keyof T];

export type ValueProperties<T> = Pick<T, ValuePropertyNames<T>>;

type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
