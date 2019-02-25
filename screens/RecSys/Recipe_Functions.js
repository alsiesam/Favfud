import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

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

export function renderRecipes(data, horizontal, numCol, navigate, state) {
  return(
      <FlatList
                  horizontal={horizontal}
                  data={data}
                  numColumns={numCol}
                  renderItem={({ item: rowData }) => {
                    return(
                      <View style={{marginTop: 20, marginLeft: 20, marginRight: 20, marginBottom: 20,}}>
                        <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: state.user_token}, key: 'Info'+rowData.id})}>
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
  );
}

const styles = StyleSheet.create({
  recipe_image: {
    marginBottom: 5,
    width: 150,
    height: 150,
    backgroundColor: 'transparent',
    alignSelf: 'center',
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
});