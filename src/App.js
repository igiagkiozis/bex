import {Alchemy, BigNumber, Network} from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function Block({block}) {
    console.log(JSON.stringify(block, null, 1));
    if(block) {
        let timestamp = new Date(parseInt(block['timestamp']) * 1000);
        let gasUsed = BigNumber.from(block['gasUsed']);
        let gasLimit = BigNumber.from(block['gasLimit']);
        let gasTarget = gasLimit/2;
        let gasRelToTarget = (gasUsed - gasTarget) / gasTarget;
        let baseFee = BigNumber.from(block['baseFeePerGas']) / 10**9;
        return (
            <table>
                <tbody>
                <tr>
                    <td>Block Number</td>
                    <td>{block['number']}</td>
                </tr>
                <tr>
                    <td>Timestamp</td>
                    <td>{timestamp.toUTCString()}</td>
                </tr>
                <tr>
                    <td>Hash</td>
                    <td>{block['hash']}</td>
                </tr>
                <tr>
                    <td>Parent Hash</td>
                    <td>{block['parentHash']}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{block['nonce']}</td>
                </tr>
                <tr>
                    <td>Difficulty</td>
                    <td>{block['difficulty']}</td>
                </tr>
                <tr>
                    <td>Gas Used</td>
                    <td>{`${gasUsed} (${(100.0 * gasRelToTarget).toFixed(2)}%)`}</td>
                </tr>
                <tr>
                    <td>Gas Limit</td>
                    <td>{gasLimit.toString()}</td>
                </tr>
                <tr>
                    <td>Base Fee per Gas</td>
                    <td>{`${baseFee.toFixed(4)} gwei`}</td>
                </tr>
                <tr>
                    <td>Miner</td>
                    <td>{block['miner']}</td>
                </tr>
                <tr>
                    <td>Transaction Count</td>
                    <td>{block['transactions'].length}</td>
                </tr>
                <tr>
                    <td>Extra Data</td>
                    <td>{block['extraData']}</td>
                </tr>
                </tbody>
            </table>
        );
    } else {
        return (<label>No block selected</label>);
    }
}

function Explorer({block}) {
    return (
        <div>
            <Block block={block}/>
        </div>
    )
}

function App() {
  const [block, setBlock] = useState();

  useEffect((blockNumber) => {
    async function getBlock() {
      let block = await alchemy.core.getBlock(blockNumber);
      let data = JSON.stringify(block, null, 1);
      console.log(data);
      setBlock(block);
    }

    getBlock();
  }, []);

  return <Explorer block={block} />;
}

export default App;
