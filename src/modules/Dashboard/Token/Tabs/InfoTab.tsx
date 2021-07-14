import GridContainer from "@crema/core/GridContainer";
import Grid from "@material-ui/core/Grid";
import ErrorView from "modules/Common/ErrorView";
import React from "react";
import { CoinDetailCoinGecko } from "types/coingecko/coin.interface"
import CoingeckoMarket from "../CoingeckoMarket";
import CoingeckoProfile from "../CoingeckoProfile";



type Props = {
    error: any;
    data: CoinDetailCoinGecko | undefined;
    loading: boolean;
}


export const InfoTab = (props: Props) => {
    const { error, data, loading } = props;

    return (
        <GridContainer style={{ marginTop: 15 }}>
            <Grid item xs={12} sm={6} md={6}>
                {error ? (
                    <ErrorView message={error.message} />
                ) : (
                    <CoingeckoProfile data={data} loading={loading} />
                )}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                {error ? (
                    <ErrorView message={error.message} />
                ) : (
                    <CoingeckoMarket data={data} loading={loading} />
                )}
            </Grid>
        </GridContainer>


    )


}