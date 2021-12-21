import React, { useState, useCallback } from 'react';

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ReactComponent as TransferIcon } from 'assets/images/icons/bitcoin-convert-white.svg';
import CloseIcon from '@material-ui/icons/Close';

import { useGameMetadataDeleteCallback } from 'modules/CoinLeagues/hooks/useGameMetadata';
import { SubmitState } from '../ButtonState';
import IntlMessages from '@crema/utility/IntlMessages';
import { useWeb3 } from 'hooks/useWeb3';


const useStyles = makeStyles((theme) => ({
    container: {
        color: '#fff',
        borderRadius: 15,
        width: '60%',
        background: '#2e3243',
        padding: theme.spacing(2),
    },
    formControl: {
        padding: theme.spacing(0.5),
    },
    radio: {
        width: '100%',
        borderRadius: 6,
        border: '1px solid #525C75',
        margin: theme.spacing(0.5),
        backgroundColor: '#3C4255',
    },
    textField: {
        marginRight: '5px',
        color: '#fff',
        borderRadius: 6,
        padding: '5px',
        backgroundColor: '#3C4255',
    },
    label: {
        color: '#fff',
        flex: 'auto',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(1),
    },
    input: {
        borderRadius: 6,
        border: '1px solid #525C75',
    },
    button: {
        fontWeight: 600,
        borderRadius: 6,
        fontSize: '1rem',
        justifyContent: 'center',
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    innerContent: {
        color: '#fff',
        fontSize: '1rem',
        padding: theme.spacing(1, 1),
        justifyContent: 'space-between',
    },
}));

interface Props {
    open: boolean;
    game: any;
    setOpen: (open: boolean) => void;
    id: string;
    onDelete: any;
}





const RemoveGameMetadataModal = (props: Props) => {
    const { open, setOpen, id, game, onDelete } = props;
    const { account } = useWeb3();
    const classes = useStyles();
    const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
    const theme = useTheme();

    const { onDeleteGameMetadata } = useGameMetadataDeleteCallback();


    const onSubmitDelete = useCallback(() => {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (hash?: string) => {
            setSubmitState(SubmitState.Submitted);
        };
        const onConfirmTx = (hash?: string) => {
            // Save here the current id minted
            setSubmitState(SubmitState.Confirmed);
            onDelete();
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        };
        const onError = (error?: any) => {
            setSubmitState(SubmitState.Error);
            setTimeout(() => {
                setSubmitState(SubmitState.None);
            }, 3000);
        };


        onDeleteGameMetadata(game, game.gameId, {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx
        })
    }, [onDeleteGameMetadata, game, setOpen, onDelete])


    const isSubmitting = useCallback(() => {
        return (
            submitState === SubmitState.WaitingWallet ||
            submitState === SubmitState.Submitted
        );
    }, [submitState]);


    return (
        <Dialog open={open}>
            <DialogTitle>
                <Grid container spacing={2}>
                    <Grid item xs={11}>
                        <Grid container spacing={2} justifyContent={'flex-start'}>
                            <Grid item>
                                <TransferIcon />
                            </Grid>
                            <Grid item>
                                <Typography variant='h6' color='error'>Are you sure you want to remove prize for game  #{id} </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={() => setOpen(false)} size='small'>
                            <CloseIcon style={{ color: '#fff' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container className={classes.innerContent} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h6' style={{ fontWeight: 600 }}>
                            Prize Information for Game #{id}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle2'>
                            Title - {game.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle2'>
                            Small  Description - {game.smallDescription}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle2'>
                            Description - {game.description}
                        </Typography>
                    </Grid>



                    <Grid item xs={12}>
                        <Button
                            onClick={onSubmitDelete}
                            disabled={isSubmitting() || !account}
                            fullWidth
                            startIcon={
                                isSubmitting() ? (
                                    <CircularProgress
                                        color='inherit'
                                        size={theme.spacing(7)}
                                    />
                                ) : (
                                    submitState !== SubmitState.None && <DoneIcon />
                                )
                            }
                            variant='contained'
                            color='secondary'>
                            {submitState === SubmitState.Confirmed ?
                                <IntlMessages id='app.coinLeague.removed' /> :
                                <IntlMessages id='app.coinLeague.remove' />}
                        </Button>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    );
};

export default RemoveGameMetadataModal;