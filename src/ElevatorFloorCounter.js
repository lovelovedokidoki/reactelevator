import React, { Component } from 'react';

export default class ElevatorFloorCounter extends Component {
    render() {
        return (
            <p>Elevator is currently on floor: {this.props.floor}</p>
        )
    }
}