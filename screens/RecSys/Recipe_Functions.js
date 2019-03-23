import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, AsyncStorage, Dimensions} from 'react-native';
import { Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel from 'react-native-snap-carousel';
import { Title, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE = 'bookmarked_recipe';
const ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS = 'recipe_ratings';
const API_HOST = 'http://django-fyp.herokuapp.com/';
const EQUIRE_BOOKMARKED_URL = `${API_HOST}recsys/interaction/enquire/bookmark/`;
const EQUIRE_RATED_URL = `${API_HOST}recsys/interaction/enquire/rating/`;

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
    fetch(EQUIRE_BOOKMARKED_URL, {
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
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE, JSON.stringify(arr));
      } else {
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE, JSON.stringify([]));
      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }

export function fetchRatedRecipes(user_token) {
    fetch(EQUIRE_RATED_URL, {
      headers: new Headers ({
        usertoken: user_token,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS, JSON.stringify(responseJson));
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
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
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
          sliderWidth={SCREEN_WIDTH}
          itemWidth={styles.big_recipe_image.width + 40}
        />
        {divider}
      </View>
  );
}

export function renderSearchResultsList(title, data, want_divider, navigate, state) {
	if (!Array.isArray(data)) {
		console.log('undefined data');
		return;
	}
	if(data.length == 0){
		console.log('data has no length');
    return;
  }
	// console.log(data);
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
	rows = [];
	return (
		<View>
			<Title style={styles.subtitle}>{title}</Title>
			{data.map((recipe, ) => {
				// console.warn(recipe);
				ingredients = getIngredients(recipe).slice(0, 3);
				return (
					<TouchableOpacity key={recipe.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: recipe, /*user_token: state.user_token*/}, key: 'Info'+recipe.id})}>
					<Row style={styles.listView}>
						<Image
							style={[styles.small_recipe_image, {marginLeft: 10, marginRight: 10}]}
							source={{uri: recipe.imageurlsbysize_90}}
						/>
						<Col>
							<Text numberOfLines={2} style={{fontSize: 14, fontWeight: 'bold', marginBottom: 10,}}>
								{recipe.recipe_name}
							</Text>
							{
								ingredients.map((ing, key) => {
									return (
										<Text numberOfLines={1} key={key} >
											{ing}
										</Text>
									);
								})
							}
						</Col>
					</Row>
					{divider}
					</TouchableOpacity>
				);
			})}
		</View>
	);

}

const styles = StyleSheet.create({
  small_recipe_image: {
    width: (SCREEN_WIDTH-40)/2-10,
    height: (SCREEN_WIDTH-40)/2-10,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  big_recipe_image: {
    marginBottom: 5,
    width: SCREEN_WIDTH-100,
    height: SCREEN_WIDTH-100,
    backgroundColor: 'transparent',
    borderRadius: 25,
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
	listView: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12,
	},
});
