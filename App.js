// App.js
import * as React from 'react';
import Main from './src/Main';
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default class App extends React.Component {
  render() {
    return <Main />;
  }
}