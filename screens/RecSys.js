import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Card } from "react-native-elements";
import { Container, Header, Content, CardItem, Body, Title, Left, Right, Subtitle, Button, Icon } from "native-base";

export default class RecSys extends Component {
  
    constructor(props){
      super(props);
      this.state ={ isLoading: true }
    }
  
    componentDidMount(){
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
            {/* <StatusBar
                barStyle="default"
            /> */}
          <Header>
          <Left />
            <Body>
              <Title>RecSys</Title>
            </Body>
            <Right />
          </Header>
          <Container style={styles.screen_container}>
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
                    containerStyle={styles.recipe_container}
                    >
                    </Card>
                    </TouchableOpacity>
                );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
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
      width: 320,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    recipe_image: {
      width:320,
      height:320,
      backgroundColor: 'transparent',
    },
    recipe_text: {
      marginBottom: 10,
      textAlignVertical: "center",
      textAlign: 'center',
      backgroundColor: 'transparent',
    }
  });
  