import React, { Component } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, AsyncStorage, } from 'react-native';
import { SearchBar, } from "react-native-elements";
import { Container, } from "native-base";
import * as func from './Recipe_Functions.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS_FOR_USER_TOKEN = 'user_token';

const TEXT_COLOR = 'rgba(0,0,0,1)';

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
        isSearched: false,
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

    fetchData(keyword) {
      if(keyword.match(/\//g)) {
        keyword = keyword.replace(/\//g, '\/');
      }
			if(!keyword.match(/\/$/g)) {
        keyword = keyword + '/';
      }
      keyword = keyword.replace(/\s/g, '+');
      return fetch('https://django-fyp.herokuapp.com/recsys/search_exact/'+keyword)
      .then((response) => response.json())
      .then((responseJson) => {
				this.setState({
					searchError: false,
          dataSource: [...this.state.dataSource, ...responseJson],
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
            isSearched: true,
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
