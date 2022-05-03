/// <reference types="react-scripts" />
declare module 'solc';
declare module 'solc/wrapper';

declare module 'react-swipeable-views';
declare module 'react-swipeable-views-utils';
declare module 'merge-images';
declare module 'humanize-duration';
declare module 'worker-loader!*' {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
