import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Image, Linking, ScrollView, Modal, Alert } from 'react-native';
import { Rating, Divider } from "react-native-elements";
import { Container, Button, Icon, } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as func from '../RecSys/Recipe_Functions';
import StatusBarBackground from '../../components/StatusBarBackground';
import RecipeNutrition from './RecipeNutrition';

import { Heading, Text, Button as ShoutemButton } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const TEXT_COLOR = 'rgba(0,0,0,1)';

class RecipeReview extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        modal2Visible: false,
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

  render() {
    const recipe = this.props.recipe;

    if(!recipe || recipe == null || recipe == undefined){
        return null;
    }

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
        <Text style={{fontSize: 12}}> ({recipe.rating})</Text>
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
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modal1Visible}
          onRequestClose={() => {
            Alert.alert('Modal1 has been closed.');
        }}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modal2Visible}
                onRequestClose={() => {
                    Alert.alert('Modal2 has been closed.');
                }}
            >
                <RecipeNutrition
                    recipe={recipe}
                    modal2Visible={this.state.modal2Visible}    
                    parent={this}       
                />
            </Modal>
            <StatusBarBackground height='autofix' /> 
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
                                <Row style={{flex:1, flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Button transparent onPress={()=>this.redirectRecipeURL(recipe.sourcerecipeurl)} >
                                    <Icon type='Ionicons' name='ios-link' style={{}}/>
                                    </Button>
                                    <Button transparent onPress={()=>{
                                        this.setState({modal2Visible: true});
                                        console.log(this.state.modal2Visible);
                                    }}>
                                    <Icon type='MaterialCommunityIcons' name='nutrition' style={{'color':'green'}}/>
                                    </Button>
                                </Row>
                                </Col>
                            </Row>
                            <Row>
                                {this.renderIngredients(func.getIngredients(recipe))}
                            </Row>
                            <Row style={styles.button_container}>
                                <ShoutemButton styleName="secondary full-width" style={styles.button} 
                                onPress = {() => this.props.parent.addDish(recipe)}><Text>Add Dish</Text></ShoutemButton>
                            </Row>                            
                            <Row style={styles.button_container}>
                                <ShoutemButton styleName="secondary full-width" style={{...styles.button, ...{marginBottom: 40}}} 
                                onPress = {() => this.props.parent.setState({modal1Visible: false})}><Text>Close</Text></ShoutemButton>
                            </Row>
                        </Grid>
                    </View>
                </ScrollView>
            </Container>
        </Modal>
    );
    }
}

const styles = StyleSheet.create({
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
  button_container: {
    width: SCREEN_WIDTH*0.7,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor:'#7FAAFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee'
  },
});

module.exports = RecipeReview