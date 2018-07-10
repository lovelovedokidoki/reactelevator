import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ElevatorInterface from './ElevatorInterface';
import ElevatorFloorCounter from './ElevatorFloorCounter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { currentfloor: 1 };
  }

  onArrivedAtFloor(floornumber) {
    this.setState({ currentfloor: floornumber });
    console.log("onArrivedAtFloor-" + floornumber);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Elevator Simulation</h1>
        </header>
        <ElevatorFloorCounter floor={this.state.currentfloor} />
        <ElevatorInterface floors={[1, 2, 3, 4, 5, 6]} 
          arrivedAtFloorEventHandler={this.onArrivedAtFloor.bind(this)} />
      </div>
    );
  }
}

export default App;
