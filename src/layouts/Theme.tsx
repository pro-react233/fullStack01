import * as React from "react";
import {
    MuiThemeProvider,
    createMuiTheme,
    CssBaseline
} from "@material-ui/core";
import primary from "@material-ui/core/colors/blueGrey";
import secondary from "@material-ui/core/colors/amber";

export interface ThemeComponentProps {
    children?: React.ReactChild | React.ReactChild[];
}

const theme = createMuiTheme({
    palette: {
        primary,
        secondary
    },
    typography: {
        useNextVariants: true
    }
});

export function Theme(
    props: ThemeComponentProps
): React.ReactElement<ThemeComponentProps> {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
        </MuiThemeProvider>
    );
}
