import React from 'react';

interface Props {
  type?: number;
}

export const AAdsCoinleagueBanner = (props: Props) => {
  const {type} = props;

  if (type === 2) {
    return (
      <iframe
        title='aAdsCoinleague'
        data-aa='1987100'
        src='//ad.a-ads.com/1987100?size=320x50'
        style={{
          width: '320px',
          height: '50px',
          border: '0px',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  if (type === 1) {
    return (
      <iframe
        title='aAdsCoinleague'
        data-aa='1987094'
        src='//ad.a-ads.com/1987094?size=728x90'
        style={{
          width: '728px',
          height: '90px',
          border: '0px',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  return (
    <iframe
      title='aAdsCoinleague'
      data-aa='1987083'
      src='//ad.a-ads.com/1987083?size=970x90'
      style={{
        width: '970px',
        height: '90px',
        border: '0px',
        padding: '0',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    />
  );
};
