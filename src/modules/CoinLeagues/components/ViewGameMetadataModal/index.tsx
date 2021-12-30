import React from 'react';

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { truncateAddress } from 'utils';
import { GET_CREATOR_LABELS } from 'modules/CoinLeagues/utils/game';
import { ReactComponent as CrownIcon } from 'assets/images/icons/crown.svg';

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
    gameMetadata: {
        title?: string,
        description?: string;
        smallDescription?: string;
        creator?: string;
    }
}



const ViewGameMetadataModal = (props: Props) => {
    const { open, setOpen, gameMetadata } = props;
    const classes = useStyles();

    return (
        <Dialog open={open}>
            <DialogTitle>
                <Grid container spacing={2}>
                    <Grid item xs={11}>
                        <Grid container spacing={2} justifyContent={'flex-start'}>
                            <Grid item>
                                <CrownIcon />
                            </Grid>
                            <Grid item>
                                <Typography variant='h6'>Game - {gameMetadata?.title}</Typography>
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
                <Grid container className={classes.innerContent} spacing={5}>
                    <Grid item xs={12}>
                        <Typography variant='h3' style={{ fontWeight: 500 }}>
                            {gameMetadata?.title}
                        </Typography>
                    </Grid>


                    <Grid item xs={12}>
                        <Typography variant='h6' style={{ fontWeight: 500 }}>
                            {gameMetadata?.smallDescription}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body1'>
                            {gameMetadata?.description}
                        </Typography>

                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant='body1'>
                            Created By:  {GET_CREATOR_LABELS(gameMetadata?.creator) ? GET_CREATOR_LABELS(gameMetadata?.creator) : truncateAddress(gameMetadata?.creator)}
                        </Typography>

                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    );
};

export default ViewGameMetadataModal;