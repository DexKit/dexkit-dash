import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// import { FormControllabel } from '@material-ui/core';


const StepModalContent: React.FC<{}> = () => {

    return (
        <div style={
            {
                width: '85%',
                height: '85%',
                marginInline: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                padding: '1rem'
            }
        }>
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
            >
                <Grid item xs={12} sm={6}>
                    <Typography>Price</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography align="right">1 ETH per 20.52 DAI</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>Market Price</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography align="right">22.22 DAI</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>Total</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography align="right">0.01 DAI</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>Estimated Fee</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography align="right">Free</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>Expires In</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography align="right">4/26/2021, 11:32:30</Typography>
                </Grid>
            </Grid>

        </div>
    )
}

export default StepModalContent;