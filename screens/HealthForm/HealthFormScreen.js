import React from 'react';
import { Platform, StyleSheet, View, AsyncStorage, } from 'react-native';
import {
    Text,
    Button,
} from '@shoutem/ui';
import StatusBarBackground from '../../components/StatusBarBackground';


const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';

export default class HealthFormScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: props.navigation.state.params.email,
            password: props.navigation.state.params.password,
            user_token: 'abc1234',
        };
    }

    async store(accessToken, emailAddress) {
        try{
          await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
          await AsyncStorage.setItem(EMAIL_ADDRESS, emailAddress);
          this.getToken();
        } catch (err) {
          console.log('[storeToken] Error')
        }
    }

    async getToken() {
        try{
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            console.log('Token is:' + token);
        } catch (err) {
            console.log('[updateToken] Error')
        }
    }

    async validateForm() {
        try {
            await this.store(this.state.user_token, this.state.email);
            this.props.navigation.navigate({routeName: 'RecSys', params: {}})
        } catch (err) {
            console.log("[switchToAppInHealthForm] Error");
            console.log(err);
        }
    }

    render() {
        return(
            <View style={{flex:2}}>
                <StatusBarBackground />
                <View style={{flex:1}}>
                    <Text>
                        Email name: {this.state.email}
                    </Text>
                    <Text>
                        Password: {this.state.password}
                    </Text>
                </View>
                <View style={{flex:1, flexDirection:'column', justifyContent:'flex-end',}}>
                    <Button onPress= {this.validateForm.bind(this)} styleName="secondary">
                    <Text>Confirm</Text>
                </Button>
                </View>
            </View>
        );
    }
}