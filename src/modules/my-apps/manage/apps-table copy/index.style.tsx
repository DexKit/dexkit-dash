import { makeStyles } from "@material-ui/core"

import { grey } from "@material-ui/core/colors"
import { Fonts } from "shared/constants/AppEnums";
import { CremaTheme } from "types/AppContextPropsType";


export const useStyles = makeStyles((theme: CremaTheme) => ({
    tableResponsiveMaterial: {
        minHeight: '.01%',
        overflowX: 'auto',

        '@media (max-width: 767px)': {
            width: '100%',
            marginBottom: 15,
            overflowY: 'hidden',
            border: `1px solid ${grey[300]}`,
            '& > table': {
                marginBottom: 0,
                '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
                    whiteSpace: 'nowrap',
                },
            },
        },
    },
    tableCell: {
        fontSize: 16,
        padding: '12px 8px',
        '&:first-child': {
            [theme.breakpoints.up('xl')]: {
                paddingLeft: 4,
            },
        },
        '&:last-child': {
            [theme.breakpoints.up('xl')]: {
                paddingRight: 4,
            },
        },
        [theme.breakpoints.up('xl')]: {
            fontSize: 18,
            padding: 16,
        },

    },
    anchar: {
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        display: 'inline-block',
    },
    badgeRoot: {
        padding: '3px 10px',
        borderRadius: 4,
        display: 'inline-block',
    },
    tableRowRoot: {
        color: grey[500],
    },
    tableCellRoot: {
        borderBottom: '0 none',
        fontSize: 16,
        padding: 8,
        fontFamily: Fonts.LIGHT,
        '&:first-child': {
            [theme.breakpoints.up('xl')]: {
                paddingLeft: 4,
            },
        },
        '&:last-child': {
            [theme.breakpoints.up('xl')]: {
                paddingRight: 4,
            },
        },
        [theme.breakpoints.up('xl')]: {
            fontSize: 18,
            padding: 16,
        },
    },
    fabButtonDiv: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 16
    }
}));
