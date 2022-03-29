import React, {useState, useCallback} from 'react';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
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

import {useFormik} from 'formik';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';
import {
  useGameMetadata,
  useGameMetadataUpdater,
} from 'modules/CoinLeagues/hooks/useGameMetadata';
import {SubmitState} from '../ButtonState';
import IntlMessages from '@crema/utility/IntlMessages';
import {useWeb3} from 'hooks/useWeb3';
import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {GET_CHAIN_ID_NAME} from 'shared/constants/Blockchain';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

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
  gameMetadata?: {
    title?: string;
    description?: string;
    smallDescription?: string;
    creator?: string;
  };
}

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  smallDescription: yup.string().required('Small Description is required'),
});

const UpdateGameMetadataModal = (props: Props) => {
  const {open, setOpen, id, gameMetadata} = props;

  const {formatMessage} = useIntl();

  const {refetch} = useGameMetadata(id);
  const {account, chainId} = useWeb3();
  const {chainId: chainIdGame} = useLeaguesChainInfo();
  const classes = useStyles();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const theme = useTheme();

  const {onPostMetadata} = useGameMetadataUpdater();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: gameMetadata?.title,
      smallDescription: gameMetadata?.smallDescription,
      description: gameMetadata?.description,
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
        refetch();
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
        onSubmit: onSubmitTx,
      });
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
      <CustomDialogTitle
        icon={<CrownIcon />}
        onClose={() => setOpen(false)}
        title={formatMessage({
          id: 'coinLeague.addPrizeDescription',
          defaultMessage: 'Add Prize description',
        })}
      />
      <Divider />
      <DialogContent>
        <Grid container className={classes.innerContent} spacing={4}>
          <Grid item xs={12}>
            <Typography variant='h6' style={{fontWeight: 600}}>
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
                  <TextField
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    required
                    id='title'
                    label={
                      <IntlMessages
                        id='coinLeague.title'
                        defaultMessage='Title'
                      />
                    }
                    name='title'
                    fullWidth
                    variant='outlined'
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    value={formik.values.smallDescription}
                    onChange={formik.handleChange}
                    fullWidth
                    error={
                      formik.touched.smallDescription &&
                      Boolean(formik.errors.smallDescription)
                    }
                    helperText={
                      formik.touched.smallDescription &&
                      formik.errors.smallDescription
                    }
                    required
                    multiline
                    rows={2}
                    id='small-description'
                    label={
                      <IntlMessages
                        id='coinLeague.smallDescription'
                        defaultMessage='Small Description'
                      />
                    }
                    name='smallDescription'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    fullWidth
                    required
                    multiline
                    rows={4}
                    id='description'
                    label={
                      <IntlMessages
                        id='coinLeague.smallDescription'
                        defaultMessage='Small Description'
                      />
                    }
                    name='description'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    disabled={
                      isSubmitting() || !account || chainId !== chainIdGame
                    }
                    fullWidth
                    startIcon={
                      isSubmitting() ? (
                        <CircularProgress color='inherit' size='1rem' />
                      ) : (
                        submitState !== SubmitState.None && <DoneIcon />
                      )
                    }
                    variant='contained'
                    color='primary'>
                    {submitState === SubmitState.Confirmed ? (
                      <IntlMessages id='app.coinLeague.saved' />
                    ) : chainId !== chainIdGame ? (
                      <IntlMessages
                        id='app.coinLeague.pleaseSwitchCorrectChain'
                        values={{
                          chainName: `${GET_CHAIN_ID_NAME(chainIdGame)}`,
                        }}
                      />
                    ) : (
                      <IntlMessages id='app.coinLeague.submit' />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGameMetadataModal;
