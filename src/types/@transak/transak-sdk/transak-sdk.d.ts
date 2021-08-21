declare module '@transak/transak-sdk' {
  interface ENVIRONMENT_TYPE {
    FRONTEND: string;
    BACKEND: string;
    NAME: string;
  }

  export interface ENVIRONMENT {
    STAGING: ENVIRONMENT_TYPE;
    LOCAL_DEVELOPMENT: ENVIRONMENT_TYPE;
    DEVELOPMENT: ENVIRONMENT_TYPE;
    PRODUCTION: ENVIRONMENT_TYPE;
  }

  export interface STATUS {
    INIT: string;
    TRANSAK_INITIALISED: string;
  }

  export type configData = {
    apiKey: string;
    environment: keyof ENVIRONMENT;
    cryptoCurrencyCode?: string;
    defaultCryptoCurrency: string;
    walletAddress: string;
    themeColor: string;
    fiatCurrency: any; //'INR' | 'GBP'
    email?: string;
    redirectURL: string | URL;
    hostURL: string | URL;
    widgetHeight: string;
    widgetWidth: string;
    fiatAmount?: string;
    defaultFiatAmount?: string;
    countryCode?: string;
    paymentMethod?: string;
    defaultPaymentMethod?: string;
    isAutoFillUserData?: boolean;
    isFeeCalculationHidden?: boolean;
    disablePaymentMethods?: boolean;
  };
  declare class transakSDK {
    constructor(partnerData: configData);
    init(): void;
    close(): Promise<void>;
    closeRequest(): void;
    modal(): Promise<void>;
  }
  export declare function generateURL(configData: type);
  export declare function setStyle();

  export default transakSDK;
}
