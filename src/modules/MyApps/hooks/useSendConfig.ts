import {EIP712TypedData, MetamaskSubprovider} from '@0x/subproviders';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {onAddNotification} from 'redux/actions';
import {eip712Utils} from '@0x/order-utils';
import {Notification as CustomNotification} from 'types/models/Notification';
import {sendConfig} from '../services/config';
import {useIntl} from 'react-intl';

export const useSendConfig = () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const {account, chainId, getProvider} = useWeb3();
  const dispatch = useDispatch();
  const history = useHistory();
  const {formatMessage} = useIntl();

  const onSendConfigCallback = useCallback(
    (config: any, type: string) => {
      if (!isLoading) {
        setLoading(true);
        setError(false);

        try {
          if (account) {
            const ethAccount = account;
            const provider = new MetamaskSubprovider(getProvider() as any);

            const msgParams: EIP712TypedData = {
              types: {
                EIP712Domain: [
                  {name: 'name', type: 'string'},
                  {name: 'version', type: 'string'},
                  {name: 'chainId', type: 'uint256'},
                  {name: 'verifyingContract', type: 'address'},
                ],
                Message: [
                  {name: 'message', type: 'string'},
                  {name: 'terms', type: 'string'},
                ],
              },
              primaryType: 'Message',
              domain: {
                name: 'DexKit',
                version: '1',
                chainId: chainId || 1,
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
              },
              message: {
                message: formatMessage(
                  {
                    id: 'myapps.editAggregator',
                    defaultMessage: `I want to create/edit this {type}`,
                  },
                  {type: type.toLowerCase()},
                ),
                terms: 'Powered by DexKit',
              },
            };

            const web3Metamask = new Web3Wrapper(provider);

            const typedData = eip712Utils.createTypedData(
              msgParams.primaryType,
              msgParams.types,
              msgParams.message,
              // @ts-ignore
              msgParams.domain,
            );

            web3Metamask
              .signTypedDataAsync(ethAccount.toLowerCase(), typedData)
              .then((signature) => {
                const dataToSend = {
                  signature,
                  type: type,
                  config: JSON.stringify(config),
                  message: JSON.stringify(typedData),
                  owner: ethAccount,
                };

                sendConfig(dataToSend)
                  .then((c: any) => {
                    const notification: CustomNotification = {
                      title: formatMessage({
                        id: 'myapps.configAcceptedTitle',
                        defaultMessage: 'Config Accepted',
                      }),
                      body: formatMessage({
                        id: 'myapps.configAcceptedBody',
                        defaultMessage: 'Config Created',
                      }),
                    };
                    dispatch(onAddNotification([notification]));
                    history.push(`/my-apps/manage`);
                    setLoading(false);
                  })
                  .catch(() => {
                    setError(true);
                    setTimeout(() => {
                      setError(false);
                    }, 5000);
                    const notification: CustomNotification = {
                      title: 'Error',
                      body: formatMessage({
                        id: 'myapps.domainConfigError',
                        defaultMessage: 'Config error! Do you have KIT?',
                      }),
                    };
                    dispatch(onAddNotification([notification]));
                    setLoading(false);
                  });
              })
              .catch(() => {
                setError(true);
                setLoading(false);
                setTimeout(() => {
                  setError(false);
                }, 5000);
              });
          }
        } catch (error) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 5000);
          setLoading(false);
        }
      }
    },
    [
      account,
      chainId,
      dispatch,
      getProvider,
      history,
      isLoading,
      setError,
      formatMessage,
    ],
  );

  return {onSendConfigCallback, isLoading, isError};
};
