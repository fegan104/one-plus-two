import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import { mount } from 'enzyme';

xit('goes to View Invite screen', () => {
  const wrapper = mount(<App />);

  const div = document.createElement('div');
  ReactDOM.render(wrapper, div);

  wrapper.find('.jest-link-0').simulate('click');

  expect(wrapper.find('.event-title').text()).to.contain('A mock event');
});
