import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useInterval from "hooks/useInterval"
import React, { useEffect, useState } from "react"
import { Changelly } from "services/rest/changelly"
import ButtonCopy from "shared/components/ButtonCopy"
import { ChangellyCoin, ChangellyTransaction } from "types/changelly"
import CircularProgress from "@material-ui/core/CircularProgress";
interface Props {
    toAddress: string,
    fromCoin: ChangellyCoin,
    toCoin: ChangellyCoin,
    fromAmount: number,
    toAmount: number,
    onTransaction: (transaction: ChangellyTransaction) => void,
    transaction?: ChangellyTransaction,
}


export const ReviewOrder = (props: Props) => {
    const { fromAmount, toAmount, toAddress, fromCoin, toCoin, onTransaction, transaction } = props;
    const [status, setStatus] = useState()


    useEffect(() => {
        
            Changelly
                .createTransaction({ from: fromCoin.ticker, to: toCoin.ticker, amount: fromAmount.toString(), address: toAddress })
                .then(r => {
                    console.log(r.result)

                    onTransaction(r.result as ChangellyTransaction)
                })
        
    }, [])
    useEffect(()=>{
        if (transaction) {
            Changelly.getStatus(transaction.id).then(r => setStatus(r.result));
            console.log(transaction)
        }

    },[transaction])

    useInterval(() => {
        if (transaction) {
            Changelly.getStatus(transaction.id).then(r => setStatus(r.result));
            console.log(transaction)

        }
    }, 30000)



    return <Grid container xs={12} alignItems="center" spacing={1} direction={'row'}>
        <Grid item xs={12}>
            <Typography component={'h1'}>You send: {transaction?.amountExpectedFrom} {fromCoin.name.toUpperCase()}
            </Typography>
            {transaction && <ButtonCopy copyText={transaction?.amountExpectedFrom} titleText={transaction?.amountExpectedFrom} />}
        </Grid>
        <Grid item xs={12}>
            <Typography component={'h1'}>You Receive: {transaction?.amountExpectedTo} {toCoin.name.toUpperCase()}</Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography component={'h1'}>
                Send To address
                    </Typography>
        </Grid>
        {transaction && <Grid item xs={12}>
            <Typography component={'h1'}>{transaction.payinAddress}</Typography>
            <ButtonCopy copyText={transaction.payinAddress} titleText={transaction.payinAddress} />
        </Grid>}
        <Grid item xs={12}>
            {transaction && <Typography component={'h1'}>
                KYC Required: {String(transaction.kycRequired).toUpperCase()}
            </Typography>}
        </Grid>

        {transaction && <Grid item xs={12}>

            <Typography component={'h1'}>
                Status: {status}
            </Typography>
        </Grid>}
        {transaction && <Grid item xs={12}>

            <Typography component={'h1'}>
                Transaction ID : {transaction?.id}
            </Typography>
            <ButtonCopy copyText={transaction?.id} titleText={transaction?.id} />
        </Grid>}
        {
            (status && status === 'hold') && <Grid item xs={12}>

                <Typography component={'h1'}>
                    Changelly Verification Required
                    </Typography>
                <Typography component={'p'}>
                    Changelly is a third party application. The transaction you requested will be held for you until you are verified.
                    </Typography>
                <Typography component={'p'}>
                    To get Verified
                    </Typography>
                <Typography component={'p'}>
                    1. send an email to security@changelly.com
                    </Typography>
                <Typography component={'p'}>
                    2. In the subject line, enter the following information:  Transaction ID: {transaction?.id}
                </Typography>
            </Grid>

        }
       {(status && status !== 'finished') &&  <CircularProgress />}

    </Grid>
}