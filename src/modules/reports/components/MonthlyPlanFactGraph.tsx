import { AutoScaleSvg } from "@components";
import * as d3 from "d3";
import * as React from "react";
import { PlanFactFinResultsReportRecord } from "../api";
import "./MonthlyPlanFactGraph.less";
import { sort, formatAmount } from "@utils";
import * as moment from "moment";
import * as cn from "classnames";

export interface MonthlyPlanFactGraphProps {
    data: PlanFactFinResultsReportRecord[];
    onMonthSelected: (month: string) => void;
}

const WIDTH = 100;
const HEIGHT = 33;

const PADDING_HORIZ = 5;
const PADDING_VERT = 5;

const LEFT = PADDING_HORIZ * 3;
const RIGHT = WIDTH - PADDING_HORIZ * 2;
const TOP = PADDING_VERT;
const BOTTOM = HEIGHT - PADDING_VERT * 2;

type ChartDataEntry = ReplaceTypes<
    PlanFactFinResultsReportRecord,
    {
        occurredAtMonth: Date;
    }
>;

export function MonthlyPlanFactGraph({
    data,
    onMonthSelected
}: MonthlyPlanFactGraphProps) {
    const entries = sort(
        data.map(d => ({
            ...d,
            occurredAtMonth: new Date(d.occurredAtMonth),
            factMonthlyExpence: d.factMonthlyExpence,
            factMonthlyIncome: d.factMonthlyIncome,
            factMonthlyTotal: d.factMonthlyTotal,
            planMonthlyExpence: d.planMonthlyExpence,
            planMonthlyIncome: d.planMonthlyIncome,
            planMonthlyTotal: d.planMonthlyTotal
        })),
        i => i.occurredAtMonth
    );

    const maxAmount = d3.max(data, a =>
        d3.max(
            [
                a.factMonthlyExpence,
                a.factMonthlyIncome,
                a.factMonthlyTotal,
                a.planMonthlyExpence,
                a.planMonthlyIncome,
                a.planMonthlyTotal
            ].map(Math.abs)
        )
    );

    const dates = d3.extent(entries.map(d => d.occurredAtMonth));

    const xScale = d3
        .scaleTime()
        .domain(dates)
        .range([LEFT, RIGHT]);

    const yScale = d3
        .scaleLinear()
        .domain([0, maxAmount])
        .nice()
        .range([BOTTOM, TOP]);

    return (
        <AutoScaleSvg
            viewportHeight={33}
            viewportWidth={100}
            className="MonthlyPlanFactGraph"
        >
            <VerticalAxis amountScale={yScale} />
            <HorizontalAxis
                dates={entries.map(e => e.occurredAtMonth)}
                dateScale={xScale}
                onMonthSelected={onMonthSelected}
            />
            <ChartArea
                className="plan income"
                data={entries}
                value={e => e.planMonthlyIncome}
                xScale={xScale}
                yScale={yScale}
                onMonthSelected={onMonthSelected}
            />
            <ChartArea
                className="plan expence"
                data={entries}
                value={e => e.planMonthlyExpence}
                xScale={xScale}
                yScale={yScale}
                onMonthSelected={onMonthSelected}
            />
            <ChartBar
                className="fact total"
                data={entries}
                value={e => e.factMonthlyTotal}
                xScale={xScale}
                yScale={yScale}
                onMonthSelected={onMonthSelected}
            />
            <ChartLine
                className="fact income"
                data={entries}
                value={e => e.factMonthlyIncome}
                xScale={xScale}
                yScale={yScale}
                onMonthSelected={onMonthSelected}
            />
            <ChartLine
                className="fact expence"
                data={entries}
                value={e => e.factMonthlyExpence}
                xScale={xScale}
                yScale={yScale}
                onMonthSelected={onMonthSelected}
            />
        </AutoScaleSvg>
    );
}

function ChartLine({
    data,
    value,
    xScale,
    yScale,
    className,
    onMonthSelected
}: {
    data: ChartDataEntry[];
    value: (item: ChartDataEntry) => number;
    xScale: d3.ScaleTime<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    className: string;
    onMonthSelected: (month: string) => void;
}) {
    data = data.filter(i => value(i) !== null);

    const line = d3
        .line<ChartDataEntry>()
        .x(i => xScale(new Date(i.occurredAtMonth)))
        .y(i => yScale(Math.abs(value(i))));

    return (
        <>
            <path
                className={cn("MonthlyPlanFactGraph__line", className)}
                d={line(data)}
                key="chart-line"
            />
            {data.map((item, index) => (
                <circle
                    className={cn("MonthlyPlanFactGraph__dot", className)}
                    cx={xScale(item.occurredAtMonth)}
                    cy={yScale(Math.abs(value(item)))}
                    r="3em"
                    key={index}
                    onClick={() =>
                        onMonthSelected(
                            moment(item.occurredAtMonth).format("YYYY-MM-DD")
                        )
                    }
                >
                    <title>{formatAmount(value(item) || 0)}</title>
                </circle>
            ))}
        </>
    );
}

