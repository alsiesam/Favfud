import React, { Component } from 'react';
import { Platform, Dimensions, ScrollView, StatusBar, StyleSheet, View, Text, AsyncStorage, } from 'react-native';
import { SearchBar, } from "react-native-elements";
import { Container, } from "native-base";
import * as func from './Recipe_Functions.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS_FOR_USER_TOKEN = 'user_token';

export default class Recipe_Search extends Component {

    static navigationOptions = {
      title: 'Search Recipes',
    }

    constructor(props){
      super(props);
      this.state = {
        dataSource: [],
        searchError: false,
        keyword: '',
        user_token: '',
      }
    }

    componentWillMount() {
      AsyncStorage.getItem(ASYNC_STORAGE_KEYS_FOR_USER_TOKEN)
      .then((ut) => {
          if(ut){
              this.setState({user_token: ut});
          }
      });
    }

    fetchData(keyword) {
      if(keyword.match(/\//g)) {
        keyword = keyword.replace(/\//g, '\/');
      }
			if(!keyword.match(/\/$/g)) {
        keyword = keyword + '/';
      }
			keyword = keyword.replace(/\s/g, '+');
      return fetch('https://django-fyp.herokuapp.com/recsys/search_exact/'+keyword+'/')
      .then((response) => response.json())
      .then((responseJson) => {
				// console.warn(responseJson);
				this.setState({
          //isLoading: false,
					searchError: false,
          dataSource: [...this.state.dataSource, ...responseJson],
          //displayData: responseJson.slice(0, span),
          //pageNum: this.state.pageNum + 1
        }, function(){
          // console.log(responseJson);
        });

      })
      .catch((error) =>{
				this.setState({
					searchError: true,
        });
        console.error(error);
      });
    }

    submitEditing = (event) => {
				if (event.nativeEvent.text == this.state.keyword) return;

        this.setState({
            keyword: event.nativeEvent.text,
	          dataSource: [],
        });

        this.fetchData(event.nativeEvent.text);
    }

    render() {
			const {navigate} = this.props.navigation;
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
                    onSubmitEditing={this.submitEditing}
                    containerStyle = {{width: SCREEN_WIDTH, }}
                />
								<ScrollView>
									{
										(this.state.searchError == true)?
											(<Text style={{marginTop: 20,marginLeft: 20,marginRight: 20,fontSize: 20,}}>There is an error, please try again.</Text>):
											func.renderSearchResultsList('Search result of '+this.state.keyword, this.state.dataSource, want_divider=true, navigate, this.state)
									}
								</ScrollView>
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
