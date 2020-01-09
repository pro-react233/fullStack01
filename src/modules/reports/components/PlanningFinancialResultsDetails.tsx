import * as React from "react";
import * as cn from "classnames";
import { MonthlyFinancialResultsRecord } from "../api";
import * as moment from "moment";
import "./PlanningFinancialResultsDetails.less";

export interface PlanningFinancialResultsDetailsProps {
    data: MonthlyFinancialResultsRecord[];
}

export function PlanningFinancialResultsDetails({
    data
}: PlanningFinancialResultsDetailsProps) {
    return (
        <table className="PlanningFinancialDetails">
            <thead>
                <tr>
                    <th>Month</th>
                    <th className="PlanningFinancialDetails__col results">
                        Results
                    </th>
                    <th>Date</th>
                    <th className="PlanningFinancialDetails__col amount">
                        Amount
                    </th>
                    <th>Schedule</th>
                </tr>
            </thead>
            <tbody>
                {data
                    .map(monthInfo =>
                        monthInfo.events.map((eventInfo, index) => (
                            <tr
                                className={cn(
                                    "PlanningFinancialDetails__event",
                                    {
                                        "month-first": index === 0,
                                        "month-last":
                                            index ===
                                            monthInfo.events.length - 1
                                    }
                                )}
                                key={eventInfo.id.toString()}
                            >
                                {index === 0 && (
                                    <td rowSpan={monthInfo.events.length}>
                                        {moment(monthInfo.month).format(
                                            "YYYY MMM"
                                        )}
                                    </td>
                                )}
                                {index === 0 && (
                                    <td
                                        rowSpan={monthInfo.events.length}
                                        className="PlanningFinancialDetails__col results"
                                    >
                                        +
                                        {monthInfo.monthlyTotalIncome.toFixed(
                                            2
                                        )}
                                        <br />
                                        {monthInfo.monthlyTotalExpence.toFixed(
                                            2
                                        )}
                                        <br />
                                        {monthInfo.monthlyTotal.toFixed(2)}
                                        <br />(
                                        {monthInfo.monthlySlidingTotal.toFixed(
                                            2
                                        )}
                                        )
                                    </td>
                                )}
                                <td>
                                    {moment(eventInfo.occurredAt).format(
                                        "DD MMM"
                                    )}
                                </td>
                                <td className="PlanningFinancialDetails__col amount">
                                    {eventInfo.amount.toFixed(2)}{" "}
                                    {eventInfo.currency}
                                </td>
                                <td>{eventInfo.scheduleName}</td>
                            </tr>
                        ))
                    )
                    .reduce((result, arr) => [...result, ...arr], [])}
            </tbody>
        </table>
    );
}
