import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView} from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('http://django-fyp.herokuapp.com/recsys/id/1')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
          console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
        <Text>Loading...</Text>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        {/* <WebView source={{html: this.state.dataSource._bodyText}} /> */}
        {/* <WebView source={{html:"<html><body>"+this.state.dataSource._bodyText+"</body></html>"}} style={styles.recipes} /> */}
        <Text>{this.state.dataSource[0].recipe_name}</Text>
        {/* <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item}</Text>}
          keyExtractor={({id}, index) => id}
        /> */}
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
  },
  recipes: {
    width:300,height:200,backgroundColor:'blue',marginTop:20
  },
});
