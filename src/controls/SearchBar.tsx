import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import { Form, Input, Icon } from "antd";
import * as React from "react";
const styles = ({  }: Theme) =>
    createStyles({
        searchBar: {
            display: "flex",
            flexFlow: "row nowrap",
            alignItems: "center"
        }
    });

export interface SearchBarProps {
    value: string;
    onChange?: (newValue: string) => void;
    disabled?: boolean;
    className?: string;
}

export const SearchBar = withStyles(styles)(function SearchBar({
    value,
    disabled,
    className,
    classes,
    onChange
}: SearchBarProps & WithStyles<typeof styles>) {
    return (
        <Form
            layout="inline"
            onSubmit={e => {
                e.preventDefault();

                if (onChange && !disabled) {
                    const search = e.currentTarget["search-bar"].value;
                    onChange(search);
                }
            }}
        >
            <Form.Item>
                <Input
                    defaultValue={value}
                    prefix={<Icon type="search" />}
                    placeholder="Search..."
                    name="search-bar"
                />
            </Form.Item>
        </Form>
        // <form
        //     className={cn(classes.searchBar, className)}
        //     onSubmit={e => {
        //         e.preventDefault();

        //         if (onChange && !disabled) {
        //             const search = e.currentTarget["search-bar"].value;
        //             onChange(search);
        //         }
        //     }}
        // >
        //     <Search color={!!disabled ? "disabled" : "inherit"} />
        //     <TextField
        //         name="search-bar"
        //         placeholder="Search..."
        //         defaultValue={value}
        //         disabled={disabled}
        //     />
        // </form>
    );
}) as React.ComponentType<SearchBarProps>;
