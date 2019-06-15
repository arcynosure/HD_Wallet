import React from 'react';
import logo from './logo.svg';
import './App.css';
import {generate,sendEth,ethGas,getEthBalance} from './wallet/walletfunc';
function App() {
  sendEth('0.0016','0x7b1d821e3838D3128c0b06D0Ed54b1908Af7CC21');
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
