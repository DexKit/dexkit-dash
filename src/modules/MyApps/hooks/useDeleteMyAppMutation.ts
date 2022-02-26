import { eip712Utils } from "@0x/order-utils";
import { EIP712TypedData, MetamaskSubprovider } from "@0x/subproviders";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { useWeb3 } from "hooks/useWeb3";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { ChainId } from "types/blockchain";
import { deleteConfig } from "../services/config";
import { onAddNotification } from "redux/actions";
import { NotificationType } from 'services/notification';
import { Notification as CustomNotification } from 'types/models/Notification';
import { useIntl } from "react-intl";

export const useDeleteMyAppMutation = () => {
    const { getProvider } = useWeb3();
    const dispatch = useDispatch();
    const intl = useIntl();
    return useMutation(({ domain, account, chainId }: { account: string, domain: string, chainId: ChainId }) => {
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
                message: intl.formatMessage({ id: 'myapps.deleteAggregator', defaultMessage: 'I want to delete app with domain {domain} ' }, { domain: domain }),
                terms: 'Powered by DexKit'
            }
        };


        const web3Metamask = new Web3Wrapper(provider);

        const typedData = eip712Utils.createTypedData(
            msgParams.primaryType,
            msgParams.types,
            msgParams.message,
            // @ts-ignore
            msgParams.domain,
        );

        return web3Metamask
            .signTypedDataAsync(ethAccount.toLowerCase(), typedData)
            .then((signature) => {
                const dataToSend = {
                    signature,
                    domain,
                    message: JSON.stringify(typedData),
                    owner: ethAccount,
                };

                return deleteConfig(dataToSend, account, domain)
                    .then((c: any) => {

                        const notification: CustomNotification = {
                            title: intl.formatMessage({ id: 'myapps.deleteSuccessTitle', defaultMessage: 'App deleted' }),
                            body: intl.formatMessage({ id: 'myapps.deleteSuccessBody', defaultMessage: 'App was deleted' }),
                        };
                        dispatch(onAddNotification([notification]));


                    })
                    .catch(() => {

                        const notification: CustomNotification = {
                            title: 'Error',
                            body: intl.formatMessage({ id: 'myapps.deleteErrorBody', defaultMessage: 'Error deleting your app, contact support' }),
                        };
                        dispatch(
                            onAddNotification([notification], NotificationType.ERROR),
                        );
                        throw Error('error on deleting config from API')

                    });
            })



    })

}