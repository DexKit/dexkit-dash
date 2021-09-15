import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import {useIntl} from 'react-intl';
import {ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';

type ViewTxProps = {
  hash: string;
  networkName: EthereumNetwork;
};

export const ViewTx: React.FC<ViewTxProps> = ({hash, networkName}) => {
  const {messages} = useIntl();
  return (
    <Tooltip title={messages['app.viewTx']} placement='top'>
      <a
        href={`${ETHERSCAN_API_URL_FROM_NETWORK(networkName)}/tx/${hash}`}
        target='_blank'
        rel='noopener noreferrer'>
        {networkName === EthereumNetwork.ethereum ? (
          <Avatar
            style={{
              color: '#3F51B5',
              backgroundColor: 'white',
              width: '20px',
              height: '20px',
              marginRight: '5px',
              marginBottom: '5px',
            }}
            src='/images/etherescan.png'></Avatar>
        ) : (
          <Avatar
            style={{
              color: '#3F51B5',
              backgroundColor: 'white',
              width: '20px',
              height: '20px',
              marginRight: '5px',
              marginBottom: '5px',
            }}
            src='/images/bscscan-logo-circle.png'></Avatar>
        )}
      </a>
    </Tooltip>
  );
};
