import { EIP712TypedData, MetamaskSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { useWeb3 } from 'hooks/useWeb3';
import { useDispatch } from 'react-redux';
import { onAddNotification } from 'redux/actions';
import { eip712Utils } from '@0x/order-utils';
import { Notification as CustomNotification } from 'types/models/Notification';
import { setupDomainConfig } from '../services/config';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useMyAppsConfig } from './useMyAppsConfig';

export const useSetupDomainConfig = () => {
  const { account, chainId, getProvider } = useWeb3();
  const dispatch = useDispatch();
  const { refetch } = useMyAppsConfig(account);
  const { formatMessage } = useIntl();

  const onSendDomainConfigMutation = useMutation(
    async (params: { dataSubmit: any, type: string }) => {

      const ethAccount = account as string;
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
            { type: params.type.toLowerCase() },
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
        type: params.type,
        slug: params.dataSubmit.slug,
        domain: params.dataSubmit.domain,
        message: JSON.stringify(typedData),
        owner: ethAccount,
      };

      await setupDomainConfig(dataToSend);

      const notification: CustomNotification = {
        title: formatMessage({
          id: 'myapps.domainAcceptedTitle',
          defaultMessage: 'Domain Accepted',
        }),
        body: formatMessage({
          id: 'myapps.domainAcceptedBody',
          defaultMessage:
            'Domain was added to system, now you need to add CNAME to your hosting',
        }),
      };
      dispatch(onAddNotification([notification]));

      refetch();




      /*    const notification: CustomNotification = {
            title: 'Error',
            body: formatMessage({
              id: 'myapps.domainConfigError',
              defaultMessage: 'Config error! Do you have KIT?',
            }),
          };
          dispatch(onAddNotification([notification]));
          setLoading(false);*/

    })


  return { onSendDomainConfigMutation };
};
