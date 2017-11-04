import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

//Wrap the application in a Provider so all our container components can access the redux store.
//Wrap in connected router so we can dispatch routing events
//Wrap in MuiThemProvider so our view components have MD styling
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
