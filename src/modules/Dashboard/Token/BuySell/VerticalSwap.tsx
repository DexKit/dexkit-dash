import React from 'react'
import { Grid, Box, makeStyles } from '@material-ui/core'
import {CremaTheme} from 'types/AppContextPropsType';
import {ReactComponent as SwapVertIcon} from '../../../../assets/images/icons/verticalswap.svg';

type TradeButtonProps = {
    switchTokens: () => void;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
    swap: {
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        marginTop: 8
    }
}))

export default ({ switchTokens }: TradeButtonProps) => {
    const classes = useStyles()
    return (
        <Grid className={classes.swap} xs={12}>
            <Box
                color='grey.400'
                textAlign='center'
                onClick={() => switchTokens()}>
                <SwapVertIcon />
            </Box>
        </Grid>
    )
}
