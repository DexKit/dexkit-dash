import { EIP712TypedData, MetamaskSubprovider } from "@0x/subproviders";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { useWeb3 } from "hooks/useWeb3";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { onAddNotification } from "redux/actions";
import { eip712Utils } from '@0x/order-utils';
import { NotificationType } from 'services/notification';
import { Notification as CustomNotification } from 'types/models/Notification';
import { setupDomainConfig } from "../services/config";
import { useMyAppsConfig } from "hooks/myApps/useMyAppsConfig";
import { useIntl } from "react-intl";

export const useSetupDomainConfig = () => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [isDone, setDone] = useState(false);
    const { account, chainId, getProvider } = useWeb3();
    const dispatch = useDispatch();
    const { refetch } = useMyAppsConfig(account);
    const { formatMessage } = useIntl();


    const onSendDomainConfigCallback = useCallback((dataSubmit: any, type: string) => {
        if (!isLoading) {
            setLoading(true);
            setError(false);
            setDone(false);
            try {
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
                            message: formatMessage({ id: 'myapps.editAggregator', defaultMessage: `I want to create/edit this {type}` }, { type: type.toLowerCase() }),
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
                                slug: dataSubmit.slug,
                                domain: dataSubmit.domain,
                                message: JSON.stringify(typedData),
                                owner: ethAccount,
                            };

                            setupDomainConfig(dataToSend)
                                .then((c: any) => {
                                    const notification: CustomNotification = {
                                        title: formatMessage({ id: 'myapps.domainAcceptedTitle', defaultMessage: 'Domain Accepted' }),
                                        body: formatMessage({ id: 'myapps.domainAcceptedBody', defaultMessage: 'Domain was added to system, now you need to add CNAME to your hosting' }),
                                    };
                                    dispatch(onAddNotification([notification]));
                                    setLoading(false);
                                    setDone(true);
                                    refetch();
                                    setTimeout(() => {
                                        setDone(false);
                                    }, 10000)
                                })
                                .catch(() => {
                                    const notification: CustomNotification = {
                                        title: 'Error',
                                        body: formatMessage({ id: 'myapps.domainConfigError', defaultMessage: 'Config error! Do you have KIT?' }),
                                    };
                                    dispatch(
                                        onAddNotification([notification], NotificationType.ERROR),
                                    );
                                    setLoading(false);
                                });
                        }).catch(() => {

                            setError(true);
                            setTimeout(() => {
                                setError(false);
                            }, 5000)
                            setLoading(false);


                        });
                }
            } catch (error) {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 5000)
                setLoading(false);
            }


        }


    }, [account, chainId, dispatch, getProvider, isLoading, setError, formatMessage, refetch])


    return { onSendDomainConfigCallback, isLoading, isError, isDone }
}