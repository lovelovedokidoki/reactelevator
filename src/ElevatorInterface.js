import React, { Component } from 'react';
import Elevator from './Elevator';
import './Elevator.css';

export default class ElevatorInterface extends Component {
  constructor(props) {
    super(props);

    /// We want the state to monitor the names of the floors and whether they're enqueued. That way, 
    /// buttons know when to light up and not as the elevator iterates through the "queue".
    this.state = { 
      floors: props.floors.map(
        x => {
          return { name: x, enqueued: false}
        }
      )
    };

    // Set default speed of the elevator to 1
    // This means doors take 1 second to close and elevator moves 1 floor per 2 seconds.
    this.Elevator = new Elevator(this.state.floors.length, props.speed || 1);
    // ElevatorInterface object has to maintain current direction to ensure correct elevator behaviour.
    this.direction = 'none';
  }

  /// Responsible for iterating through the floors until no more floors are enqueued
  _iterate() {
    if (this.direction != 'none' && this.Elevator.doorsopen) {
      this.Elevator.closedoors().then(_floornumber => {
        console.log("doors closed");
        this._iterate();
      });
    }
    else if (this.direction == 'up') {
      this.Elevator.moveup()
      .then(currentfloor => {
        if (this.state.floors[currentfloor - 1].enqueued) {
          this._arrived(currentfloor);
        }
        else {
          this._iterate();
        }
      });
    }
    else if (this.direction == 'down') {
      this.Elevator.movedown()
      .then(currentfloor => {
        if (this.state.floors[currentfloor - 1].enqueued) {
          this._arrived(currentfloor);
        }
        else {
          this._iterate();
        }
      });
    }
  }

  /// Calls handlers and dequeues the floor passed and checks if elevator should continue or idle
  _arrived(floornumber) {
    this.Elevator.opendoors().then(_x => {
      console.log("doors opened");
      this.props.arrivedAtFloorEventHandler(floornumber);
      this.setState(state => {
        state.floors[floornumber - 1].enqueued = false;
        return state;
      });
      
      if (this.direction == 'up') {
        if (this.state.floors.some((f, i) => f.enqueued && i > floornumber - 1)) {
          // There are still enqueued destinations above current position. Continue.
          this._iterate();
        } 
        else if (this.state.floors.some((f, i) => f.enqueued && i < floornumber - 1)) {
          // There are still enqueued destinations below current position. Change direction.
          this.direction = 'down';
          this._iterate();
        }
        else {
          // There are no enqueued destinations. Idle.
          this.direction = 'none';
        }
      }
      else if (this.direction == 'down') {
        if (this.state.floors.some((f, i) => f.enqueued && i < floornumber - 1)) {
          // There are still enqueued destinations below current position. Continue.
          this._iterate();
        } 
        else if (this.state.floors.some((f, i) => f.enqueued && i > floornumber - 1)) {
          // There are still enqueued destinations above current position. Change direction.
          this.direction = 'up';
          this._iterate();
        }
        else {
          // There are no enqueued destinations. Idle.
          this.direction = 'none';
        }
      }
    });
  }

  /// If elevator is currently idle, sets it in motion towards passed floornumber
  _startmovingtowards(floornumber) {
    if (this.direction == 'none') {
      if (this.Elevator.position < floornumber) {
        this.direction = 'up';
        this._iterate();
      }
      else if (this.Elevator.position > floornumber) {
        this.direction = 'down';
        this._iterate();
      }
    }
  }
 
  /// Takes (one-based) index of a floor and sets elevator in motion towards that floor
  enqueuefloor(index) {
    if (index >= 1 && index <= this.state.floors.length) {
      // Set (zero-indexed) floor to be enqueued.
      this.setState(state => {
        state.floors[index - 1].enqueued = true;
        return state;
      });
      // Set direction of elevator to move towards newly enqueue floor
      this._startmovingtowards(index);
      console.log("enqueued floor " + index)
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className="Elevator">
        {this.state.floors.map((floor, i) => 
          <button onClick={() => {this.enqueuefloor(i + 1)}} key={i} className={this.state.floors[i].enqueued ? "enqueued" : ""}>
            {floor.name}
          </button>
        )}
      </div>
    );
  }
}
