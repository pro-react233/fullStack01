import * as React from "react";
import { AppBar, Tabs, Tab, PropTypes } from "@material-ui/core";
import { TabProps } from "@material-ui/core/Tab";
import { TabsProps } from "@material-ui/core/Tabs";
import { TabIndicatorProps } from "@material-ui/core/Tabs/TabIndicator";

export interface TabContainerProps {
    tabBarColor?: PropTypes.Color;
    centered?: boolean;
    fullWidth?: boolean;
    indicatorColor?: "secondary" | "primary" | string;
    component?: React.ReactType<TabsProps>;
    scrollable?: boolean;
    ScrollButtonComponent?: React.ReactType;
    scrollButtons?: "auto" | "on" | "off";
    TabIndicatorProps?: Partial<TabIndicatorProps>;
    textColor?: "secondary" | "primary" | "inherit" | string;
    width?: string;
    children: React.ReactElement<TabItemProps>[] | React.ReactElement<TabItemProps>;
}

interface TabContainerState {
    selectedTab: number;
}

export class TabContainer extends React.Component<TabContainerProps, TabContainerState> {
    state = { selectedTab: 0 };

    render() {
        const { tabBarColor, children, ...tabsProps } = this.props;

        const tabs = (React.Children.toArray(children) as React.ReactElement<TabItemProps>[])
            .filter(t => React.isValidElement(t))
            .map(t => {
                const { children, ...rest } = t.props;
                return {
                    children: t.props.children,
                    tabProps: rest
                };
            });

        if (!tabs.length) {
            return null;
        }

        return (
            <div>
                <AppBar position="static" color={tabBarColor}>
                    <Tabs {...tabsProps} value={this.state.selectedTab} onChange={this.handleChange}>
                        {tabs.map((tab, index) => (
                            <Tab {...tab.tabProps} key={index.toString()} />
                        ))}
                    </Tabs>
                </AppBar>
                {tabs[this.state.selectedTab].children}
            </div>
        );
    }

    private handleChange = (_: any, value: number) => this.setState({ selectedTab: value });
}

export interface TabItemProps extends TabProps {
    children: React.ReactChild | React.ReactChild[];
}

export function TabItem(_props: TabItemProps): JSX.Element {
    return null;
}
