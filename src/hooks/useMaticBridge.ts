import { Widget } from '@maticnetwork/wallet-widget'
import { useCallback} from 'react';



const widget = new Widget({
  target: '',
  appName: 'dexkit-dash',
  autoShowTime: 0,
  position: 'center',
  height: 630,
  width: 540,
  overlay: true,
  network: 'mainnet',
  closable: true,
});

export function useMaticBridge() {

  const initBridge = useCallback(() => {
    widget.create()
  }, []);

  return {
    initBridge,
  };
}
