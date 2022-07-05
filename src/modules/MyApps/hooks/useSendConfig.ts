import { EIP712TypedData, MetamaskSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { useWeb3 } from 'hooks/useWeb3';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { onAddNotification } from 'redux/actions';
import { eip712Utils } from '@0x/order-utils';
import { Notification as CustomNotification } from 'types/models/Notification';
import { sendConfig } from '../services/config';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

export const useSendConfig = () => {

  const { account, chainId, getProvider } = useWeb3();
  const dispatch = useDispatch();
  const history = useHistory();
  const { formatMessage } = useIntl();

  const onSendConfigMutation = useMutation(
    async ({ config, type }: { config: any, type: string }) => {

      if (account) {
        const ethAccount = account;
        const provider = new MetamaskSubprovider(getProvider() as any);

        const msgParams: EIP712TypedData = {
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' },
            ],
            Message: [
              { name: 'message', type: 'string' },
              { name: 'terms', type: 'string' },
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
              { type: type.toLowerCase() },
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

        const signature = await web3Metamask
          .signTypedDataAsync(ethAccount.toLowerCase(), typedData);

        const dataToSend = {
          signature,
          type: type,
          config: JSON.stringify(config),
          message: JSON.stringify(typedData),
          owner: ethAccount,
        };

        await sendConfig(dataToSend);

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




      }

    })


  return { onSendConfigMutation };
};
