import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, } from 'react-native';
import { SearchBar, } from "react-native-elements";
import { Container, Header, Content, CardItem, Body, Title, Left, Right, Subtitle, Button, Icon, } from "native-base";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export default class Recipe_Search extends Component {
  
    constructor(props){
      super(props);
      this.state = { 
        dataSource: [],
        isSearched: false,
        keyword: '',
      }
    }

    fetchData(keyword) {
      if(keyword.match(/\//g)) {
        keyword = keyword.replace(/\//g, '\/');
      }
      return fetch('http://django-fyp.herokuapp.com/recsys/search/'+keyword)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //isLoading: false,
          dataSource: [...this.state.dataSource, ...responseJson],
          //displayData: responseJson.slice(0, span),
          //pageNum: this.state.pageNum + 1
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    someMethod1 = (event) => {
        this.setState({
            keyword: event.nativeEvent.text
        });
        this.fetchData(this.state.keyword);
    }

    someMethod2 = () => {
        //console.log('clear');
    }

    render() {
        return(
          <Container>
            <Header>
            <Left />
              <Body>
                <Title>Search Recipes</Title>
              </Body>
            <Right />
            </Header>
            <Container style={styles.screen_container}>
                <Content>
                <SearchBar
                    lightTheme
                    //showLoading
                    ref={search => this.search = search}
                    cancelButtonTitle="Cancel"
                    clearIcon={{ }}
                    placeholder='Search your recipe here...' 
                    onSubmitEditing={this.someMethod1}
                    //onChangeText={this.someMethod1}
                    onClearText={this.someMethod2}
                    containerStyle = {{width: width, }}
                />
                <Text>{this.state.keyword}</Text>
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
      },
  });
  