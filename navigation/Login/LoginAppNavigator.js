import React from 'react';
import { Button, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AppLoadingScreen from '../../screens/Login/AppLoadingScreen';
import LoginScreen from '../../screens/Login/LoginScreen';
import HealthFormScreen from '../../screens/HealthForm/HealthFormScreen';

// const MainAppStack = createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );

const InitialAppStack = createAppContainer(createSwitchNavigator(
  {
    AppLoading: AppLoadingScreen,
    App: MainTabNavigator,
    Auth: LoginScreen,
		HealthForm: HealthFormScreen,
  },
  {
    initialRouteName: 'AppLoading',
  }
));

export default InitialAppStack;
