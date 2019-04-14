import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, ActivityIndicator, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { Avatar } from "react-native-elements";
import { Container } from "native-base";
import { Col, Row } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';
import StatusBarBackground from '../../components/StatusBarBackground';
import { Heading, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'email_address'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const YOUR_FAVORITES_URL = `${API_HOST}recsys/recommendation/yrfav/`;
const POPULAR_RECIPES_URL = `${API_HOST}recsys/recommendation/popular/`;
const RANDOM_PICKS_URL = `${API_HOST}recsys/recommendation/random/8/`;

export default class RecSys extends Component {

    static navigationOptions = {
      //title: 'RecSys',
      header: null,
    };
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isRefreshing: false,
        isFetching: false,
        dataSource: [],
        favoriteRecipes: [{}],
        popularRecipes: [{}],
        randomRecipes: [{}],
        user_token: '',
        user_name: 'Guest',
        greeting: 'Hi, Guest.',
      }
    }

    componentWillMount(){
      AsyncStorage.multiGet(ASYNC_STORAGE_KEYS).then((response) => {
        var user_token = response[0][1];
        var user_name = response[1][1];
        if(user_token){
          this.setState({user_token: user_token});
          recipe_categories = ['favoriteRecipes', 'popularRecipes', 'randomRecipes'];
          recipe_categories.forEach(function(cat){
            this.fetchRecipes(cat, this.state.user_token);
          }, this);
          func.fetchBookmarkedRecipes(this.state.user_token);
          func.fetchRatedRecipes(this.state.user_token);
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
        this.setState({isLoading: false,})
      });
    }

    fetchRecipes(state_recipe, user_token) {
      if(!user_token){
        return;
      }
      let url = '';
      switch(String(state_recipe)){
        case 'favoriteRecipes':
          url = YOUR_FAVORITES_URL;
          break;

        case 'popularRecipes':
          url = POPULAR_RECIPES_URL;
          break;

        case 'randomRecipes':
          url = RANDOM_PICKS_URL;
          break;

        default:
          return;
      }
      let header = {
        headers: new Headers ({
          usertoken: user_token,
        }),
      };
      return fetch(url, header)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          [state_recipe]: responseJson,
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    refresh = () => {
      this.setState({ isRefreshing: true });
      this.componentWillMount();
      this.setState({ isRefreshing: false });
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
            <StatusBarBackground />
            <Container style={styles.screen_container}>
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.refresh.bind(this)}
                    />
                  }
                >
                  <Row style={{marginTop: Platform.OS === 'ios' ? 0: 40}}>
                    <Col style={{width: SCREEN_WIDTH*0.8}}>
                      <Heading style={styles.title}>{this.state.greeting}</Heading>
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
                  {func.renderHealthyChoice('Healthy Choice', want_divider=true, navigate, this.state)}
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
  