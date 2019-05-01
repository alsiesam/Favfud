import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, Alert, ActivityIndicator, StatusBar  } from 'react-native';
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
const UPDATE_RECOMMENDATION_DEMO_URL = 'http://django-fyp.herokuapp.com/recsys/recommendation/update/recommendation/demo/';
const RETRIEVE_HEALTHFORM_URL = 'http://django-fyp.herokuapp.com/healthform/retrieve/';

const TEXT_COLOR = 'rgba(0,0,0,1)';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'My Profile',
  };

  constructor(props) {
    super(props);
    this.state = {
      email:'',
      token:'',
      sex: '',
      age: '',
      weight: '',
      height: '',
      consume_level: '',
      illness: [],
      taboos: [],
      isLoadingScreen: true,
      isLoadingRecommendation: false,
    };
  }

  async componentWillMount(){
    let token = await this.getTokenAndEmail()
    if (token){
        this.getHealthform(token)
    }
    this.setState({isLoadingScreen: false})
  }

  componentDidMount() {
    this.props.navigation.addListener(
        'willFocus',
        () => {
            {
                TEXT_COLOR != undefined && TEXT_COLOR.match(/(255\s*,?\s*){2}255/) != null
                ?
                StatusBar.setBarStyle("light-content")
                :
                StatusBar.setBarStyle("dark-content")
            }
        }
    );
}

  async getTokenAndEmail() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      this.setState({token});
      this.setState({email});
      return token
    } catch (err) {
      console.log('[getToken] Error')
    }
  }

  async getHealthform(token=this.state.token) {
    try{
      let response = await fetch(RETRIEVE_HEALTHFORM_URL, {
        method: 'GET',
        headers: {
          'usertoken': token
        }
      });
      let responseJson = await response.json();
      if (response.ok && Object.keys(responseJson).length>0) {
        this.setState({
          sex: responseJson.sex,
          age: responseJson.age,
          weight: responseJson.weight+" kg",
          height: responseJson.height+" cm",
          consume_level: responseJson.consume_level,
          illness: responseJson.illness.toString(),
          taboos: responseJson.taboos.toString()
        });
      } else {
        console.log('[getHealthform] Error')
        return false;
      }
    } catch (err) {
      console.log('[getHealthform] Error')
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
        data: [{value:this.state.sex,},],
        title: 'Sex',
      },
      {
        data: [{value:this.state.age,},],
        title: 'Age',
      },
      {
        data: [{value:this.state.height,},],
        title: 'Height',
      },
      {
        data: [{value:this.state.weight,},],
        title: 'Weight',
      },
      {
        data: [{value:this.state.consume_level,},],
        title: 'Energy Consumption',
      },
      {
        data: [{value:this.state.illness,},],
        title: 'Illness',
      },
      {
        data: [{value:this.state.taboos,},],
        title: 'Taboos',
      },
    ];
    if(this.state.isLoading){
      return(
        <View style={styles.loading_container}>
          <Text>Loading...</Text>
          <ActivityIndicator/>
        </View>
      )
    }
    if(this.state.isLoadingRecommendation){
      return(
        <View style={styles.loading_container}>
          <Text>Updating Your Recommendation...</Text>
          <ActivityIndicator/>
        </View>
      )
    }
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

          <View style={styles.refreshContainer}>
            <View style={styles.buttonContainer}>
              <Button
                styleName="secondary full-width"
                onPress={this._handleRefresh}
                style={{marginBottom:10}}>
                  <Text>Update Recommendation</Text>
              </Button>
              <Button
              onPress= {this._handleLogout}
              styleName="secondary full-width">
                <Text>Logout</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
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
    this.setState({isLoadingRecommendation: true})
    fetch(UPDATE_RECOMMENDATION_DEMO_URL, {
      method: 'POST',
      headers: new Headers ({
        usertoken: this.state.token,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({isLoadingRecommendation: false})
    })
    .catch((error) =>{
      console.error(error);
    });
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
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingBottom: 20,
  },
  refreshContainer: {
    flex: 1,
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
