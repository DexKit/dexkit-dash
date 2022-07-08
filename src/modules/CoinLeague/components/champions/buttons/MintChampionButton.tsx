import React, {useEffect, useState} from 'react';

import {Button} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

interface Props {
  canMintChampion: () => boolean;
  onMintChampion: () => void;
  soldOut?: boolean;
}

export function MintChampionButton(props: Props) {
  const {canMintChampion, onMintChampion, soldOut} = props;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (canMintChampion()) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [canMintChampion]);

  return (
    <Button
      disabled={disabled || soldOut}
      onClick={onMintChampion}
      fullWidth
      startIcon={<AddIcon />}
      variant='contained'
      color='primary'>
      {soldOut ? 'Sold Out' : 'Create Champion'}
    </Button>
  );
}
