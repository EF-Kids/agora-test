import React from 'react';
import { render } from 'react-dom';
import 'webrtc-adapter';
import App from './App';
import 'normalize.css/normalize.css';
import './index.css';

(async () => {
  render(<App />, document.getElementById('root'));
})();
