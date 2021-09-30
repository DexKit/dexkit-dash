import Button from '@material-ui/core/Button';
import {useDrop} from 'modules/DropPad/hooks/useDrop';
import React, {useCallback, useState} from 'react';
import {ButtonState, SubmitState} from '../ButtonState';

type Props = {
  address: string;
};

export const MintButton = (props: Props) => {
  const {address} = props;
  const {drop, onMintCallback} = useDrop(address);
  const [tx, setTx] = useState<string>();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);

  const onMint = useCallback(
    (ev: any) => {
      if (!drop) {
        return;
      }
      setSubmitState(SubmitState.WaitingWallet);
      const onSubmitTx = (tx: string) => {
        setTx(tx);
        setSubmitState(SubmitState.Submitted);
      };
      const onConfirmTx = () => {
        setSubmitState(SubmitState.Confirmed);
      };
      const onError = () => {
        setSubmitState(SubmitState.Error);
        setTimeout(() => {
          setSubmitState(SubmitState.None);
        }, 3000);
      };

      onMintCallback(drop.price, {
        onConfirmation: onConfirmTx,
        onError,
        onSubmit: onSubmitTx,
      });
    },
    [drop],
  );

  return (
    <Button
      disabled={submitState !== SubmitState.None}
      onClick={onMint}
      variant={'contained'}
      fullWidth
      color={submitState === SubmitState.Error ? 'default' : 'primary'}>
      <ButtonState
        state={submitState}
        defaultMsg={'Buy Card'}
        confirmedMsg={'Success'}
      />
    </Button>
  );
};
