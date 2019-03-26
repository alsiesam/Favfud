import React from 'react';
import {
  AsyncStorage,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
const ACCESS_TOKEN = 'access_token';

export default class AppLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._bootstrapAsync();
    // userToken = this._bootstrapAsync();
    //console.log(userToken);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try {
      let userToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log(userToken);
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      console.log("Navigating to "+(userToken ? 'App' : 'Auth'));
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    } catch (err) {
      console.log(err);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
