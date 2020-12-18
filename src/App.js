import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

import Navbar from './component/Navbar';

class App extends Component {
  async componentWillMount(){
    await this.loadWeb3();
  }

  async loadWeb3(){
    // Modern dapp browsers...
    if (window.ethereum) {
      // Creates a connection to the blockchain
      window.web3 = new Web3(window.ethereum);

      // Request account access if needed
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <h1 className="text-center mt-5">Marketplace</h1>
      </div>
    );
  }
}

export default App;
