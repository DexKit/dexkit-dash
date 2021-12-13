import {Widget} from '@maticnetwork/wallet-widget';
import {useCallback} from 'react';

const widget = new Widget({
  // target: '',
  appName: 'dexkit-dash',
  autoShowTime: 0,
  position: 'center',
  height: 630,
  width: 540,
  overlay: true,
  network: 'mainnet',
  closable: true,
  style: {
    color: 'black',
  },
});
// useState was not working due to how plugin works, widget.destroy() was not working, needed to create this additional variable
let wasCreated = false;
export function useMaticBridge() {
  const initBridge = useCallback(async () => {
    if (!wasCreated) {
      await widget.create();
    }
    wasCreated = true;
    widget.show();
  }, []);

  return {
    initBridge,
  };
}
