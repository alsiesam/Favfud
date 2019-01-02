import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Image, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity, Linking, ScrollView} from 'react-native';
import { Rating } from "react-native-elements";
import { Container, Header, Body, Title, Content, Button, Icon, Left, Right, Text, Accordion } from "native-base";

export default class Recipe_Information extends Component {
  
  constructor(props){
    super(props);
    this.state = { 
      recipe: props.navigation.state.params.recipe
    }
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

  render() {
    const {navigate} = this.props.navigation;
    const recipe = this.state.recipe;
    //console.log(recipe);
    return(
      <Container>
        <Header>
          <Left>
              <Button transparent onPress={()=>navigate('RecSys')}>
              <Icon name="arrow-back" />
              <Text> Back </Text>
            </Button>
          </Left>
          <Body>
            <Title>Recipe</Title>
          </Body>
          <Right />
        </Header>
        <Container style={styles.screen_container}>
          <Content>
            <Image source={{uri: recipe.imageurlsbysize_360}} style={styles.recipe_image} />
            <Text style={styles.title}>{recipe.recipe_name}</Text>
            {/* <Rating
              showRating
              type="star"
              fractions={1}
              startingValue={recipe.rating}
              //readonly
              imageSize={40}
              //onFinishRating={this.ratingCompleted}
              style={{ paddingVertical: 10 }}
            /> */}
            
              <Button danger style={styles.button}  onPress={()=>navigate('Recipe_Cooking_Time', {recipe: recipe})}>
                <Icon type="Entypo" size={40} name='time-slot'/>
                <Text>Cooking Time</Text>
              </Button>
              <Button info style={styles.button}  onPress={()=>navigate('Recipe_Ingredients', {recipe: recipe})}>
                <Icon type="Ionicons" size={40} name='md-nutrition'/>
                <Text>Ingredients</Text>
              </Button>
              <Button success style={styles.button}  onPress={()=>navigate('Recipe_Nutrition', {recipe: recipe})}>
                <Icon type="MaterialCommunityIcons" size={40} name='nutrition'/>
                <Text>Nutrition Fact</Text>
              </Button>
              <Button warning style={styles.button} onPress={()=>this.redirectRecipeURL(recipe.sourcerecipeurl)} >
                <Icon type="Feather" size={40} name='external-link'/>
                <Text>Recipe Link</Text>
              </Button>
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
    paddingTop: 50,
    //paddingBottom: 50,
  },
  button: {
    //height: 80,
    alignSelf:'center',
    width: 200,
    marginBottom: 20,
    //marginRight: 40,
  },
  title: {
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  recipe_image: {
    width:320,
    height:320,
    backgroundColor: 'transparent',
  },
});
