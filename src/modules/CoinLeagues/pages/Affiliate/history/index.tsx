import React from 'react';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import {Box, makeStyles, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  data: any | undefined;
  isLoading: boolean;
  page: number;
  total: number;
  isNFT: boolean;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const AffiliateHistory: React.FC<Props> = (props: Props) => {
  const {messages} = useIntl();

  const classes = useStyles();

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Typography variant='h5' display={'block'} align={'center'}>
            {messages['coinleague.affiliate.history']}
          </Typography>
        </Box>
      </Toolbar>
      <TransactionTable {...props} />
    </>
    // </AppCard>
  );
};

export default AffiliateHistory;
