import transakSDK from '@transak/transak-sdk';

export function getTransak(
  walletAddress: string,
  themeColor = '000000',
  redirectURL: string = '',
  fiatCurrency: 'INR' | 'GBP',
  email?: string,
  widgetHeight?: string,
  widgetWidth?: string
): transakSDK {
  const environment = process.env.NODE_ENV === 'development' ? 'STAGING' : 'PRODUCTION';
  
  const transak = new transakSDK({
    apiKey: process.env.REACT_APP_TRANSAK_API_KEY as string,  // Your API Key (Required)
    environment, // STAGING/PRODUCTION (Required)
    defaultCryptoCurrency: 'ETH',
    walletAddress, // Your customer wallet address
    themeColor, // App theme color in hex
    fiatCurrency,
    email, // Your customer email address (Optional)
    redirectURL,
    hostURL: window.location.origin, // Required field
    widgetHeight: widgetHeight ?? '550px',
    widgetWidth: widgetWidth ?? '450px'
  });
  
  return transak;
}
