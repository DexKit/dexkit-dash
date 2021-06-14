import React from 'react';

interface Props {
  address: string;
}

export default function AbbrAddress(props: Props) {
  const {address} = props;
  return (
    <span>
      {address.substring(0, 6)}...{address.substring(37)}
    </span>
  );
}
