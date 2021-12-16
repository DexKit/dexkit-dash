import React from 'react';

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import * as yup from 'yup';

import { useFormik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as TransferIcon } from 'assets/images/icons/bitcoin-convert-white.svg';
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';




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
    const { open, setOpen } = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            title: '',
            smallDescription: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });


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
                            Prize Information
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
                                    <Button color="primary" variant="contained" fullWidth type="submit">
                                        Submit
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