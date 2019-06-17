import React from 'react';
import logo from './logo.svg';
import './App.css';
import {generate,sendEth,ethGas,getEthBalance, getBtcBalance} from './wallet/walletfunc';
function App() {
  console.log(getBtcBalance('mwjHY5N9x5GjxfvCLW3bvuvdixfwQ3nmtc'));
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
