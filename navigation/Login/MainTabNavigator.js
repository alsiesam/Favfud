import React from 'react';
import { Platform, Button } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeScreen from '../../screens/Login/HomeScreen';
import DiaryScreen from '../../screens/Diary/DiaryScreen';
import AddMealFormScreen from '../../screens/Diary/AddMealFormScreen';
import DiaryReportScreen from '../../screens/Diary/DiaryReportScreen';
import ProfileScreen from '../../screens/Login/ProfileScreen';

import RecSys from '../../screens/RecSys/RecSys';
import Recipe_Information from '../../screens/RecSys/Recipe_Information';
import Recipe_Nutrition from '../../screens/RecSys/Recipe_Nutrition';
import Recipe_Rated from '../../screens/RecSys/Recipe_Rated';
import Recipe_Bookmarked from '../../screens/RecSys/Recipe_Bookmarked';
import Recipe_Search from '../../screens/RecSys/Recipe_Search';
import Recipe_Healthy_Body_Selections from '../../screens/RecSys/Recipe_Healthy_Body_Selections';
import Recipe_Diary_Selections from '../../screens/RecSys/Recipe_Diary_Selections';

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
  Diary: {screen: DiaryScreen},
  AddMealForm: {screen: AddMealFormScreen},
  DiaryReport: {screen: DiaryReportScreen},
},{
  initialRouteName: 'Diary',
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
  Profile: {screen: ProfileScreen},
  Recipe_Healthy_Body_Selections: {screen: Recipe_Healthy_Body_Selections},
  Recipe_Diary_Selections: {screen: Recipe_Diary_Selections},
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

const SearchStack = createStackNavigator({
  Recipe_Search: Recipe_Search,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

export default createBottomTabNavigator({
  //HomeStack,
  //ProfileStack,
  RecSysStack,
  RatedStack,
  BookmarkStack,
  DiaryStack,
  SearchStack,
});
