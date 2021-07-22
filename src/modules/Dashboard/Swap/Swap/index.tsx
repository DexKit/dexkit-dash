import Typography from "@material-ui/core/Typography"
import React, { useEffect, useState } from "react"
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Changelly } from "services/rest/changelly";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from "@material-ui/core/CircularProgress";
import { ChangellyCoin, ChangellyTransaction } from "types/changelly";
import { LoadingSkeleton } from "./Components/LoadingSkeleton";
import IconButton from '@material-ui/core/IconButton';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { ReceiveAddress } from "./Components/ReceiveAddress";
import { Steps } from "./Provider";
import { ReviewOrder } from "./Components/ReviewOrder";
import Checkbox from '@material-ui/core/Checkbox';


export const SwapComponent = () => {
    const [loading, setLoading] = useState(false);
    const [toLoading, setToLoading] = useState(false);
    const [step, setStep] = useState(Steps.Exchange);
    const [acceptAML, setAcceptAML] = useState(false);
    const [fromLoading, setFromLoading] = useState(false);
    const [coins, setCoins] = useState<ChangellyCoin[]>();
    const [fromCoin, setFromCoin] = useState<ChangellyCoin>();
    const [toCoin, setToCoin] = useState<ChangellyCoin>();
    const [fromAmount, setFromAmount] = useState<number>();
    const [minFromAmount, setMinFromAmount] = useState<number>(0)
    const [toAmount, setToAmount] = useState<number>();
    const [addressToSend, setAddressToSend] = useState<string>();
    const [validAddress, setValidAddress] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<ChangellyTransaction>();

    const getTextButton = () => {
        switch (step) {
            case Steps.Exchange:
                return 'Exchange'
            case Steps.SetWallet:
                return 'Review Order'
            case Steps.ReviewOrder:
                return ''
            case Steps.WaitOrder:
                return 'Processing'
            case Steps.OrderFinish:
                return 'Order Processed'
            default:
                break;
        }
    }

    useEffect(() => {
        const fetchInit = async () => {
            setLoading(true)
            const currFull = await Changelly.getCurrenciesFull();
            const currencies = currFull.result.filter((c: any) => c.enabled);
            setCoins(currencies);
            const btc = currencies.find((c: any) => c.ticker.toLowerCase() === 'btc');
            const eth = currencies.find((c: any) => c.ticker.toLowerCase() === 'eth');
            if (!toCoin) {
                setToCoin(btc);
            }
            if (!fromCoin) {
                setFromCoin(eth);
            }
            if (!btc || !eth) {
                return;
            }
            setLoading(false)

            const r = await Changelly.getMinAmount({ from: eth.ticker, to: btc.ticker });

            if (r.result) {
                const newAmount = Number(r.result);
                setMinFromAmount(newAmount);
                setFromAmount(newAmount);
                setToLoading(true);
                const res = await Changelly.getExchangeAmount({ from: eth.ticker, to: btc.ticker, amount: newAmount.toString() });
                if (res.result) {
                    const am = Number(res.result);
                    setToAmount(am);
                }
                setToLoading(false);

            } else {
                return;
            }
        }
        fetchInit();
    }, [])


    

    const onChangeFromAmount = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!fromCoin || !toCoin) {
            return
        }
        const amount = Number(ev.target.value);
        setFromAmount(amount);
        setToLoading(true);
        Changelly.getExchangeAmount({ from: fromCoin?.ticker, to: toCoin?.ticker, amount: amount.toString() })
            .then((res) => {
                const am = Number(res.result);
                setToAmount(am);
            }).finally(() => setToLoading(false));
    }
    const onSwitchCoin = () => {
        if (!fromCoin || !toCoin) {
            return
        }

        setFromCoin(toCoin);
        setToCoin(fromCoin);
        const switchCoin = async () => {
            setValidAddress(false);
            try {
                setFromLoading(true);
                const r = await Changelly.getMinAmount({ from: toCoin.ticker, to: fromCoin.ticker });
                setFromLoading(false);
                if (r.result) {
                    const newAmount = Number(r.result);
                    setMinFromAmount(newAmount);
                    setFromAmount(newAmount);
                    setToLoading(true);
                    const res = await Changelly.getExchangeAmount({ from: toCoin.ticker, to: fromCoin.ticker, amount: newAmount.toString() });
                    if (res.result) {
                        const am = Number(res.result);
                        setToAmount(am);
                    }
                    setToLoading(false);

                } else {

                    return;
                }
            } catch {
                setFromLoading(false);
                setToLoading(false);
            }

        }
        switchCoin();
    }


    const onChangeToAmount = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!fromCoin || !toCoin) {
            return
        }
        const amount = Number(ev.target.value);
        setToAmount(amount);
        setFromLoading(true)
        Changelly.getExchangeAmount({ from: toCoin?.ticker, to: fromCoin?.ticker, amount: amount.toString() })
            .then((res) => {
                const am = Number(res.result);
                setFromAmount(am);
            }).finally(() => setFromLoading(false));
    }
    const advanceStep = () => {
        setStep(step + 1);
    }
    const revertStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    }

    const priceText = (toAmount && toAmount && toAmount !== 0)
        && `1 ${toCoin?.name?.toUpperCase()} ≈  ${Number(Number(fromAmount) / Number(toAmount)).toFixed(8)}  ${fromCoin?.name.toUpperCase()} `;

    const disabledButton = step === Steps.SetWallet && ( !validAddress || !acceptAML);

    return <Card>
                <CardHeader
                    title="Multichain Swap"
                    action={
                        step !== Steps.Exchange &&
                        <IconButton aria-label="back" onClick={revertStep}>
                            <ArrowBackIcon />
                            <Typography component={'p'}>Back</Typography>
                        </IconButton>
                    }

                />
        <CardContent>
            {loading ? <LoadingSkeleton /> :
             (step === Steps.SetWallet ||  step === Steps.Exchange) &&  <Grid container spacing={2} direction="row">

                    <Grid container xs={12} alignItems="center" spacing={1}>
                        <Grid item xs={12}>
                            <Typography component={'h1'}>You Send</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                size="large"
                                variant="contained"
                                endIcon={<ExpandMoreIcon />}
                            >
                                {fromCoin?.name.toUpperCase()}
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            {fromLoading ? <CircularProgress /> :
                                <TextField
                                    id="from-amount"
                                    type="number"
                                    variant="filled"
                                    placeholder="0.00"
                                    value={fromAmount}
                                    onChange={onChangeFromAmount}
                                    fullWidth
                                    inputProps={{
                                        step: 0.0000001,
                                        min: 0,
                                    }}
                                    helperText={`Minimum Amount ${minFromAmount} ${fromCoin?.name.toUpperCase()}`}
                                />}
                        </Grid>
                    </Grid>
                    <Grid container xs={12} spacing={2} alignItems="center" justify='center'>
                        <Grid item xs={6}>
                            <IconButton aria-label="switch" onClick={onSwitchCoin}>
                                <ImportExportIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography component={'p'}>
                                {priceText}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container xs={12} spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Typography component={'h1'}>You Receive</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                size="large"
                                variant="contained"

                                endIcon={<ExpandMoreIcon />}
                            >
                                {toCoin?.name.toUpperCase()}

                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            {toLoading ? <CircularProgress /> :
                                <TextField
                                    id="to-amount"
                                    type={'number'}
                                    variant="filled"
                                    placeholder="0.00"
                                    value={toAmount}
                                    onChange={onChangeToAmount}
                                    fullWidth
                                    inputProps={{
                                        step: 0.0000001,
                                        min: 0,
                                    }}

                                />}
                        </Grid>
                    </Grid>



                    {step === Steps.SetWallet &&
                        <ReceiveAddress  
                            coin={toCoin} 
                            address={addressToSend} 
                            validAddress={validAddress} 
                            onChange={(add) => setAddressToSend(add)} 
                            onSetValidAddress={(valid)=> setValidAddress(valid)}
                         />
                      }
                      {step === Steps.SetWallet &&
                        <Grid item xs={12} >
                             <Checkbox
                                checked={acceptAML}
                                onChange={()=> setAcceptAML(!acceptAML)}
                                inputProps={{ 'aria-label': 'servicesCheckbox' }}
                            />

                             <Typography component={'p'}>
                                “Exchange services provided by Changelly. 
                                By clicking “Accept”, I acknowledge and understand that my transaction may trigger AML/KYC verification according to Changelly AML/KYC”
                                </Typography>
                         </Grid>
                      }
                </Grid>
            }
             {(step === Steps.ReviewOrder && fromCoin && toCoin && addressToSend && fromAmount && toAmount) &&
                        <ReviewOrder
                            fromCoin={fromCoin} 
                            toCoin={toCoin} 
                            toAddress={addressToSend} 
                            fromAmount={fromAmount} 
                            toAmount={toAmount} 
                            transaction={transaction}
                            onTransaction={(t)=> setTransaction(t)}
                         />
                      }

        </CardContent>


        <CardActions >
        {(step === Steps.SetWallet ||  step === Steps.Exchange) &&   <Grid container xs={12} spacing={2} alignItems="center" justify='center'>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={disabledButton}
                    onClick={() => advanceStep()}
                >
                    {getTextButton()}

                </Button>
            </Grid>}

        </CardActions>
    </Card>

}