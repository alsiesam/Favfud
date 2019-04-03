import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, View, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Linking, ScrollView, AsyncStorage} from 'react-native';
import { Rating, Divider } from "react-native-elements";
import { Container, Button, Icon, } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';

import { Heading, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['bookmarked_recipe', 'recipe_ratings'];
const ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE = 'bookmarked_recipe';
const ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS = 'recipe_ratings';
const API_HOST = 'http://django-fyp.herokuapp.com/';
const UPDATE_INTERACTION_URL = `${API_HOST}recsys/interaction/update/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;

export default class Recipe_Information extends Component {
  
  constructor(props){
    super(props);
    this.state = { 
      isLoading: true,
      recipe: props.navigation.state.params.recipe,
      user_token: props.navigation.state.params.user_token,
      modalVisible: false,
      recipe_rating: -1,
      similar_recipes: '',
      bookmarked: false,
    }
  }

  componentWillMount(){
    //this.updateInteraction('tapview');
    this.fetchSimilarRecipes(this.state.recipe);
    recipe_id = this.state.recipe.id.toString();

    AsyncStorage.multiGet(ASYNC_STORAGE_KEYS).then((response) => {
      const bookmarked_recipes_list = response[0][1] ? JSON.parse(response[0][1]) : [];
      if(bookmarked_recipes_list.includes(recipe_id)){
        this.setState({bookmarked: true});
      }
      const rating_list = response[1][1] ? JSON.parse(response[1][1]) : [];
      if(recipe_id in rating_list){
        this.setState({recipe_rating: rating_list[recipe_id]});
      }
      this.setState({
        isLoading: false
      });
    });
  }

  updateInteraction(act, remarks) {
    update_header = {usertoken: this.state.user_token, recipeid: this.state.recipe.id, recipetoken: this.state.recipe.recipe_token};
    switch(act) {
      case 'tapview':
        update_header.action = act;
        break;
      case 'bookmark':
        update_header.action = act+'$'+remarks.flag.toString();
        break;
      case 'rating':
        update_header.action = act+'$'+remarks.rating.toString();
        break;
      default:
        break;
    }
    //console.log(update_header);
    fetch(UPDATE_INTERACTION_URL, {
      method: 'POST',
      headers: new Headers (update_header),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson);
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  fetchSimilarRecipes(recipe) {
    return fetch(GET_MULTIPLE_RECIPES_URL, {
      headers: new Headers ({
        ids: recipe.similar_recipe_id.split('$')
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        similar_recipes: responseJson
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  redirectRecipeURL(recipeURL){
    Linking.canOpenURL(recipeURL).then(supported => {
      if (supported) {
        Linking.openURL(recipeURL);
      } else {
        console.log("Don't know how to open URI: " + recipeURL);
      }
    });
  }

  renderIngredients(ingredients_arr) {
    return(
        <Grid>
            <Row style={{height: 'auto', marginBottom: 10,}}>
                <Heading style={styles.subtitle}>
                    Ingredients
                </Heading>
            </Row>
            { ingredients_arr.map((ingredients, i) => {
              if(i%2 == 0){
                return(
                  <Row key={i} style={styles.oddIngredientRow}>
                      <Text style={styles.oddIngredientText}>{ingredients}</Text>
                  </Row>
                );
              } else {
                return(
                  <Row key={i} style={styles.evenIngredientRow}>
                      <Text style={styles.evenIngredientText}>{ingredients}</Text>
                  </Row>
                );
              }
            }) }
            <Divider style={{ marginTop: 20, marginBottom: 20, }} />
        </Grid>
    );
  }

  renderCorrelatedRecipes() {
    const {navigate} = this.props.navigation;
    if(this.state.similar_recipes && Object.keys(this.state.similar_recipes[0]).length == 0){
      return null;
    }
    return(
      <Grid>
          <Row style={{height: 'auto',}}>
              <Text style={styles.subtitle}>
                  Related Recipes
              </Text>
          </Row>
          <FlatList
            horizontal={true}
            data={this.state.similar_recipes}
            numColumns={1}
            renderItem={({ item: rowData, index }) => {
              return(
                <View style={{marginTop: 20, marginRight: 30,}}>
                  <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: this.state.user_token}, key: 'Info'+rowData.id})}>
                    <Image
                      style={styles.recipe_image}
                      source={{uri: rowData.imageurlsbysize_360}}
                    />
                    <Row style={{height: 50, width: styles.recipe_image.width, flexDirection:'row'}}>
                      <Text numberOfLines={2} style={{flex: 1, flexWrap: 'wrap'}}>
                        {rowData.recipe_name}
                      </Text>
                    </Row>
                  </TouchableOpacity> 
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{marginLeft: 20, }}
          />
      </Grid>
    );
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setBookmark(_bookmarked) {
    if(_bookmarked == true){
      this.setState({bookmarked: false});
    } else {
      this.setState({bookmarked: true});
    }
    AsyncStorage.getItem(ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE)
    .then((recipes) => {
      const r = recipes ? JSON.parse(recipes) : [];
      const newValue = this.state.recipe.id.toString();
      if(r.includes(newValue)){
        var index = r.indexOf(newValue);
        if (index > -1) {
          r.splice(index, 1);
        }
      } else {
        r.push(newValue);
      }
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE, JSON.stringify(r));
    });
    bookmark_flag = !_bookmarked ? 'true' : 'false';
    this.updateInteraction('bookmark', {flag: bookmark_flag});
  }

  setBookmarkStyle(_color) {
    return {
      color: _color,
    }
  }

  ratingCompleted(rating) {
    this.renderRatingAlertBox(rating);
  }

  renderRatingAlertBox(rating){
    Alert.alert(
      `You have rated ${rating}/5`,
      'Confirm your rating?',
      [
        {
          text: 'OK', 
          onPress: () => this.setRating(rating)
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  getRating() {
    rating = this.state.recipe_rating == -1 ? 0 : parseInt(this.state.recipe_rating);
    return rating;
  }

  setRating(_rating) {
    this.setState({recipe_rating: _rating});
    AsyncStorage.getItem(ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS)
    .then((ratings) => {
      const rat = ratings ? JSON.parse(ratings) : {};
      const newValue = this.state.recipe.id.toString();
      rat[newValue] = _rating.toString();
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS, JSON.stringify(rat));
    });
    this.updateInteraction('rating', {rating: _rating});
  }

  renderRatingInfo() {
    if(this.state.recipe_rating == -1){
      return(<Text style={{marginBottom: 10,}}>How would you rate this recipe?</Text>);
    } else {
      return(<Text style={{marginBottom: 10,}}>You have rated the recipe {this.state.recipe_rating}/5</Text>);
    }
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Container style={styles.loading_container}>
          <Text>Loading...</Text>
          <ActivityIndicator/>
        </Container>
        )
      } else {
        const {navigate} = this.props.navigation;
        const recipe = this.state.recipe;

        rating = '';
        if('rating' in recipe){
          rating = 
          <Row style={{height:'auto', marginBottom:20}}>
            <Rating
              type="star"
              fractions={1}
              startingValue={recipe.rating}
              readonly
              imageSize={12}
              style={{ }}
            />
            <Text style={{fontSize: 12}}> ({this.state.recipe.rating})</Text>
          </Row>;
        }

        totaltime = '';
        if('totaltimeinseconds' in recipe){
          totaltime = 
          <Row style={{height:'auto', marginBottom:10}}>
            <Icon type='Entypo' name='time-slot' style={{fontSize:12, marginTop:1,}}/>
            <Text style={{fontSize: 12, textAlign: 'center', textAlignVertical: 'center',}}> {
              func.secondsToHms(recipe.totaltimeinseconds)
            }
            </Text>
          </Row>;
        }

        numofservings = '';
        if('numberofservings' in recipe){
          numofservings = 
          <Row style={{height:'auto', marginBottom:10}}>
            <Icon type='Ionicons' name='md-person' style={{fontSize:16, marginTop:0,}}/>
            <Text style={{fontSize: 12, textAlign: 'center', textAlignVertical: 'center',}}> {
              recipe.numberofservings
            } servings
            </Text>
          </Row>;
        }

        return(
          <Container style={styles.screen_container}>
            <ScrollView>
            <View>
              <Grid>
                <Row style={{
                  flex:2, justifyContent:'space-between', alignSelf:'center',
                  margin:20, height:180,
                }}>
                  <Col style={{flex:1, marginRight:10}}>
                    <Image source={{uri: recipe.imageurlsbysize_360}} style={styles.recipe_image} />
                  </Col>
                  <Col style={{flex:1, marginLeft:10}}>
                    <Row style={{height:'auto'}}>
                        <Text numberOfLines={3} style={styles.title}>{recipe.recipe_name}</Text>
                    </Row>
                    {rating}
                    {totaltime}
                    {numofservings}
                    <Row>
                      <Button transparent onPress={()=>this.redirectRecipeURL(recipe.sourcerecipeurl)} >
                        <Icon type='Ionicons' name='ios-link' style={{}}/>
                      </Button>
                      <Button transparent onPress={()=>navigate({routeName: 'Recipe_Nutrition', params: {recipe: recipe}, key: 'Nut'+recipe.id})}>
                        <Icon type='MaterialCommunityIcons' name='nutrition' style={{'color':'green'}}/>
                      </Button>
                      <Button transparent
                      onPress={() => {
                        this.setBookmark(this.state.bookmarked);
                      }}
                      >
                        <Icon type='Ionicons' name='ios-bookmark' style={this.state.bookmarked ? this.setBookmarkStyle('brown') : this.setBookmarkStyle('gray')}/>
                      </Button>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  {this.renderIngredients(func.getIngredients(recipe))}
                </Row>
                <Row style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 20, }}>
                  {this.renderRatingInfo()}
                  <Rating
                    showRating
                    onFinishRating={(rating) => this.ratingCompleted(rating)}
                    imageSize={30}
                    startingValue={this.getRating()}
                    showRating={false}
                  />
                </Row>
                <Divider style={{ marginBottom: 20, }} />
                <Row>
                  {this.renderCorrelatedRecipes()}
                </Row>
              </Grid>
            </View>
            </ScrollView>
          </Container>
        );
      }
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 5,
  },
  recipe_image: {
    marginBottom: 5,
    width: 180,
    height: 180,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 25,
  },
  subtitle: {
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 20,
  },
  related_recipe_container: {
    padding: 0,
    width: 180,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  related_recipe_image: {
    width: 180,
    height: 180,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  bookmark: {
    color: 'red',
  },
  oddIngredientRow: {
    height: 60,
    backgroundColor: 'rgb(245,245,245)',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  evenIngredientRow: {
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  oddIngredientText: {
    marginLeft: 20,
    marginRight: 20,
  },
  evenIngredientText: {
    marginLeft: 20,
    marginRight: 20,
  },
});
