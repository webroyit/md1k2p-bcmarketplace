import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

import Marketplace from './abis/Marketplace.json';
import Navbar from './component/Navbar';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: ''
    }
  }
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
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

  async loadBlockchainData(){
    const web3 = window.web3;
    
    // Return all the wallet addresses from metamask
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });    // Store the first account

    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if(networkData){
      const abi = Marketplace.abi;
      const address = Marketplace.networks[networkId].address;

      // Load the contract from blockchain
      const marketplace = new web3.eth.Contract(abi, address);

      this.setState({ marketplace });
    }else{
      window.alert('Contract is not deployed to detected network');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar account={this.state.account} />
        <h1 className="text-center mt-5">Marketplace</h1>
      </div>
    );
  }
}

export default App;
