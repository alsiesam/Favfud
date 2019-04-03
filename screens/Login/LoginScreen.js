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
      password2:'',
      token:'',
      stored_email:'',
      error:'',
      isLoginMode: true
    };
    this.getToken();
    this.getEmail();
  }

  promptError(message) {
    Alert.alert(
      `Error`,
      `${message}`,
      [{text: 'OK'},],
    );
  }

  // Stop sending POST request first,
  // it should be sent after Health Form is completed
  submitCredentialsRegister() {
    if (this.state.email !== undefined && this.state.password !== undefined) {
      // this.register({
      //   email: this.state.email,
      //   password1: this.state.password,
      //   password2: this.state.password2
      // }, (response) => {
      //   console.log("Unsuccesful registration");
      //   console.log(response);
      //   this.showErrorMsg(response);
      // });
      case1 = !this.state.email;
      case2 = !this.state.password;
      case3 = !this.state.password2;
      case4 = this.state.password != this.state.password2;
      if(case1) {
        this.promptError('You have not filled in email');
      } else if(case2) {
        this.promptError('You have not filled in password');
      } else if(case3) {
        this.promptError('Please re-enter the password');
      } else if(case4) {
        this.promptError('Password does not match when you re-enter');
      } else {
        Alert.alert(
          `Confirm your registration with this email?`,
          `${this.state.email}`,
          [
            {
              text: 'Yes', 
              onPress: () => this.props.navigation.navigate({routeName: 'HealthForm', params: {email: this.state.email, password: this.state.password}})
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
    }
  }

  register(credentials, callback) {
      fetch(REGISTER_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then((response) => {
        return response.json();
      }).then((response) => {
        console.log(response);
        if (response.key) {
          this.switchToApp(response.key, credentials.email, 'Register');
        } else {
          if (callback) { callback(response); }
        }
      }).done();
  }

  submitCredentialsLogin() {
    if (this.state.email !== undefined && this.state.password !== undefined) {
      this.login({
        email: this.state.email,
        password: this.state.password
      }, (response) => {
        console.log("Unsuccesful login");
        console.log(response);
        this.showErrorMsg(response);
      });
    }
  }

  login(credentials, callback) {
      fetch(LOGIN_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then((response) => {
        return response.json();
      }).then((response) => {
        console.log(response);
        if (response.key) {
          this.switchToApp(response.key, credentials.email, 'Login');
        } else {
          if (callback) { callback(response); }
        }
      }).done();
    }

  async switchToApp(key, email, actionType) {
    try {
      await this.storeToken(key);
      await this.storeEmail(email);
      if (actionType == "Login") {
        this.showAlert("Successful", "Login is successful.");
      } else if (actionType == "Register") {
        this.showAlert("Successful", "Account is registered.");
      } else {
        console.log("[switchToApp] Error");
      }
      this.props.navigation.navigate('App')
    } catch (err) {
      console.log("[switchToApp] Error");
      console.log(err);
    }
  }

  showErrorMsg(response) {
    if (response.non_field_errors) {
      this.showAlert('Error', response.non_field_errors.toString());
    }
    if (response.password1) {
      this.showAlert('Error: Password', response.password1.toString());
    }
    if (response.password) {
      this.showAlert('Error: Password', response.password.toString());
    }
    if (response.email) {
      this.showAlert('Error: Email', response.email.toString());
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

  async storeToken(accessToken) {
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (err) {
      console.log('[storeToken] Error')
    }
  }

  async getToken() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      this.setState({token});
      console.log('Token is:' + token);
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

  async storeEmail(email) {
    try{
      await AsyncStorage.setItem(EMAIL_ADDRESS, email);
      this.getEmail();
    } catch (err) {
      console.log('[storeEmail] Error')
    }
  }

  async getEmail() {
    try{
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      console.log('[getEmail] Email is:' + email);
      this.setState({stored_email: email});
    } catch (err) {
      console.log('[getEmail] Error')
    }
  }

  async removeEmail() {
    try{
      await AsyncStorage.removeItem(EMAIL_ADDRESS);
      this.setState({stored_email: ''});
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

        <View style={{flex: 1}} />

        {/* Login*/}
        <View style={styles.loginContainer} >


            <TextInput
              style={styles.textInput}
              placeholder={'Enter your email address'}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />

            <TextInput
              style={styles.textInput}
              placeholder={'Enter your password'}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />

          {
            !this.state.isLoginMode
            ? (
              <TextInput
                style={styles.textInput}
                placeholder={'Re-enter your password'}
                secureTextEntry={true}
                onChangeText={(password2) => this.setState({password2})}
                value={this.state.password2}
              />
            )
            : (
              <View />
            )
          }

          <View style={styles.buttonContainer}>
            {
              this.state.isLoginMode
              ? (
                <Button
                  onPress= {this._handleLogin}
                  styleName="secondary full-width">
                  <Text>Login</Text>
                </Button>
              )
              : (
                <Button
                  onPress= {this._handleRegister}
                  styleName="secondary full-width">
                  <Text>Register</Text>
                </Button>
              )
            }
          </View>

        </View>

        {/* Help */}

        <View style={styles.helpContainer}>
          {
            this.state.isLoginMode
            ? (
              <TouchableOpacity onPress={this._handleSwitchToRegister} style={styles.helpLink}>
                <Text style={styles.helpLinkText}>Don't have an account yet?{"\n"}Click here to register!</Text>
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity onPress={this._handleSwitchToLogin} style={styles.helpLink}>
                <Text style={styles.helpLinkText}>Have an account already?{"\n"}Click here to login!</Text>
              </TouchableOpacity>
            )
          }
        </View>

        <View style={{flex: 4}} />
      </View>
    );
  }

  _handleHelpPress = () => {
    this.showAlert('No help is available yet', 'Please try again later.');
  };

  _handleSwitchToRegister = () => {
    this.setState({isLoginMode: false});
    this.setState({password: ''});
  };

  _handleSwitchToLogin = () => {
    this.setState({isLoginMode: true});
    this.setState({password: ''});
    this.setState({password2: ''});
  };

  _handleRegister = () => {
    this.submitCredentialsRegister();
  };

  _handleLogin = () => {
    this.submitCredentialsLogin();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    // backgroundColor: 'powderblue'
  },
  loginContainer: {
    flex: 6,
    marginHorizontal: 50,
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  textInput:{
    borderColor: 'gray',
    borderWidth: 1,
    height: 55,
    marginTop:5,
    marginBottom:5,
  },
  buttonContainer: {
    // flex:1,
    height:40,
    marginTop:10,
    marginBottom:10,
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  helpContainer: {
    flex: 2,
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 50,
    // backgroundColor: 'powderblue'
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
    textAlign: 'center',
  },
});
