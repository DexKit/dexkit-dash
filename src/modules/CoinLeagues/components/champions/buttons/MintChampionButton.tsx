import React, {useEffect, useState} from 'react';

import {Button} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

interface Props {
  canMintChampion: () => boolean;
  onMintChampion: () => void;
}

export function MintChampionButton(props: Props) {
  const {canMintChampion, onMintChampion} = props;
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
      disabled={disabled}
      onClick={onMintChampion}
      fullWidth
      startIcon={<AddIcon />}
      variant='contained'
      color='primary'>
      Create Champion
    </Button>
  );
}
