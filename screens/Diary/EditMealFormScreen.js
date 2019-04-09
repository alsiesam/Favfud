import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator, StatusBar, Dimensions, Platform} from 'react-native';
import {
  Text,
  Button,
  View,
  TextInput,
  Divider,
  NavigationBar,
  Title,
  Subtitle,
  Icon,
} from '@shoutem/ui';
import moment from "moment";
import { Col, Row, Grid } from "react-native-easy-grid";
import Calendar from '../../library/react-native-calendar-select';
import DatePicker from 'react-native-datepicker';
import { SearchBar, } from "react-native-elements";
import { Container, } from "native-base";

import {sendDeleteMealRequest} from './DiaryFunctions';

const ACCESS_TOKEN = 'user_token'
const ADD_MEAL_URL  = 'https://favfud-app.herokuapp.com/api/diary/meal/create/';
const SEARCH_URL = 'https://django-fyp.herokuapp.com/recsys/search_similar/';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class AddMealFormScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Edit Meal',
  };

  constructor(props) {
    var token = props.navigation.getParam('token');
    var servings = props.navigation.getParam('servings');
    var dishId = props.navigation.getParam('dishId');
    var mealId = props.navigation.getParam('mealId');
    var selectedRecipe = props.navigation.getParam('selectedRecipe');
    var date = props.navigation.getParam('date');
    super(props);
    this.state = {
      token: token,
      servings: servings,
      dishId: dishId,
      mealId: mealId,
      selectedRecipe: selectedRecipe,
      date: moment(date, "YYYY-MM-DD").format("DD-MMM-YYYY"),
      isLoading: false,
      dataSource: [],
      searchError: false,
      keyword: '',
      isSearchMode:false,
    };
  }

  async getToken() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      this.setState({token});
    } catch (err) {
      console.log('[getToken] Error')
    }
  }

  renderDatepicker() {
    return(
    <DatePicker
        style={{width: 300, marginHorizontal:10, borderColor: 'gray', borderWidth: 1,}}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="DD-MMM-YYYY"
        minDate="01-Jan-2019"
        maxDate="31-Dec-2030"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        onDateChange={(date) => {this.setState({date: date})}}
        />
      );
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }

  async submitDeleteRequest() {
    if ((this.state.token != undefined) && (this.state.mealId != undefined)) {
      this.setState({isLoading: true});
      let response = await sendDeleteMealRequest(this.state.token, this.state.mealId);
      if (response) {
        this.setState({isLoading: false});
        this.redirectToDiary();
      } else {
        this.showAlert("Error", "Cannot delete meal.");
        this.setState({isLoading: false});
      }
    } else {
      console.log("Error")
      this.setState({isLoading: false});
    }
  }

  async submitChangeRequest() {
    if(this.state.servings==''){
      this.showAlert("Error", "Please enter no. of servings.");
    } else if (this.state.dishId=='') {
      this.showAlert("Error", "Please select dish.");
    } else if (this.state.token !== undefined && this.state.mealId !== undefined) {
      this.setState({isLoading: true});
      let response = await sendDeleteMealRequest(this.state.token, this.state.mealId);
      if (response) {
        this.setState({isLoading: false});
        this.submitAddRequest();
      } else {
        this.showAlert("Error", "Cannot delete meal.");
      }
    } else {
      console.log("Error")
    }
  }

  submitAddRequest() {
     if((this.state.token != undefined) && (this.state.servings != undefined) && (this.state.dishId != undefined) && (this.state.date != undefined)) {
      dishIds = this.state.dishId.toString();
      var payload = {
        user_token: this.state.token,
        servings: this.state.servings,
        dish_ids: dishIds,
        date: moment(this.state.date, "DD-MMM-YYYY").format("YYYY-MM-DD"),
        meal_type: "Others",
      };
      this.addMeal(payload, (response) => {
        console.log("Cannot Add Meal");
        //console.log(response);
        //this.showAlert("Error", response);
        this.setState({isLoading: false, keyword: ''});
      });
    } else {
      console.log("Error");
    }
  }

  async addMeal(mealData, callback) {
      let response = await fetch(ADD_MEAL_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
      })
      let responseIsOk = await response.ok;
      if(responseIsOk) {
        let responseJson = await response.json();
        responseJson.nutrition = JSON.parse(responseJson.nutrition);
        this.setState({isLoading: false});
        this.redirectToDiary();
      } else {
        if (callback) { callback(response); }
      }
    }

  redirectToDiary(){
    this.props.navigation.navigate('Diary');
  }

  renderLoading(marginTop=20){
    return(
      <View style={{
        flex: 1,
        marginTop: marginTop,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
      }}>
        <Text>Loading...</Text>
        <ActivityIndicator/>
      </View>
    );
  }


  fetchData(keyword) {
    if(keyword.match(/\//g)) {
      keyword = keyword.replace(/\//g, '\/');
    }
		if(!keyword.match(/\/$/g)) {
      keyword = keyword + '/';
    }
		keyword = keyword.replace(/\s/g, '+');
    return fetch(SEARCH_URL+keyword)
    .then((response) => response.json())
    .then((responseJson) => {
			this.setState({
        //isLoading: false,
				searchError: false,
        dataSource: [...this.state.dataSource, ...responseJson],
        //displayData: responseJson.slice(0, span),
        //pageNum: this.state.pageNum + 1
      }, function(){
        // console.log(responseJson);
      });

    })
    .catch((error) =>{
			this.setState({
				searchError: true,
      });
      console.error(error);
    });
  }

  submitEditing = (event) => {
			if (event.nativeEvent.text == this.state.keyword) return;

      this.setState({
          keyword: event.nativeEvent.text,
          dataSource: [],
      });

      this.fetchData(event.nativeEvent.text);
  }

  renderSearchEngine() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{height:450, marginVertical:10}}>
          <SearchBar
              lightTheme
              //showLoading
              ref={search => this.search = search}
              cancelButtonTitle="Cancel"
              clearIcon={{ }}
              placeholder='Search your recipe here...'
              onSubmitEditing={this.submitEditing}
              containerStyle = {{width: 'auto', }}
          />
          <Divider />
          <ScrollView>
            {
              (this.state.searchError == true)?
                (<Text style={{marginTop: 20,marginLeft: 20,marginRight: 20,fontSize: 20,}}>There is an error, please try again.</Text>):
                this.renderSearchResultsList('Search result of '+this.state.keyword, this.state.dataSource, want_divider=true, navigate, this.state)
            }
          </ScrollView>
          {/*
          <View style={{flex:1, flexDirection:'column'}}>
            <View style={styles.smallButtonContainer}>
              <Button styleName="secondary full-width" onPress={this._handleSearch}>
                <Text>Search Dish</Text>
              </Button>
            </View>
            <View style={styles.smallButtonContainer}>
              <Button styleName="secondary full-width" onPress={this._handleSearch}>
                <Text>Search Dish</Text>
              </Button>
            </View>
          </View>
          */}
        </View>
    );
  }

  renderSearchResultsList(title, data, want_divider, navigate, state) {
  	if (!Array.isArray(data)) {
  		console.log('undefined data');
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
  			<Title>{this.state.keyword==""?"":title}</Title>
  			{data.map((recipe, ) => {
  				// console.warn(recipe);
  				//ingredients = getIngredients(recipe).slice(0, 3);
  				return (
  					<TouchableOpacity key={recipe.id} onPress={() => {
              this.setState({
                dishId:String(recipe.id),
                isSearchMode:false,
                selectedRecipe: recipe,
              });
          }}>
  					<Row>
  						<Image
  							style={[styles.small_recipe_image, {marginLeft: 10, marginRight: 10}]}
  							source={{uri: recipe.imageurlsbysize_90}}
  						/>
  							<Text numberOfLines={2} style={{fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10,}}>
  								{recipe.recipe_name}
  							</Text>
  							{/*
  								ingredients.map((ing, key) => {
  									return (
  										<Text numberOfLines={1} key={key} >
  											{ing}
  										</Text>
  									);
  								})
  							*/}
  					</Row>
  					{divider}
  					</TouchableOpacity>
  				);
  			})}
  		</View>
  	);
  }

  renderSelectedDish(recipe=this.state.selectedRecipe){
    return(
      <Row>
        <Image
          style={[styles.small_recipe_image, {marginLeft: 10, marginRight: 10}]}
          source={{uri: recipe.imageurlsbysize_90}}
        />
        <Text numberOfLines={2} style={{fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10,}}>
          {recipe.recipe_name}
        </Text>
      </Row>
    );
  }

  renderSearchButton(){
    return(
      <View style={styles.smallButtonContainer}>
        <Button styleName="secondary full-width" onPress={this._handleSearch}>
          <Text>{this.state.dishId == ''?"Search Dish":"Change Dish"}</Text>
        </Button>
      </View>
    );
  }

  renderSearchEngineButtons(){
    return(
        <View style={styles.buttonContainer}>
          <Button styleName="secondary full-width" onPress={this._handleCancelSearch}>
            <Text>Cancel</Text>
          </Button>
        </View>
    );
  }

  render() {
    if(this.state.isLoading) {
      return(
        <View>
          {this.renderLoading(50)}
        </View>
      );
    } else if(this.state.isSearchMode){
      return(
        <Container style={styles.screen_container}>
          {this.renderSearchEngine()}
          {this.renderSearchEngineButtons()}
        </Container>
      );
    } else {
      return(
        <DismissKeyboard>
          <View style={styles.container}>
            <Grid style={styles.grid}>
              <Row style={styles.rowInput}>
                <Subtitle>Date: </Subtitle>
                {this.renderDatepicker()}
              </Row>

              <Row style={styles.rowInput}>
                <Subtitle>No. of Servings: </Subtitle>
                  <TextInput
                    style={styles.textInput}
                    placeholder={''}
                    keyboardType = {'numeric'}
                    onChangeText={(servings) => this.setState({servings})}
                    value={this.state.servings}
                  />
              </Row>

              <Row style={styles.rowInput}>
                <Subtitle>Dish: </Subtitle>
                  {/*
                  <TextInput
                    style={styles.textInput}
                    placeholder={''}
                    keyboardType = {'numeric'}
                    onChangeText={(dishId) => this.setState({dishId})}
                    value={this.state.dishId}
                  />
                  */}
              </Row>
              <Row>
                {this.state.dishId != ''?this.renderSelectedDish():<View />}
              </Row>
            </Grid>
            {
              this.renderSearchButton()
            }
            <View style={styles.buttonContainer}>
              <Button styleName="secondary full-width" onPress={this._handleDelete}>
                <Text>Delete Meal</Text>
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button styleName="secondary full-width" onPress={this._handleChange}>
                <Text>Change Meal</Text>
              </Button>
            </View>
          </View>
        </DismissKeyboard>
      );
    }
  }

  _handleDelete = () => {
    this.submitDeleteRequest();
  };

  _handleChange = () => {
    this.submitChangeRequest();
  };

  _handleSearch = () => {
    this.setState({isSearchMode:true});
  };

  _handleCancelSearch = () => {
    this.setState({isSearchMode:false});
  };

  _handleAddDish = () => {
    this.setState({isSearchMode:false});
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  grid: {
    //flex: 1,
    justifyContent: 'flex-start',
    marginTop: 30,
    marginHorizontal: 25,
    //backgroundColor:'grey',
    marginBottom:20,
    height:500,
  },
  rowInput: {
    height: 'auto',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    //justifyContent: 'flex-start',
    //backgroundColor:'grey',
  },
  textInput:{
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    height: 40,
    marginTop:10,
    marginBottom:5,
    marginHorizontal:10,
    width:300,
  },
  buttonContainer: {
    // flex:1,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop:10,
    marginBottom:10,
    borderRadius:5,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  smallButtonContainer: {
    // flex:1,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop:20,
    marginBottom:20,
    borderRadius:5,
    marginHorizontal: 100,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  searchEngineButtonContainer: {
    // flex:1,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop:10,
    marginBottom:20,
    marginHorizontal:0,
    borderRadius:5,
    width:150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen_container: {
      flex: 1,
      marginHorizontal: 25,
    },
  small_recipe_image: {
    width: (SCREEN_WIDTH-50)/3-20,
    height: (SCREEN_WIDTH-50)/3-20,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
});
