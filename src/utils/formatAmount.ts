import formatNumber from "format-number";

export const formatAmount = formatNumber({
    decimal: ".",
    decimalsSeparator: " ",
    integerSeparator: " ",
    round: 2,
    padRight: 2
});
