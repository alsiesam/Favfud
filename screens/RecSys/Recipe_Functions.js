import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, AsyncStorage, Dimensions} from 'react-native';
import { Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel from 'react-native-snap-carousel';
import { Title, Text } from '@shoutem/ui';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export function secondsToHms(d) {
    //console.log(d);
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second " : " seconds ") : "";
    var final = hDisplay + mDisplay + sDisplay;
    return final.trim(); 
}

export function getIngredients(recipe) {
    var ingredient_list = recipe.ingredients;
    var delimiter = "$";
    var ingredient_arr = ingredient_list.split(delimiter).map(function(e){return e.trim();});
    return ingredient_arr;
}

export function arr_diff(a1, a2) {
    var result = {};
    var more = a1.filter(function(i) {return a2.indexOf(i) < 0;});
    var less = a2.filter(function(i) {return a1.indexOf(i) < 0;});
    result["more"] = more;
    result["less"] = less;
    return result;
}


export function fetchBookmarkedRecipes(user_token) {
    fetch('http://django-fyp.herokuapp.com/recsys/interaction/enquire/bookmark/', {
      headers: new Headers ({
        usertoken: user_token,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if('result' in responseJson){
        arr = responseJson['result']
        for(var i = 0; i < arr.length; i++){
          arr[i] = arr[i].toString()
        }
        AsyncStorage.setItem('bookmarked_recipe', JSON.stringify(arr));
      } else {
        AsyncStorage.setItem('bookmarked_recipe', JSON.stringify([]));
      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }

export function fetchRatedRecipes(user_token) {
    fetch('http://django-fyp.herokuapp.com/recsys/interaction/enquire/rating/', {
      headers: new Headers ({
        usertoken: user_token,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      AsyncStorage.setItem('recipe_ratings', JSON.stringify(responseJson));
    })
    .catch((error) =>{
      console.error(error);
    });
}

export function renderMainMenuRecipesInComplexCarousel(title, data, want_divider, navigate, state){
  if(Object.keys(data[0]).length == 0){
    return;
  }
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
  renderGrid = (rowData, numRow, numCol) => {
    let render = [];
    for(var i = 0; i < numRow*numCol; i += numCol){
      tmp = []
      for(var j = i; j < i+numCol; j += 1){
        tmp.push(j);
      }
      render.push(<Row key={i}>{
        tmp.map((index) => {
          return(
            <View key={index} style={{marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5,}}>
              <TouchableOpacity 
              key={rowData['recommend_recipes'][index].id} 
              onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData['recommend_recipes'][index], user_token: state.user_token}, key: 'Info'+rowData['recommend_recipes'][index].id})}
              >
                <Image
                  style={styles.small_recipe_image}
                  source={{uri: rowData['recommend_recipes'][index].imageurlsbysize_360}}
                />
              </TouchableOpacity>
            </View>
          );        
        })
      }</Row>);
    }
    return render;
  }
  return(
    <View>
        <Title style={styles.subtitle}>{title}</Title>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={({ item: rowData }) => {
            return(
              <View style={styles.carouselView}>
                <View style={{flexDirection:'row'}}>
                  <Text numberOfLines={2} style={{ flex: 1, flexWrap: 'wrap', textAlign: 'center', marginBottom: 10, }}>Since you like {rowData.reason_recipe_name}</Text>
                </View>
                <Grid>
                  {renderGrid(rowData,2,2)}
                </Grid>
              </View>
            );
          }}
          sliderWidth={width}
          itemWidth={width}
        />
        {divider}
    </View>
  );
}

export function renderMainMenuRecipesInSimpleCarousel(title, data, want_divider, navigate, state) {
  if(Object.keys(data[0]).length == 0){
    return;
  }
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
  return(
      // <View>
      //   <Title style={styles.subtitle}>{title}</Title>
      //   <FlatList
      //               horizontal={true}
      //               data={data}
      //               numColumns={1}
      //               renderItem={({ item: rowData }) => {
      //                 return(
      //                   <View style={{marginTop: 20, marginLeft: 20, marginRight: 20, marginBottom: 20,}}>
      //                     <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: state.user_token}, key: 'Info'+rowData.id})}>
      //                       <Image
      //                         style={styles.recipe_image}
      //                         source={{uri: rowData.imageurlsbysize_360}}
      //                       />
      //                       <Row style={{height: 50, width: styles.recipe_image.width, flexDirection:'row'}}>
      //                         <Text numberOfLines={2} style={{flex: 1, flexWrap: 'wrap'}}>
      //                           {rowData.recipe_name}
      //                         </Text>
      //                       </Row>
      //                     </TouchableOpacity> 
      //                   </View>
      //                 );
      //               }}
      //               keyExtractor={(item, index) => index.toString()}
      //               showsHorizontalScrollIndicator={false}
      //   />
      //   {divider}
      // </View>
      <View>
        <Title style={styles.subtitle}>{title}</Title>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={({ item: rowData }) => {
            return(
              <View style={{marginTop: 20, marginLeft: 20, marginRight: 20, marginBottom: 20,}}>
                <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: state.user_token}, key: 'Info'+rowData.id})}>
                <Image
                  style={styles.big_recipe_image}
                  source={{uri: rowData.imageurlsbysize_360}}
                />
                <Row style={{height: 50, width: styles.big_recipe_image.width, flexDirection:'row'}}>
                  <Text numberOfLines={2} style={{flex: 1, flexWrap: 'wrap'}}>
                    {rowData.recipe_name}
                  </Text>
                </Row>
              </TouchableOpacity> 
            </View>
            );
          }}
          sliderWidth={width}
          itemWidth={styles.big_recipe_image.width + 40}
        />
        {divider}
      </View>
  );
}

const styles = StyleSheet.create({
  small_recipe_image: {
    width: (width-40)/2-10,
    height: (width-40)/2-10,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  big_recipe_image: {
    marginBottom: 5,
    width: width-100,
    height: width-100,
    backgroundColor: 'transparent',
    borderRadius: 25,
    //alignSelf: 'center',
  },
  recipe_text: {
    marginBottom: 10,
    textAlignVertical: "center",
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
  carouselView: {
    margin: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});