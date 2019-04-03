import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, Alert } from 'react-native';
import {
  Text,
  Button,
  View,
  TextInput,
  Divider,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'My Profile',
  };

  constructor(props) {
    super(props);
    this.state = {
      email:'',
      token:'',
    };
  }

  componentDidMount(){
    this.getTokenAndEmail()
  }

  async getTokenAndEmail() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      this.setState({token});
      this.setState({email});
    } catch (err) {
      console.log('[getToken] Error')
    }
  }

  _handleLogout = () => {
    this.logout();
  };

  redirectToAuth(){
    this.props.navigation.navigate('Auth')
  }

  async logout(){
    try {
      // await this.removeEmail();
      // await this.removeToken();
      await this.removeAllRecords();
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

  async removeToken() {
    try{
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      this.setState({token: ''});
    } catch (err) {
      console.log('[removeToken] Error')
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
  async removeAllRecords() {
    try{
      await AsyncStorage.clear();
      this.setState({token: '', email: ''});
    } catch (err) {
      console.log('[removeAllRecords] Error')
    }
  }

  render() {

    const sections = [
      {
        data: [{value:this.state.email,},],
        title: 'Email',
      },
      {
        data: [{value:this.state.token,},],
        title: 'Token',
      },
    ];

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <SectionList
            style={styles.sectionListContainer}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            stickySectionHeadersEnabled={true}
            keyExtractor={(item, index) => index}
            sections={sections}
          />
        </ScrollView>

        <View style={styles.refreshContainer}>
          <View style={styles.buttonContainer}>
            <Button
              styleName="secondary full-width"
              onPress={this._handleRefresh}
              style={{marginBottom:10}}>
                <Text>Refresh</Text>
            </Button>
            <Button
            onPress= {this._handleLogout}
            styleName="secondary full-width">
              <Text>Logout</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };

  _renderItem = ({ item }) => {
      return (
        <SectionContent>
          <Text style={styles.sectionContentText}>
            {item.value}
          </Text>
        </SectionContent>
      );
  };

  _handleRefresh = () => {
    this.getTokenAndEmail();
    console.log(this.state.token);
  };

}

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>
        {title}
      </Text>
    </View>
  );
};

const SectionContent = props => {
  return (
    <View style={styles.sectionContentContainer}>
      {props.children}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent : 'space-around',
  },
  scrollContainer:{
    flex: 7,
  },
  sectionListContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  refreshContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    height: 100,
    width: 300,
    paddingBottom: 10,
  },
  sectionHeaderContainer: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14,
  },
});
