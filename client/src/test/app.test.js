import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ReactDOM from 'react-dom';
import App from '../stateful/App';

Enzyme.configure({ adapter: new EnzymeAdapter() })


it('renders without crashing', () => {
  const wrapper = shallow(<App />);
  console.log(wrapper.debug());
});