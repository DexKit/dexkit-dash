import React from 'react';
import {useCallback, useState} from 'react';

import {ethers} from 'ethers';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

/**
 * Create Game
 * @returns
 */
export const CreateGame = () => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [numCoins, setNumCoins] = useState<number>(1);
  const [duration, setDuration] = useState<number>(30);
  const [amount, setAmount] = useState<number>(0.1);
  const [abortTimestamp, setAbortTimestamp] = useState<string>();
  const {onGameCreateCallback} = useCoinsLeagueFactory();

  const onSubmit = useCallback(
    (ev: any) => {
      ev.preventDefault();
      if (abortTimestamp) {
        const amountUnit = ethers.utils.parseEther(String(amount));
        onGameCreateCallback({
          numPlayers: numPlayers,
          duration: duration,
          amountUnit: amountUnit,
          numCoins: numCoins,
          abortTimestamp: Math.round(new Date(abortTimestamp).getTime() / 1000),
        });
      }
    },
    [numPlayers, numCoins, duration, amount],
  );

  return (
    <section className='create-game-section'>
      <h3>Create Game</h3>
      <form onSubmit={onSubmit} className='create-game-form'>
        <label>Number of players:</label>
        <input
          type='number'
          min='2'
          max='10'
          id='numPlayers'
          name='numPlayers'
          value={numPlayers}
          required
          onChange={(ev) => setNumPlayers(Number(ev.target.value))}
        />
        <label>Duration (minutes):</label>
        <input
          type='text'
          id='duration'
          name='duration'
          min='10'
          value={duration}
          onChange={(ev) => setDuration(Number(ev.target.value))}
          required
        />
        <label>Amount (Matic):</label>
        <input
          type='number'
          min='0'
          id='amount'
          name='amount'
          step='.01'
          value={amount}
          onChange={(ev) => setAmount(Number(ev.target.value))}
          required
        />
        <label>Nr Coins:</label>
        <input
          type='number'
          min='1'
          id='coins'
          name='coins'
          step='1'
          value={numCoins}
          onChange={(ev) => setNumCoins(Number(ev.target.value))}
          required
        />
        <label>Abort Timestamp:</label>
        <input
          type='date'
          id='abort'
          name='abort'
          onChange={(ev) => {
            setAbortTimestamp(ev.target.value);
          }}
          required
        />
        <input type='submit' value='Submit' />
      </form>
    </section>
  );
};
