import * as wrapper from 'solc/wrapper';
import {SOURCES} from 'contracts/sources';

const ctx: Worker = self as any; // eslint-disable-line

self.importScripts(
  'https://solc-bin.ethereum.org/bin/soljson-v0.8.7+commit.e28d00a7.js',
);

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  if (event.data.action == 'compile') {
    let solc = wrapper((self as any).Module);

    function findImports(path: string): any {
      return {contents: SOURCES[path]};
    }

    if (event.data.contract == 'erc721') {
      let input = {
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

      var output = JSON.parse(
        solc.compile(JSON.stringify(input), {import: findImports}),
      );

      let contract = output.contracts['ERC721.sol']['ERC721'];

      let bytecode = contract.evm.bytecode.object;
      let abi = contract.abi;

      self.postMessage({cmd: 'compiled', bytecode, abi});
    } else if (event.data.contract == 'erc20') {
      let input = {
        language: 'Solidity',
        sources: {
          'ERC20.sol': {
            content: SOURCES['ERC20.sol'],
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

      var output = JSON.parse(
        solc.compile(JSON.stringify(input), {import: findImports}),
      );

      let contract = output.contracts['ERC20.sol']['ERC20'];

      let bytecode = contract.evm.bytecode.object;
      let abi = contract.abi;

      self.postMessage({cmd: 'compiled', bytecode, abi});
    }
  }
});

export default ctx;
