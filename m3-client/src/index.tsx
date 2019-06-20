import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.scss';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { GlobalStateProvider } from './store';
import Router from './router';



Router.init();

const AppContainer = () => {
  return (
    <GlobalStateProvider>
      <App></App>
    </GlobalStateProvider>
  )
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();





