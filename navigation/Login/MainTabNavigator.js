import React from 'react';
import { Platform, Button } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeScreen from '../../screens/Login/HomeScreen';
import DiaryScreen from '../../screens/Diary/DiaryScreen';
import ProfileScreen from '../../screens/Login/ProfileScreen';

import RecSys from '../../screens/RecSys/RecSys';
import Recipe_Information from '../../screens/RecSys/Recipe_Information';
import Recipe_Nutrition from '../../screens/RecSys/Recipe_Nutrition';
import Recipe_Rated from '../../screens/RecSys/Recipe_Rated';
import Recipe_Bookmarked from '../../screens/RecSys/Recipe_Bookmarked';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

const DiaryStack = createStackNavigator({
  Diary: DiaryScreen,
});

DiaryStack.navigationOptions = {
  tabBarLabel: 'Diary',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-journal' : 'md-journal'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'My Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

const RecSysStack = createStackNavigator({
  RecSys: {screen: RecSys},
  Recipe_Information: {screen: Recipe_Information},
  Recipe_Nutrition: {screen: Recipe_Nutrition},
},{
  initialRouteName: 'RecSys',
});

RecSysStack.navigationOptions = {
  tabBarLabel: 'RecSys',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-wine' : 'md-wine'}
    />
  ),
};

const RatedStack = createStackNavigator({
  Recipe_Rated: Recipe_Rated,
});

RatedStack.navigationOptions = {
  tabBarLabel: 'Rated',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
    />
  ),
};

const BookmarkStack = createStackNavigator({
  Recipe_Bookmarked: Recipe_Bookmarked,
});

BookmarkStack.navigationOptions = {
  tabBarLabel: 'Bookmarked',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
    />
  ),
};

export default createBottomTabNavigator({
  //HomeStack,
  ProfileStack,
  RecSysStack,
  RatedStack,
  BookmarkStack,
  DiaryStack,
});

