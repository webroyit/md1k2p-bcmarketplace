import React, { Component } from 'react';
import './App.css';

import Navbar from './component/Navbar';

class App extends Component {
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
