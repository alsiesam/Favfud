import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Heading,
  Text,
  Button,
  View,
  TextInput,
  Divider,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';
const LOGIN_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/login/';
const REGISTER_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/registration/';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:'',
      token:'',
      // stored_email:''
    };
  }

  componentDidMount() {
    this.getToken();
    this.getEmail();
  }

  redirectToAuth(){
    this.props.navigation.navigate('Auth')
  }

  async logout(){
    try {
      await this.removeEmail();
      await this.removeToken();
      this.showAlert("Successful", "You have successfully logged out.");
      this.redirectToAuth();
    } catch (err) {
      console.log('[logout] Error');
    }
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }

  async getToken() {
    try{
      token = await AsyncStorage.getItem(ACCESS_TOKEN);
      this.setState({token});
    } catch (err) {
      console.log('[updateToken] Error')
    }
  }

  async removeToken() {
    try{
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      this.setState({token: ''});
    } catch (err) {
      console.log('[removeToken] Error')
    }
  }

  async getEmail() {
    try{
      email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      this.setState({email: email});
    } catch (err) {
      console.log('[getEmail] Error')
    }
  }

  async removeEmail() {
    try{
      await AsyncStorage.removeItem(EMAIL_ADDRESS);
      this.setState({email: ''});
    } catch (err) {
      console.log('[removeEmail] Error')
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{flex: 1}} />

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Heading style={styles.welcomeText}>Welcome to Favfud!</Heading>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.generalText}>Welcome back, {"\n"+this.state.email}</Text>
        </View>

        <Divider />

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            onPress= {this._handleLogout}
            styleName="secondary full-width">
            <Text>Logout</Text>
          </Button>
        </View>

        {/* Help */}
        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
            <Text style={styles.helpLinkText}>Help!</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 2}} />

      </View>
    );
  }

  _handleHelpPress = () => {
    this.showAlert('No help is available yet', 'Please try again later.');
  };

  _handleLogout = () => {
    this.logout();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    // backgroundColor: 'powderblue'
  },
  helpContainer: {
    flex: 2,
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 50,
    // backgroundColor: 'powderblue'
  },
  logoutContainer: {
    height: 50,
    width: 200
  },
  generalText: {
    paddingVertical: 5,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 30,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 37,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  helpLink: {
    paddingVertical: 5,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
