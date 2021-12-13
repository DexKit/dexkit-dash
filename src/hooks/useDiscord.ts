import {useEffect} from 'react';

let called = false;

const useDiscord = () => {
  useEffect(() => {
    let script: any;
    if (!called) {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
      script.async = true;
      const scriptText = document.createTextNode(`
        new Crate({
            server: '883248754281574431',
            channel: '894833805372825620',
                shard: 'https://emerald.widgetbot.io'
          });`);
      script.appendChild(scriptText);

      document.body.appendChild(script);
      called = true;
    }

    return () => {};
  }, []);
};

export default useDiscord;
