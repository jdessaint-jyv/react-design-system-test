
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';
 import { http, HttpResponse } from 'msw';
 import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';
import { fireEvent, waitFor, waitForElementToBeRemoved, within } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
 Default.parameters = {
   msw: {
     handlers: [
        http.get(
         'https://jsonplaceholder.typicode.com/todos?userId=1',
         () => {
            return HttpResponse.json(MockedState.tasks);
         }
       ),
     ],
   },
 };

Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Waits for the component to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
    // Waits for the component to be updated based on the store
    await waitFor(async () => {
      // Simulates pinning the first task
      await fireEvent.click(canvas.getByLabelText('pinTask-1'));
      // Simulates pinning the third task
      await fireEvent.click(canvas.getByLabelText('pinTask-3'));
    });
};

export const Error = Template.bind({});
 Error.parameters = {
   msw: {
     handlers: [
       http.get(
         'https://jsonplaceholder.typicode.com/todos?userId=1',
         () => {
            return new HttpResponse(null, { status: 403 });
         }
       ),
     ],
   },
 };