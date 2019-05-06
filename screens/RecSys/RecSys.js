import React, { Component } from 'react';
import { Platform, Dimensions, View, StyleSheet, ActivityIndicator, ScrollView, AsyncStorage, RefreshControl, StatusBar } from 'react-native';
import { Avatar } from "react-native-elements";
import { Col, Row } from "react-native-easy-grid";
import { NavigationEvents } from 'react-navigation';
import StatusBarBackground from '../../components/StatusBarBackground';
import { Heading, Text } from '@shoutem/ui';
import { LinearGradient } from 'expo';
import color from '../../constants/Colors';
import * as func from './Recipe_Functions.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'email_address'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const SELECTIONS_EXIST_URL = `${API_HOST}recsys/recommendation/selections/exist/`;
const YOUR_FAVORITES_URL = `${API_HOST}recsys/recommendation/yrfav/`;
const POPULAR_RECIPES_URL = `${API_HOST}recsys/recommendation/popular/`;
const RANDOM_PICKS_URL = `${API_HOST}recsys/recommendation/random/8/`;

let time = func.getTime();
const THEME_COLOR = color.themeColor.recsys.theme[time];
const TEXT_COLOR = color.themeColor.recsys.text[time];
const GRADIENT_COLOR = color.themeColor.recsys.gradient[time];

export default class RecSys extends Component {

    static navigationOptions = {
      header: null,
    };
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isRefreshing: false,
        isFetching: false,
        activeSlide1: 0,
        activeSlide2: 0,
        activeSlide3: 0,
        activeSlide4: 0,
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
          this.fetchSelectionsExist(user_token);
          recipe_categories = ['favoriteRecipes', 'popularRecipes', 'randomRecipes'];
          recipe_categories.forEach(function(cat){
            this.fetchRecipes(cat, this.state.user_token);
          }, this);
          func.fetchBookmarkedRecipes(this.state.user_token);
          func.fetchRatedRecipes(this.state.user_token);
        }
        if(user_name){
          this.setState({user_name: user_name});
          if(time == 'morning') {
            greet = 'Good morning';
          } else if(time == 'afternoon') {
            greet = 'Good Afternoon';
          } else {
            greet = 'Good night';
          }
          this.setState({greeting: `${greet}, ${this.state.user_name}.`})
        }
        this.setState({isLoading: false,})
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

    fetchSelectionsExist(user_token) {
      let header = {
        headers: new Headers ({
          usertoken: user_token,
        }),
      };
      return fetch(SELECTIONS_EXIST_URL, header)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          hbsExist: responseJson['healthy_body_selections'],
          dsExist: responseJson['diary_selections'],
        });
      })
      .catch((error) =>{
        console.error(error);
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
      this.fetchSelectionsExist(this.state.user_token);
      recipe_categories = ['favoriteRecipes'];
      recipe_categories.forEach(function(cat){
        this.fetchRecipes(cat, this.state.user_token);
      }, this);
      this.setState({ isRefreshing: false });
    }
  
    render() {
        const {navigate} = this.props.navigation;
        if(this.state.isLoading){
            return(
              <View style={styles.loading_container}>
                <Text style={styles.text}>Loading...</Text>
                <ActivityIndicator color={styles.text.color}/>
              </View>
            )
        }
        return(
          <View style={styles.screen_container}>
            {/* Release until demo */}
            <NavigationEvents
                onWillFocus={this.refresh.bind(this)}
            />
            <ScrollView
              // refreshControl={
              //   <RefreshControl
              //     refreshing={this.state.isRefreshing}
              //     onRefresh={this.refresh.bind(this)}
              //     tintColor={TEXT_COLOR}
              //   />
              // }
              style={{backgroundColor: THEME_COLOR}}
            >
              <StatusBarBackground height='autofix' /> 
              <LinearGradient colors={GRADIENT_COLOR} >
              <Row style={{marginTop: Platform.OS === 'ios' ? 0: 40,}}>
                <Col style={{width: SCREEN_WIDTH*0.8}}>
                  <Heading style={{...styles.title, ...styles.text}}>{this.state.greeting}</Heading>
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
              {func.renderHealthyChoice('Healthy Choice', want_divider=true, navigate, this)}
              {func.renderMainMenuRecipesInComplexCarousel('Your Favorites', this.state.favoriteRecipes, want_divider=true, navigate, this)}
              {func.renderMainMenuRecipesInSimpleCarousel('Popular Cuisines', this.state.popularRecipes, want_divider=true, navigate, this, 3)}
              {func.renderMainMenuRecipesInSimpleCarousel('Random Picks', this.state.randomRecipes, want_divider=false, navigate, this, 4)}
              </LinearGradient>                
            </ScrollView>
          </View>
        );
    }
  
  }
  
  const styles = StyleSheet.create({
    text: {
      color: TEXT_COLOR,
    },
    loading_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: THEME_COLOR,
    },
    screen_container: {
      flex: 1,
      backgroundColor: THEME_COLOR,
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
  