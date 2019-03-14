import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, } from 'react-native';
import { SearchBar, } from "react-native-elements";
import { Container, } from "native-base";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const API_HOST = 'http://django-fyp.herokuapp.com/';
const SEARCH_URL = `${API_HOST}recsys/search/`;

export default class Recipe_Search extends Component {

    static navigationOptions = {
      title: 'Search Recipes',
    }
  
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
      return fetch(`${SEARCH_URL}${keyword}`)
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
        //this.fetchData(this.state.keyword);
    }

    someMethod2 = () => {
        console.log('clear');
    }

    render() {
        return(
          <Container>
            <Container style={styles.screen_container}>
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
                    containerStyle = {{width: SCREEN_WIDTH, }}
                />
                <Text>{this.state.keyword}</Text>
              </Container>
            </Container>
        );
    }
  
  }
  
  const styles = StyleSheet.create({
    screen_container: {
        flex: 1,
      },
  });
  