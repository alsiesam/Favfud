import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Heading,
  Text,
  Button,
  View,
  TextInput,
  Divider,
} from '@shoutem/ui';
import Container from 'native-base';

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';
const LOGIN_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/login/';
const REGISTER_VERIFY_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/registration-verify/';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

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
      isLoginMode: true,
      isLoading: false,
    };
  }

  componentDidMount(){
    this.getToken();
    this.getEmail();
  }

  submitCredentialsRegister() {
    if (this.state.email !== undefined && this.state.password !== undefined) {
      this.register({
        email: this.state.email,
        password1: this.state.password,
        password2: this.state.password2
      }, (response) => {
        console.log("Unsuccesful registration");
        this.showErrorMsg(response);
      });
      /*
      this.props.navigation.navigate(
        {
          routeName: 'HealthForm',
          params: {register_email: this.state.email, register_password: this.state.password},
        }
      );
      */
    }
  }

  async sendRegisterVerifyRequest(credentials) {
    try {
      let response = await fetch(REGISTER_VERIFY_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      return response;
    } catch (err) {
      console.log("sendRegisterRequest error");
      return false;
    }
  }

  async register(credentials, callback) {
      this.setState({isLoading: true});

      let response = await this.sendRegisterVerifyRequest(credentials);
      if (response.ok) {
        this.props.navigation.navigate('HealthForm', {
          register_email: credentials.email,
          credentials: credentials,
        });
      } else {
        let responseJson = await response.json();
        if (callback) { callback(responseJson); }
      }

      this.setState({isLoading: false});
    }

  submitCredentialsLogin() {
    if (this.state.email !== undefined && this.state.password !== undefined) {
      this.login({
        email: this.state.email,
        password: this.state.password
      }, (response) => {
        console.log("Unsuccesful login");
        this.showErrorMsg(response);
        this.setState({isLoading: false});
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
        //console.log(response);
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
        this.setState({isLoading: false});
      }
      this.props.navigation.navigate('App')
      this.setState({isLoading: false});
    } catch (err) {
      console.log("[switchToApp] Error");
      console.log(err);
      this.setState({isLoading: false});
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
    } catch (err) {
      console.log('[getToken] Error')
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
    if (this.state.isLoading) {
      return(
        <View style={styles.loading_container}>
          <Text>Loading...</Text>
          <ActivityIndicator/>
        </View>
      );
    } else {
      return (
        <DismissKeyboard>
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
        </DismissKeyboard>
      );
    }
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
    this.setState({isLoading: true});
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
    paddingTop: 5,
    paddingBottom: 5,
    height: 40,
    marginTop:10,
    marginBottom:5,
  },
  buttonContainer: {
    // flex:1,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
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
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
