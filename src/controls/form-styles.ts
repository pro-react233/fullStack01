import { Theme, createStyles } from "@material-ui/core";

export const formStyles = ({ spacing, palette }: Theme) =>
    createStyles({
        field: {
            margin: spacing.unit
        },
        form: {
            padding: spacing.unit * 2
        },
        buttonContainer: {
            paddingTop: spacing.unit * 2,
            paddingBottom: spacing.unit * 2
        },
        button: {
            marginRight: spacing.unit * 2
        },
        header: {
            marginBottom: spacing.unit * 3
        },
        nestedForm: {
            paddingLeft: spacing.unit * 3,
            paddingBottom: spacing.unit * 3
        }
    });
