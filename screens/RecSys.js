import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Card } from "react-native-elements";
import { Container, Header, Content, CardItem, Body, Title, Left, Right, Subtitle, Button, Icon } from "native-base";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export default class RecSys extends Component {
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        hasScrolled: false,
      }
    }
  
    _onEndReached = () => {
      console.log("end");
    }

    componentDidMount(){
      this.fetchData();
    }

    fetchData() {
      return fetch('http://django-fyp.herokuapp.com/recsys/id/1-10')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchMore = () => {
      return fetch('http://django-fyp.herokuapp.com/recsys/id/1-10')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }
  
    render() {
        const {navigate} = this.props.navigation;
        if(this.state.isLoading){
            return(
            <Container style={styles.screen_container}>
            <StatusBar
                barStyle="light-content"
            />
            <Text>Loading...</Text>
                <ActivityIndicator/>
            </Container>
            )
        }

        return(
          <Container>
            <Header>
            <Left />
              <Body>
                <Title>RecSys</Title>
              </Body>
            <Right />
            </Header>
            <Container style={styles.screen_container}>
              <Content style={[styles.content, ]}>
                <FlatList
                    //horizontal
                    data={this.state.dataSource}
                    numColumns={1}
                    renderItem={({ item: rowData }) => {
                      return(
                          <TouchableOpacity key={rowData.id} onPress={() => navigate('Recipe_Information', {recipe: rowData})}>
                          <Card
                          title={rowData.recipe_name}
                          image={{ 
                          uri: rowData.imageurlsbysize_360 
                          }}
                          imageStyle={styles.recipe_image}
                          containerStyle={[styles.recipe_container]}
                          >
                          </Card>
                          </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={[{width: width, marginBottom: 30,}, styles.center]}
                    // onEndReachedThreshold={20}
                    // onEndReached={this.fetchMore}
                />
                </Content>
              </Container>
            </Container>
        );
    }
  
  }
  
  const styles = StyleSheet.create({
    screen_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'skyblue',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    recipe_container: {
      padding: 0,
      width: 350,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    recipe_image: {
      width: 320,
      height: 320,
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    recipe_text: {
      marginBottom: 10,
      textAlignVertical: "center",
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    content: {
      paddingTop: 0,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  