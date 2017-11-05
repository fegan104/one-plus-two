import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import FirebaseServer from 'firebase-server';
import detect from 'detect-port';

let mockDb = {};
let server;

export async function startFirebaseTestServer() {
  const port = await detect(5000);
  if (port === 5000) {
    server = new FirebaseServer(5000, '127.0.0.1', mockDb);
  }

  return server;
}

beforeAll(async () => {
  server = await startFirebaseTestServer();
});

afterAll(() => {
  if (server) {
    server.close();
    server = null;
  }
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
