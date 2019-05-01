import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, AsyncStorage, Dimensions, ImageBackground } from 'react-native';
import { Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Placeholder from 'rn-placeholder';
import { Title, Text } from '@shoutem/ui';
import color from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS_FOR_BOOKMARKED_RECIPE = 'bookmarked_recipe';
const ASYNC_STORAGE_KEYS_FOR_RECIPE_RATINGS = 'recipe_ratings';
const API_HOST = 'http://django-fyp.herokuapp.com/';
const EQUIRE_BOOKMARKED_URL = `${API_HOST}recsys/interaction/enquire/bookmark/`;
const EQUIRE_RATED_URL = `${API_HOST}recsys/interaction/enquire/rating/`;

export function getTime() {
  time = '';
  var d = new Date();
  var n = d.getHours();
  var greet = 'Hi';
  if(n >= 6 && n < 12) {
    time = 'morning';
  } else if(n >= 12 && n < 18) {
    time = 'afternoon';
  } else {
    time = 'night';
  }
  return time;
}

export function secondsToHms(d) {
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

function renderPlaceholder(divider, num_placeholder, view_height = SCREEN_HEIGHT * 0.42, placeholder_size = view_height * 0.5) {
  view_padding = 20;
  place_margin_bottom = 20;
  if(!num_placeholder || num_placeholder == undefined){
    num_placeholder = Math.floor(view_height / placeholder_size);
    view_height = view_height + view_padding * 2 + place_margin_bottom * (num_placeholder-1);
  } else {
    view_height = placeholder_size * num_placeholder + view_padding * 2 + place_margin_bottom * (num_placeholder-1);
  }
  return(
    <View>
      <View style={{flex: num_placeholder, 
        padding: view_padding, width: SCREEN_WIDTH,
        height: view_height, }}>
        {
          [...Array(num_placeholder).keys()].map(index => {
            return(
              <View key={'placeholder'+index} style={{marginBottom: index == num_placeholder-1 ? 0 : place_margin_bottom}}>
                <Placeholder.ImageContent
                    size={placeholder_size}
                    animate="fade"
                    lineNumber={4}
                    lineSpacing={5}
                    lastLineWidth="30%"
                    color="gray"
                >
                </Placeholder.ImageContent>
              </View>
            );
          })
        }
      </View>
      { divider }
    </View>
  );
}

export function renderHealthyChoice(title, want_divider, navigate, this_obj) {
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
  state = this_obj.state;
  if(state.hbsExist == undefined || state.dsExist == undefined) {
    return renderPlaceholder(divider, 1);
  }
  let layout = [
    {
      navigateScreen: 'Recipe_Healthy_Body_Selections',
      sourceImg: require('../../assets/images/healthy.jpeg'),
      bgColor: color.themeColor.hbs.theme,
      textContent: ['Healthy Body', 'Selections'],
      textColor: color.themeColor.hbs.text,
    },
    {
      navigateScreen: 'Recipe_Diary_Selections',
      sourceImg: require('../../assets/images/diary.jpg'),
      bgColor: color.themeColor.ds.theme,
      textContent: ['Diary','Selections'],
      textColor: color.themeColor.ds.text,
    },
  ];
  if(state.hbsExist == 0){
    layout = layout.filter(l => l.navigateScreen != 'Recipe_Healthy_Body_Selections');
  }
  if(state.dsExist == 0){
    layout = layout.filter(l => l.navigateScreen != 'Recipe_Diary_Selections');
  }
  if(layout.length == 0){
    return;
  }
  return(
      <View>
        <Title style={styles.subtitle}>{title}</Title>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={layout}
          renderItem={({ item: layoutObj }) => {
            return(
              <View>
                <View style={[{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20, marginBottom: layout.length > 1 ? 0 : 20,}]}>
                  <TouchableOpacity 
                      onPress={() => navigate({routeName: layoutObj.navigateScreen, params: {user_token: state.user_token}})}
                  >
                    <ImageBackground
                    source={layoutObj.sourceImg}
                    style={[{width: SCREEN_WIDTH * 0.8, height: 200, marginBottom: 10, backgroundColor: layoutObj.bgColor, borderRadius: 15,}, styles.center]}
                    imageStyle={[{opacity: 0.2, borderRadius: 15,}]}
                    >
                    { 
                      layoutObj.textContent.map((text, index) => {
                        return(
                          <Title key={'bannerText'+index} style={{color: layoutObj.textColor, }}>{text}</Title>
                        );
                      })
                    }
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          onSnapToItem={(index) => this_obj.setState({ activeSlide1: index })}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
        />
        <Pagination
            dotsLength={layout.length}
            dotColor={color.themeColor.recsys.text[getTime()]}
            inactiveDotColor={color.themeColor.recsys.text[getTime()]}
            activeDotIndex={ this_obj.state.activeSlide1 }
        />
        {divider}
    </View>
  );
}

export function renderMainMenuRecipesInComplexCarousel(title, data, want_divider, navigate, this_obj){
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
  if(!data){
    return renderPlaceholder(divider);
  } 
  else if(Object.keys(data[0]).length == 0){
    return;
  }
  renderGrid = (rowData, numRow, numCol) => {
    let render = [];
    let remainRow = numRow;
    for(var i = 0; i < numRow*numCol; i += numCol){
      tmp = []
      for(var j = i; j < i+numCol; j += 1){
        tmp.push(j);
      }
      render.push(<Row key={i}>{
        tmp.map((index) => {
          return(
            <View key={index} style={{margin: styles.small_recipe_image.width*0.05, marginBottom: remainRow == 1 ? 0 : styles.small_recipe_image.width*0.05,}}>
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
      remainRow -= 1;
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
                <View style={{flexDirection:'row', height: 50, alignItems: 'center'}}>
                  <Text numberOfLines={2} style={styles.yrfav_reason}>Since you like {rowData.reason_recipe_name}</Text>
                </View>
                <Grid>
                  {renderGrid(rowData,2,2)}
                </Grid>
              </View>
            );
          }}
          onSnapToItem={(index) => this_obj.setState({ activeSlide2: index })}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
        />
        <Pagination
          dotsLength={data.length}
          dotColor={color.themeColor.recsys.text[getTime()]}
          inactiveDotColor={color.themeColor.recsys.text[getTime()]}
          activeDotIndex={ this_obj.state.activeSlide2 }
        />
        {divider}
    </View>
  );
}

export function renderMainMenuRecipesInSimpleCarousel(title, data, want_divider, navigate, this_obj, num) {
  divider = null;
  if(want_divider){
    divider = <Divider style={{ marginBottom: 10, }} />
  }
  if(!data){
    return renderPlaceholder(divider);
  } 
  else if(Object.keys(data[0]).length == 0){
    return renderPlaceholder(divider);
  }
  return(
      <View>
        <Title style={styles.subtitle}>{title}</Title>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={({ item: rowData }) => {
            return(
              <View style={{margin: 40, marginLeft: 10, marginBottom: 0,}}>
                <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: state.user_token}, key: 'Info'+rowData.id})}>
                <Image
                  style={styles.big_recipe_image}
                  source={{uri: rowData.imageurlsbysize_360}}
                />
                <Row style={{height: 30, width: styles.big_recipe_image.width, flexDirection:'row', alignItems: 'center',}}>
                  <Text numberOfLines={2} style={styles.recipe_name}>
                    {rowData.recipe_name}
                  </Text>
                </Row>
              </TouchableOpacity>
            </View>
            );
          }}
          onSnapToItem={(index) => this_obj.setState({ [`activeSlide${num}`]: index })}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH*0.7 + 20} // adjust marginLeft in the View
        />
        <Pagination
          dotsLength={data.length}
          dotColor={color.themeColor.recsys.text[getTime()]}
          inactiveDotColor={color.themeColor.recsys.text[getTime()]}
          activeDotIndex={ this_obj.state[`activeSlide${num}`] }
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
  if(!state.isSearched){
    return;
  }
	if(data.length == 0){
    return(
      <Title style={styles.subtitle}>No search result.</Title>
    );
  }
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
					<TouchableOpacity key={recipe.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: recipe, user_token: state.user_token}, key: 'Info'+recipe.id})}>
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
  recsys_text: {
    color: color.themeColor.recsys.text[getTime()],
  },
  small_recipe_image: {
    width: SCREEN_WIDTH*0.42,
    height: SCREEN_WIDTH*0.42,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  big_recipe_image: {
    marginBottom: 5,
    width: SCREEN_WIDTH*0.7,
    height: SCREEN_WIDTH*0.7,
    backgroundColor: 'transparent',
    borderRadius: 25,
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
    color: color.themeColor.recsys.text[getTime()],
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
  yrfav_reason:{
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: 10,
    color: color.themeColor.recsys.text[getTime()],
  },
  recipe_name: {
    flex: 1,
    flexWrap: 'wrap',
    color: color.themeColor.recsys.text[getTime()],
  },
});
