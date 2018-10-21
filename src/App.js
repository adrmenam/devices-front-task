import React, { Component } from 'react';
import Devices from './components/Devices'
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="App">
            <header className="App-header">
                <div id="title">
                    <span>Devices Task</span>
                </div>

            </header>
            <main className="App-main">
                <Devices/>
            </main>
        </div>
    );
  }
}

export default App;