function ChartArea({
    data,
    value,
    xScale,
    yScale,
    className,
    onMonthSelected
}: {
    data: ChartDataEntry[];
    value: (item: ChartDataEntry) => number;
    xScale: d3.ScaleTime<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    className: string;
    onMonthSelected: (month: string) => void;
}) {
    data = data.filter(i => value(i) !== null && value(i) !== 0);

    const line = d3
        .area<ChartDataEntry>()
        .x(i => xScale(new Date(i.occurredAtMonth)))
        .y0(yScale(0))
        .y1(i => yScale(Math.abs(value(i))));

    return (
        <>
            <path
                className={cn("MonthlyPlanFactGraph__area", className)}
                d={line(data)}
                key="chart-area"
            />
            {data.map((item, index) => (
                <circle
                    className={cn("MonthlyPlanFactGraph__dot", className)}
                    cx={xScale(item.occurredAtMonth)}
                    cy={yScale(Math.abs(value(item)))}
                    r="3em"
                    key={index}
                    onClick={() =>
                        onMonthSelected(
                            moment(item.occurredAtMonth).format("YYYY-MM-DD")
                        )
                    }
                >
                    <title>{formatAmount(value(item) || 0)}</title>
                </circle>
            ))}
        </>
    );
}

function ChartBar({
    data,
    value,
    xScale,
    yScale,
    className,
    onMonthSelected
}: {
    data: ChartDataEntry[];
    value: (item: ChartDataEntry) => number;
    xScale: d3.ScaleTime<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    className: string;
    onMonthSelected: (month: string) => void;
}) {
    data = data.filter(i => value(i) !== null && value(i) !== 0);

    return (
        <>
            {data.map((item, index) => (
                <rect
                    className={cn("MonthlyPlanFactGraph__bar", className, {
                        negative: value(item) < 0
                    })}
                    x={xScale(item.occurredAtMonth)}
                    y={yScale(Math.abs(value(item)))}
                    width="5em"
                    height={yScale(0) - yScale(Math.abs(value(item)))}
                    key={index}
                    onClick={() =>
                        onMonthSelected(
                            moment(item.occurredAtMonth).format("YYYY-MM-DD")
                        )
                    }
                >
                    <title>{formatAmount(value(item) || 0)}</title>
                </rect>
            ))}
        </>
    );
}

function VerticalAxis({
    amountScale
}: {
    amountScale: d3.ScaleLinear<number, number>;
}) {
    const ticks = amountScale.ticks();
    return (
        <>
            <line
                className="MonthlyPlanFactGraph__axis vertical"
                y1={TOP}
                y2={BOTTOM}
                x1={LEFT}
                x2={LEFT}
            />
            {ticks.map((t, index) => (
                <React.Fragment key={index}>
                    <line
                        className="MonthlyPlanFactGraph__tick vertical"
                        x1={LEFT - 0.5}
                        x2={LEFT}
                        y1={amountScale(t)}
                        y2={amountScale(t)}
                    />
                    <text
                        className="MonthlyPlanFactGraph__legend vertical"
                        x={LEFT - 0.7}
                        y={amountScale(t)}
                    >
                        {formatAmount(t)}
                    </text>
                    <line
                        className="MonthlyPlanFactGraph__tick vertical passthrough"
                        x1={LEFT}
                        x2={RIGHT}
                        y1={amountScale(t)}
                        y2={amountScale(t)}
                    />
                </React.Fragment>
            ))}
        </>
    );
}

function HorizontalAxis({
    dates,
    dateScale,
    onMonthSelected
}: {
    dates: Date[];
    dateScale: d3.ScaleTime<number, number>;
    onMonthSelected: (month: string) => void;
}) {
    return (
        <>
            <line
                className="MonthlyPlanFactGraph__axis horizontal"
                y1={BOTTOM}
                y2={BOTTOM}
                x1={LEFT}
                x2={RIGHT}
            />
            {dates.map((d, index) => (
                <React.Fragment key={d.toISOString()}>
                    <line
                        className="MonthlyPlanFactGraph__tick horizontal"
                        x1={dateScale(d)}
                        x2={dateScale(d)}
                        y1={BOTTOM}
                        y2={BOTTOM + 1}
                    />
                    <text
                        className="MonthlyPlanFactGraph__legend horizontal"
                        x={dateScale(d)}
                        y={BOTTOM + 1}
                        dy="1em"
                        onClick={() =>
                            onMonthSelected(moment(d).format("YYYY-MM-DD"))
                        }
                    >
                        {moment(d).format("MMM YY")}
                    </text>
                    {index > 0 ? (
                        <line
                            className="MonthlyPlanFactGraph__tick horizontal passthrough"
                            x1={dateScale(d)}
                            x2={dateScale(d)}
                            y1={TOP}
                            y2={BOTTOM}
                        />
                    ) : null}
                </React.Fragment>
            ))}
        </>
    );
}

type HasKeys<T> = { [P in keyof T]?: any };

type ReplaceTypes<TProps, TWithProps extends HasKeys<TProps>> = {
    [P in keyof TProps]: (P extends keyof TWithProps
        ? TWithProps[P]
        : TProps[P])
};
