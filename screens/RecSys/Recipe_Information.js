import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Image, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity, Linking, ScrollView, Modal, TouchableHighlight, AsyncStorage} from 'react-native';
import { Rating, Divider } from "react-native-elements";
import { Card, } from "react-native-elements";
import { Container, Header, Body, Title, Content, Button, Icon, Left, Right, Text, Accordion } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';

const width = Dimensions.get('window').width - 40; //full width
const height = Dimensions.get('window').height; //full height

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

  componentWillMount() {
    //console.log("Will:"+this.state.recipe.id.toString());
  }

  componentDidMount(){
    this.updateInteraction('tapview');
    this.fetchSimilarRecipes(this.state.recipe);
    //console.log("Did:"+this.state.recipe.id.toString());
    recipe_id = this.state.recipe.id.toString();
    AsyncStorage.getItem('bookmarked_recipe')
    .then((recipes) => {
      const r = recipes ? JSON.parse(recipes) : [];

      //console.log(r);

      if(r.includes(recipe_id)){
        this.setState({bookmarked: true});
      }

    });
    AsyncStorage.getItem('recipe_ratings')
    .then((ratings) => {
      const rat = ratings ? JSON.parse(ratings) : {};

      //console.log(rat);

      if(recipe_id in rat){
        this.setState({recipe_rating: rat[recipe_id]});
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
    fetch('http://django-fyp.herokuapp.com/recsys/interaction/update/', {
      method: 'POST',
      headers: new Headers (update_header),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson);
    })
    .catch((error) =>{
      //console.error(error);
    });
  }

  fetchSimilarRecipes(recipe) {
    return fetch('http://django-fyp.herokuapp.com/recsys/recipe/id/ids', {
      headers: new Headers ({
        ids: recipe.similar_recipe_id.split('$')
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        similar_recipes: responseJson
      }, function(){
        //console.log(responseJson)
        //console.log(this.state.recipe.similar_recipe_id)
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
                <Text style={styles.subtitle}>
                    Ingredients
                </Text>
                
            </Row>
            <Divider style={{ marginBottom: 20, }} />
            { ingredients_arr.map((ingredients, i) => {
                return(
                <Row key={i} style={{height:40, marginBottom:20,}}>
                    <Text>{ingredients}</Text>
                </Row>
                );
            }) }
            <Divider style={{ marginBottom: 20, }} />
        </Grid>
    );
  }

  renderCorrelatedRecipes() {
    const {navigate} = this.props.navigation;
    return(
      <Grid>
          <Row style={{height: 'auto', marginBottom: 10,}}>
              <Text style={styles.subtitle}>
                  Related Recipes
              </Text>
          </Row>
          <FlatList
                  horizontal={horizontal}
                  data={this.state.similar_recipes}
                  numColumns={numCol}
                  renderItem={({ item: rowData }) => {
                    return(
                      <View style={{marginTop: 20, marginRight: 30, marginBottom: 20,}}>
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
    AsyncStorage.getItem('bookmarked_recipe')
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
      AsyncStorage.setItem('bookmarked_recipe', JSON.stringify(r));
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
    //console.log(rating);
    this.renderRatingAlertBox(rating);
  }

  renderRatingAlertBox(rating){
    Alert.alert(
      'You have rated '+rating+'/5',
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
    //console.log("rating:"+rating);
    return rating;
  }

  setRating(_rating) {
    this.setState({recipe_rating: _rating});
    AsyncStorage.getItem('recipe_ratings')
    .then((ratings) => {
      const rat = ratings ? JSON.parse(ratings) : {};
      const newValue = this.state.recipe.id.toString();
      rat[newValue] = _rating.toString();
      AsyncStorage.setItem('recipe_ratings', JSON.stringify(rat));
    });
    this.updateInteraction('rating', {rating: _rating});
  }

  renderRatingInfo() {
    if(this.state.recipe_rating == -1){
      return(<Text style={[{marginBottom: 10,}, styles.title]}>How would you rate this recipe?</Text>);
    } else {
      return(<Text style={[{marginBottom: 10,}, styles.title]}>You have rated the recipe {this.state.recipe_rating}/5</Text>);
    }
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Container style={styles.screen_container}>
        <StatusBar
            barStyle="light-content"
        />
        <Text>Loading...</Text>
            <ActivityIndicator/>
        </Container>
        )
      } else {
        const {navigate} = this.props.navigation;
        const {goBack} = this.props.navigation;
        const recipe = this.state.recipe;
        //console.log(recipe);

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
              //onFinishRating={this.ratingCompleted}
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
          // if(recipe.numberofservings > 18){
          //   recipe.numberofservings = 18;
          // }
          // _fontSize = recipe.numberofservings <= 8 ? 25 : 20;
          // _iconWidth = recipe.numberofservings <= 8 ? 30 : 20;
          numofservings = 
          <Row style={{height:'auto', marginBottom:10}}>
            <Icon type='Ionicons' name='md-person' style={{fontSize:16, marginTop:0,}}/>
            <Text style={{fontSize: 12, textAlign: 'center', textAlignVertical: 'center',}}> {
              recipe.numberofservings
            } servings
            </Text>
          </Row>;
          // <Row style={{
          //   flexDirection:'row', height:'auto', justifyContent:'flex-start', flexWrap: 'wrap',
          // }}>
          //   { [...Array(recipe.numberofservings).keys()].map((i) => {
          //     return(
          //       <Col key={i} style={{width:_iconWidth,}}>
          //         <Icon type="Ionicons" name="md-person" style={{fontSize: _fontSize}}/>
          //       </Col>
          //     );
          //   }) }
          // </Row>;
        }

        return(
          <Container>
            <Header>
              <Left>
                  <Button transparent onPress={()=>goBack()}>
                    <Icon name="arrow-back" />
                    <Text>Back</Text>
                  </Button>
              </Left>
              <Body>
                <Title>Recipe</Title>
              </Body>
              <Right />
            </Header>
            <Container style={styles.screen_container}>
              <Content style={[{width: width,}, styles.content,]}>
                <Grid>
                  <Row style={{
                    flex:2, justifyContent:'space-between', alignSelf:'center',
                    marginBottom:20, height:180, 
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
                        <Button transparent style={styles.button} onPress={()=>this.redirectRecipeURL(recipe.sourcerecipeurl)} >
                          <Icon type='Ionicons' name='ios-link' style={{}}/>
                        </Button>
                        <Button transparent style={styles.button}  onPress={()=>navigate({routeName: 'Recipe_Nutrition', params: {recipe: recipe}, key: 'Nut'+recipe.id})}>
                          <Icon type='MaterialCommunityIcons' name='nutrition' style={{'color':'green'}}/>
                        </Button>
                        <Button transparent style={styles.button}
                        // onPress={() => {
                        //   this.setModalVisible(true);
                        // }}
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
                  <Container style={{height: 30,}}></Container>
                </Grid>
              </Content>
            </Container>
          </Container>
        );
      }
    }
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'skyblue',
    //paddingTop: 50,
    //paddingBottom: 50,
  },
  content: {
    //backgroundColor: "red",
    paddingTop: 20,
    //margin: 20,
  },
  button: {

  },
  title: {
    //textAlignVertical: 'center',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 15,
    //paddingTop: 20,
    paddingBottom: 5,
  },
  recipe_image: {
    marginBottom: 5,
    width: 180,
    height: 180,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  rows: {
    alignSelf:'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 18,
    // marginTop: 20,
    // marginBottom: 20,
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
});
