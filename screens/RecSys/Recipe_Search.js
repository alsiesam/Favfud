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
        isSearched: false,
        keyword: '',
      }
    }

    someMethod1 = (word) => {
        this.setState({
            keyword: word
        });
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
                    platform="ios"
                    ref={search => this.search = search}
                    cancelButtonTitle="Cancel"
                    cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                    clearIcon={{ }}
                    placeholder='Search your recipe here...' 
                    onChangeText={this.someMethod1}
                    onClear={this.someMethod2}
                    onCancel={this.someMethod2}
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
  