/**
 * @format
 */

import { AppRegistry } from 'react-native';
// Must load before App so every StyleSheet is created with the compact type scale.
import './src/theme/typographyScale';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
