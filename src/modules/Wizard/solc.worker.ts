import * as wrapper from 'solc/wrapper';
import {SOURCES} from 'contracts/sources';

const ctx: Worker = self as any; // eslint-disable-line

self.importScripts('https://solc-bin.ethereum.org/bin/soljson-latest.js');

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  if (event.data.action == 'compile') {
    if (event.data.contract == 'erc721') {
      let solc = wrapper((self as any).Module);

      var input = {
        language: 'Solidity',
        sources: {
          'ERC721.sol': {
            content: SOURCES['ERC721.sol'],
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };

      function findImports(path: string): any {
        return {contents: SOURCES[path]};
      }

      var output = JSON.parse(
        solc.compile(JSON.stringify(input), {import: findImports}),
      );

      let contract = output.contracts['ERC721.sol']['ERC721'];

      let bytecode = contract.evm.bytecode.object;
      let abi = contract.abi;

      self.postMessage({cmd: 'compiled', bytecode, abi});
    }
  }
});

export default ctx;
