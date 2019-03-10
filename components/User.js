import React from 'react';
import {
  AsyncStorage,
} from 'react-native';


const ACCESS_TOKEN = 'access_token';
const EMAIL_ADDRESS = 'email_address';
const LOGIN_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/login/';
const REGISTER_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/registration/';

export default class User extends React.Component {
  constructor(props) {
    super(props);
  }

  async asyncGetEmail() {
    try{
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      console.log('[getEmail] Email is:' + email);
      this.setState({stored_email: email});
    } catch (err) {
      console.log('[getEmail] Error')
    }
  }

  async asyncStoreEmail(email) {
    try{
      await AsyncStorage.setItem(EMAIL_ADDRESS, email);
      this.getEmail();
    } catch (err) {
      console.log('[storeEmail] Error')
    }
  }

  async asyncRemoveEmail() {
    try{
      await AsyncStorage.removeItem(EMAIL_ADDRESS);
      this.setState({stored_email: ''});
    } catch (err) {
      console.log('[removeEmail] Error')
    }
  }

}
