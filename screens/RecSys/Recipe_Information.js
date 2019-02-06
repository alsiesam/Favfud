import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Image, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity, Linking, ScrollView} from 'react-native';
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
      recipe: props.navigation.state.params.recipe
    }
  }

  componentDidMount(){
    this.fetchSimilarRecipes(this.state.recipe);
  }

  fetchSimilarRecipes(recipe) {
    return fetch('http://django-fyp.herokuapp.com/recsys/id/ids', {
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
              horizontal={true}
              data={this.state.similar_recipes}
              renderItem={({ item: rowData }) => {
              return(
                <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData}, key: 'Info'+rowData.id})}>
                  <Card
                    image={{ 
                      uri: rowData.imageurlsbysize_360 
                    }}
                    imageStyle={styles.related_recipe_image}
                    containerStyle={[styles.related_recipe_container]}
                  >
                  <Text numberOfLines={3}>{rowData.recipe_name}</Text>
                  </Card>
                </TouchableOpacity>
              );
              }}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={[]}
              showsHorizontalScrollIndicator={false}
            />
      </Grid>
    );
  }

  render() {
    const {navigate} = this.props.navigation;
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
              <Button transparent onPress={()=>navigate('RecSys')}>
              <Icon name="arrow-back" />
              <Text>Back To RecSys</Text>
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
                  <Row style={{alignItems:'flex-end', }}>
                    <Button transparent style={styles.button}  onPress={()=>navigate({routeName: 'Recipe_Nutrition', params: {recipe: recipe}, key: 'Nut'+recipe.id})}>
                      <Icon type='MaterialCommunityIcons' name='nutrition'/>
                    </Button>
                    <Button transparent style={styles.button} onPress={()=>this.redirectRecipeURL(recipe.sourcerecipeurl)} >
                      <Icon type='Feather' name='external-link'/>
                    </Button>
                    <Button transparent style={styles.button}>
                      <Icon type='Ionicons' name='ios-more'/>
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Row>
                {this.renderIngredients(func.getIngredients(recipe))}
              </Row>
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
    //height: 80,
    alignSelf: 'flex-end',
    //width: 200,
    //marginRight: 40,
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
});
