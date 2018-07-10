import React from 'react';
import ReactDOM from 'react-dom';
import ElevatorInterface from './ElevatorInterface';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ElevatorInterface floors={[0, 1, 2]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('ElevatorInterface.enqueuefloor fails on out of bounds', () => {
  const wrapper = shallow(
    <ElevatorInterface floors={[1, 2, 3]} />
  );
  expect(wrapper.instance().enqueuefloor(-1)).toEqual(false);
  expect(wrapper.instance().enqueuefloor(4)).toEqual(false);
});

it('ElevatorInterface.enqueuefloor succeeds on valid index', () => {
  const wrapper = shallow(
    <ElevatorInterface floors={[1, 2, 3]} />
  );
  expect(wrapper.instance().enqueuefloor(3)).toEqual(true);
});

it('ElevatorInterface calls arrivedAtFloorEventHandler', done => {
  var handler = (_floornumber) => { 
    done(); 
  };
  const wrapper = shallow(
    <ElevatorInterface floors={[1, 2, 3]} 
    arrivedAtFloorEventHandler={handler}
    speed={10} />
  );

  wrapper.instance().enqueuefloor(2);
});

it('arrivedAtFloorEventHandler is called with correct number', done => {
  const expectedfloor = 2;
  const handler = (floornumber) => { 
    expect(floornumber).toEqual(expectedfloor);
    done();
  };
  const wrapper = shallow(
    <ElevatorInterface floors={[1, 2, 3]} 
    arrivedAtFloorEventHandler={handler}
    speed={10} />
  );

  wrapper.instance().enqueuefloor(expectedfloor);
});

it('elevator runs up one floor and back', done => {
  var visitedfirstdestination = false;
  var firstdestination = 2;
  var seconddestination = 1;
  var handler = (floornumber) => { 
    console.log("handler-" + floornumber);
    if (!visitedfirstdestination && floornumber == firstdestination) {
      visitedfirstdestination = true;
    }
    else if (visitedfirstdestination && floornumber == seconddestination) {
      done();
    }
  };
  var wrapper = shallow(
    <ElevatorInterface floors={[1, 2, 3]} 
    arrivedAtFloorEventHandler={handler}
    speed={10} />
  );

  wrapper.instance().enqueuefloor(firstdestination);
  wrapper.instance().enqueuefloor(seconddestination);
});
