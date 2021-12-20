import React, { useState, useCallback } from 'react';

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import DoneIcon from '@material-ui/icons/Done';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as yup from 'yup';

import { useFormik } from 'formik';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ReactComponent as TransferIcon } from 'assets/images/icons/bitcoin-convert-white.svg';
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';
import { useGameMetadataUpdater } from 'modules/CoinLeagues/hooks/useGameMetadata';
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
    setOpen: (open: boolean) => void;
    id: string;
}


const validationSchema = yup.object({
    title: yup
        .string()
        .required('Title is required'),
    description: yup
        .string()
        .required('Description is required'),
    smallDescription: yup
        .string()
        .required('Small Description is required'),
});


const UpdateGameMetadataModal = (props: Props) => {
    const { open, setOpen, id } = props;
    const { account } = useWeb3();
    const classes = useStyles();
    const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
    const theme = useTheme();

    const { onPostMetadata } = useGameMetadataUpdater();
    const formik = useFormik({
        initialValues: {
            title: 'test',
            smallDescription: 'test2',
            description: 'test3',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setSubmitState(SubmitState.WaitingWallet);
            const onSubmitTx = (hash?: string) => {
                setSubmitState(SubmitState.Submitted);
            };
            const onConfirmTx = (hash?: string) => {
                // Save here the current id minted
                setSubmitState(SubmitState.Confirmed);
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


            onPostMetadata(values, id, {
                onConfirmation: onConfirmTx,
                onError,
                onSubmit: onSubmitTx
            })
        },
    });

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
                                <Typography variant='h6'>Add Prize description</Typography>
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
                            Please fill all follow fields
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>

                        <form onSubmit={formik.handleSubmit}>
                            <Grid container className={classes.innerContent} spacing={4}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size='small' className={classes.formControl}>
                                        <TextField
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            required
                                            id="title"
                                            label="Title"
                                            name='title'
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                            style={{
                                                color: '#fff',
                                                borderRadius: 6,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size='small' className={classes.formControl}>
                                        <TextField
                                            value={formik.values.smallDescription}
                                            onChange={formik.handleChange}
                                            error={formik.touched.smallDescription && Boolean(formik.errors.smallDescription)}
                                            helperText={formik.touched.smallDescription && formik.errors.smallDescription}
                                            required
                                            multiline
                                            rows={2}
                                            id="small-description"
                                            label="Small Description"
                                            name='smallDescription'
                                            style={{
                                                color: '#fff',
                                                borderRadius: 6,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size='small' className={classes.formControl}>
                                        <TextField
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                            required
                                            multiline
                                            rows={4}
                                            id="description"
                                            label="Description"
                                            name='description'
                                            style={{
                                                color: '#fff',
                                                borderRadius: 6,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
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
                                        color='primary'>
                                        {submitState === SubmitState.Confirmed ?
                                            <IntlMessages id='app.coinLeague.saved' /> :
                                            <IntlMessages id='app.coinLeague.submit' />}
                                    </Button>
                                </Grid>
                            </Grid >
                        </form>

                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    );
};

export default UpdateGameMetadataModal;