import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

import { useWeb3 } from 'hooks/useWeb3';

import { eip712Utils } from '@0x/order-utils';
import { MetamaskSubprovider } from '@0x/subproviders';
import { EIP712TypedData } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { sendConfig } from 'services/my-apps';
import { NotificationType } from 'services/notification';
import { ConfigFile, WhitelabelTypes } from 'types/myApps';
import { onAddNotification } from 'redux/actions';

interface SubmitProps {
  text: string;
  data: ConfigFile;
  valid: boolean;
  type: WhitelabelTypes;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
  }));

export const SubmitComponent: React.FC<SubmitProps> = (props) => {
  const classes = useStyles();
  const { data/*: config*/, type, valid, text } = props;
  const { chainId, account, getProvider } = useWeb3();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const submit = ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    //send data
    if (!isLoading) {
      setLoading(true);
      setTimeout(function () {

        // let object: any = {};
        // (data as FormData).forEach((value, key) => {
        //   // Reflect.has in favor of: object.hasOwnProperty(key)
        //   if (!Reflect.has(object, key)) {
        //     object[key] = JSON.parse(value.toString());
        //     return;
        //   }
        //   if (!Array.isArray(object[key])) {
        //     object[key] = [object[key]];
        //   }
        //   object[key].push(JSON.parse(value.toString()));
        // });

        var config = JSON.stringify(data);

        try {
          if (account) {
            const ethAccount = account;
            const provider = new MetamaskSubprovider(getProvider());

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
                message: `I want to create/edit this ${type.toLowerCase()}`,
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

            web3Metamask.signTypedDataAsync(ethAccount.toLowerCase(), typedData).then(signature => {

              console.log(config)

              const dataToSend = {
                signature,
                type: type,
                config: config,
                message: JSON.stringify(typedData),
                owner: ethAccount
              }
              
              console.log(dataToSend)

              //console.log(JSON.stringify(json))
              sendConfig(dataToSend)
                .then((c: any) => {
                  const notification = new Notification('Config Accepted', { body: 'Config created' });
                  dispatch(onAddNotification(notification));
                  // history.push(`/my-apps/manage`);
                })
                .catch(() => {
                  const notification = new Notification('Error', { body: 'Config error! Do you have KIT?' });
                  dispatch(onAddNotification(notification, NotificationType.ERROR));
                })
            })
          }
        } catch (error) {
          throw new Error(error.message);
        }

        setLoading(false);
      }, 2000);
    }
  }

  return (
    <Button
      disabled={isLoading || !valid}
      variant="contained"
      color="primary"
      onClick={submit}
      className={classes.button}
    >
      { text }
    </Button>
  )
}
