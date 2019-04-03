import React, { Component } from 'react';
import { Dimensions, StatusBar, StyleSheet, ActivityIndicator, ScrollView, AsyncStorage} from 'react-native';
import { Avatar } from "react-native-elements";
import { Container} from "native-base";
import { Col, Row } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';
import { Heading, Text } from '@shoutem/ui';

import {getDiarySummary} from '../Diary/DiaryFunctions'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'email_address'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const YOUR_FAVORITES_URL = `${API_HOST}recsys/recommendation/yrfav/`;
const POPULAR_RECIPES_URL = `${API_HOST}recsys/recommendation/popular/`;
const RANDOM_PICKS_URL = `${API_HOST}recsys/recommendation/random/8`;

export default class RecSys extends Component {

    static navigationOptions = {
      title: 'RecSys',
    };

    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        isFetching: false,
        dataSource: [],
        favoriteRecipes: [{}],
        popularRecipes: [{}],
        randomRecipes: [{}],
        user_token: '',
        user_name: 'Guest',
        greeting: 'Hi, Guest.',
        diarySummary: {},
      }
    }

    componentDidMount(){
      AsyncStorage.multiGet(ASYNC_STORAGE_KEYS).then(async (response) => {
        var user_token = response[0][1];
        var user_name = response[1][1];
        if(user_token){
          this.setState({user_token: user_token});
          this.fetchFavoriteRecipes(this.state.user_token);
          this.fetchPopularRecipes();
          this.fetchRandomRecipes();
          func.fetchBookmarkedRecipes(this.state.user_token);
          func.fetchRatedRecipes(this.state.user_token);
          let diarySummary = await getDiarySummary(this.state.user_token);
          this.setState({diarySummary: diarySummary});
        }
        if(user_name){
          this.setState({user_name: user_name});
          var d = new Date();
          var n = d.getHours();
          var greet = 'Hi';
          if(n >= 6 && n < 12) {
            greet = 'Good morning';
          } else if(n >= 12 && n < 18) {
            greet = 'Good Afternoon';
          } else {
            greet = 'Good night';
          }
          this.setState({greeting: `${greet}, ${this.state.user_name}.`})
        }
        console.log(this.state.diarySummary);
        this.setState({isLoading: false,})
      });
    }

    fetchFavoriteRecipes(user_token) {
      if(!user_token){
        return;
      }
      return fetch(YOUR_FAVORITES_URL, {
        headers: new Headers ({
          usertoken: user_token,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          favoriteRecipes: responseJson,
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchPopularRecipes() {
      return fetch(POPULAR_RECIPES_URL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          popularRecipes: responseJson,
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchRandomRecipes() {
      return fetch(RANDOM_PICKS_URL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          randomRecipes: responseJson,
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
              <Container style={styles.loading_container}>
                <Text>Loading...</Text>
                <ActivityIndicator/>
              </Container>
            )
        }
        return(
          <Container>
            <Container style={styles.screen_container}>
                <ScrollView>
                  <Row>
                    <Col style={{width: SCREEN_WIDTH*0.8}}>
                      <Heading style={styles.title}>{this.state.greeting}</Heading>
                      <Text style={{marginHorizontal:20}}>{this.state.diarySummary.text}</Text>
                    </Col>
                    <Col style={{width: SCREEN_WIDTH*0.2, flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Avatar
                        medium
                        rounded
                        title={this.state.user_name[0].toUpperCase()}
                        containerStyle={styles.avatar}
                        onPress={() => navigate('Profile')}
                      />
                    </Col>
                  </Row>
                  {func.renderMainMenuRecipesInComplexCarousel('Your Favorites', this.state.favoriteRecipes, want_divider=true, navigate, this.state)}
                  {func.renderMainMenuRecipesInSimpleCarousel('Popular Cuisines', this.state.popularRecipes, want_divider=true, navigate, this.state)}
                  {func.renderMainMenuRecipesInSimpleCarousel('Random Picks', this.state.randomRecipes, want_divider=false, navigate, this.state)}
                </ScrollView>
              </Container>
            </Container>
        );
    }

  }

  const styles = StyleSheet.create({
    loading_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    screen_container: {
      flex: 1,
    },
    title: {
      margin: 20,
      fontWeight: 'bold',
    },
    avatar: {
      margin: 20,
    },
    content: {
      paddingTop: 0,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
