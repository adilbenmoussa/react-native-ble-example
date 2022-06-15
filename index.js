/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './src/screens/MicroINRScreen';
import {name as appName} from './app.json';
import MicroINRScreen from "./src/screens/MicroINRScreen";

AppRegistry.registerComponent(appName, () => MicroINRScreen);
