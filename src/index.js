import React from 'react';
import { render } from 'react-dom';
import App from './App';
import 'normalize.css/normalize.css';
import './index.css';

console.error(process.env.AGORA_APP_ID);
console.error(process.env.AGORA_APP_CERTIFICATE);

(async () => {
  render(<App />, document.getElementById('root'));
})();
