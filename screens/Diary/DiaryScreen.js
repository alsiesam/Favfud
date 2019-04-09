import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
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
import { StyleProvider } from '@shoutem/theme';
import moment from "moment";
import Calendar from '../../library/react-native-calendar-select';
import { Col, Row, Grid } from "react-native-easy-grid";
import AnimatedBar from "react-native-animated-bar";

import {fetchMealRecordByToken, updateMealRecords, generateMealRecipes, getDiaryReport, fetchRecipesWithNutrition} from './DiaryFunctions'

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';
const ASYNC_STORAGE_KEYS = ['user_token', 'email_address'];

const API_HOST = 'http://django-fyp.herokuapp.com/';
const RECIPES_URL = `${API_HOST}recsys/recommendation/popular/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;
const GET_MEAL_URL = 'https://favfud-app.herokuapp.com/api/diary/meal?user=';


export default class DiaryScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary',
  };

  constructor(props) {
    super(props);
    var refresh = props.navigation.getParam('refresh');
    var today = new Date;
    var endDate = moment(today).subtract(1, 'days');
    var startDate = moment(today).subtract(7, 'days');
    this.state = {
      email:'',
      token:'',
      startDate: startDate,
      endDate: endDate,
      mealRecords:{}, //Key: YYYY-MM-DD; Value
      /*mealList: [{}],*/
      mealRecipes: {},
      reccomendations: {},
      isLoading: false,
      isReportLoading: false,
      refreshing: false,
      isEmpty: true,
      isEditMode: false,
    };
  }
  clearState() {
    this.setState({
      isLoading: false,
      isReportLoading: false,
      mealRecords: {},
      mealRecipes: {},
      reccomendations: {},
      summary:{},
      nutritionPercentage:{},
      nutritionValue:{},
      isEmpty: true,
    });
  }
  refresh(token=this.state.token, startDate=this.state.startDate, endDate=this.state.endDate){
    if(!this.state.isLoading) {
      this.clearState();
      this.setState({isReportLoading: true, isLoading: true});
      if(this.state.token && this.state.token != ''){
        this.setup(this.state.token, startDate, endDate);
      } else {
        this.setState({isReportLoading: false, isLoading: false});
      }
    }
  }

  componentDidMount(){
    this.getTokenAndEmail();
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  getTokenAndEmail() {
    AsyncStorage.multiGet(ASYNC_STORAGE_KEYS).then((response) => {
      var user_token = response[0][1];
      if(user_token){
        this.setState({token: user_token});
        this.setup(user_token);
      }
    })
    .catch((error) =>{
      console.log("getTokenAndEmail");
      console.error(error);
    }).done();
  }

  confirmDate({startDate, endDate, startMoment, endMoment}) {
    startDate=moment(startDate);
    endDate=moment(endDate);
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
    this.refresh(this.state.token, startDate, endDate);
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  async setup(token, startDate=this.state.startDate, endDate=this.state.endDate){
    this.setState({isReportLoading: true, isLoading: true});
    try {
      //let results = await Promise.all([sleep(1), sleep(2)]);
      actions = [];
      actions.push(fetchMealRecordByToken(token, startDate, endDate));
      actions.push(getDiaryReport(token, startDate, endDate));
      let results = await Promise.all(actions);
      if(results[0] && results [1]) {
        //console.log(results[0]);

        let responseJson = results[0];
        let reportData = results[1];
        let mealRecords = updateMealRecords(responseJson, this.state.mealRecords);
        this.setState({
          mealRecords: mealRecords,
          summary: reportData.summary,
          nutritionPercentage: reportData.nutrition_percentage,
          nutritionValue: reportData.nutrition,
          isReportLoading: false,
          isEmpty: false,
        });
      } else {
        this.clearState();
        return false;
      }
    } catch(err) {
      console.log(err);
      this.setState({isReportLoading: false});
      this.setState({isLoading: false});
    } try {
      actions = [];
      actions.push(generateMealRecipes(this.state.mealRecords));
      actions.push(fetchRecipesWithNutrition(this.state.summary));
      //let mealRecipes = await generateMealRecipes(this.state.mealRecords);
      let results = await Promise.all(actions);
      if(results[0]) {
        let mealRecipes = results[0];
        this.setState({
          mealRecipes: mealRecipes,
        });
      } else {
        this.clearState();
        return false;
      }
      if (results[1] && Object.keys(results[1]).length>0) {
        let recommendations = results[1];
        this.setState({
          recommendations: recommendations,
        });
      }
      this.setState({isLoading: false});
    } catch(err) {
      console.log(err);
      this.setState({isLoading: false});
    }
  }

  inRange(date){
      if(moment(date).isBefore(this.state.startDate)){
        return false;
      } else if (moment(date).isAfter(this.state.endDate)) {
        return false;
      } else {
        return true;
      }
    }
  /*
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
  */
  redirectToAddMealForm(){
    this.props.navigation.navigate('AddMealForm');
  }

  redirectToEditMealForm(){
    this.props.navigation.navigate('EditMealForm');
  }

  redirectToReport(){
    this.props.navigation.navigate('DiaryReport', {
      token: this.state.token,
      summary: this.state.summary,
      nutritionPercentage: this.state.nutritionPercentage,
      nutritionValue: this.state.nutritionValue,
      recommendations: this.state.recommendations,
    });
  }

  renderMealListContainer(){
    return(
      <View style={styles.mealsContainer}>
        <Title>Meal List</Title>
        <Text>{this.state.isEditMode?"Tap on the meal to edit":""}</Text>
        {this.state.isLoading?
          this.renderLoading(100) :
          /*this.state.mealRecipes.map((key, item) => (
            <Grid>
              {this.inRange(key) ? this.renderRecipeList(key, item): <View></View>}
            </Grid>
          ))*/
          Object.keys(this.state.mealRecipes).sort().reverse().map((date, i) => (
            <Grid key={i}>
              {this.renderRecipeList(date, this.state.mealRecipes[date])}
            </Grid>
          ))
        }
      </View>
    );
  }
/*
  renderMealList(){
    this.state.mealRecipes.map((key, item) => (
      <Grid>
        {this.inRange(key) ? this.renderRecipeList(key, item): <View></View>}
      </Grid>
    ))


    let dates = Object.keys(this.state.mealRecipes);
    dates.sort().reverse();
    for (var i=0; i<dates.length; i++) {
      let date = dates[i];
      if(this.inRange(date)) {
        this.renderRecipeList(date, this.state.mealRecords[0][date]);
      }
    }
  }
*/
  renderRecipeList(date, recipeList) {
    const {navigate} = this.props.navigation;
    return(
      <Grid style={styles.mealGrid}>
          <Row style={{height: 'auto', backgroundColor: '#e6e6e6',}}>
              <Text>
                  {moment(date).format("D MMM YYYY")}
              </Text>
          </Row>
          <FlatList
            horizontal={true}
            data={recipeList}
            numColumns={1}
            renderItem={({ item: rowData, index }) => {
              let _handleNavigate = () => navigate({
                routeName: 'Diary_Recipe_Information', params: {recipe: rowData, user_token: this.state.token}, key: 'Info'+rowData.id
              });
              let _handleEditMeal = () => navigate({
                routeName: 'EditMealForm', params: {selectedRecipe: rowData, token: this.state.token, dishId: rowData.id, mealId: rowData.meal_id, servings: rowData.consume_servings, date: rowData.consume_date}
              });
              return(
                <View style={{marginTop: 20, marginRight: 30,}}>
                  <TouchableOpacity key={rowData.id} onPress={this.state.isEditMode?_handleEditMeal:_handleNavigate}>
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

  renderShortReport(){
    var statusText = "Healthy";
    if((this.state.summary) && (Object.keys(this.state.summary).length >3) && (this.state.isReportLoading == false)){
      var score_1 = (this.state.summary.more.length + this.state.summary.less.length)*0.6;
      var score_2 = (this.state.summary.slightlyMore.length + this.state.summary.slightlyLess.length)*0.8;
      var score_3 = (this.state.summary.noChange.length);
      var score = (score_1 + score_2 + score_3)/4;
      var color = "#05FF84";
      if (score<=0.7){
        color = "#FF2C07";
        statusText = "Unhealthy";
      } else if (score<=0.95) {
        color = "#FF8506";
        statusText = "Caution";
      }
      return(
        <View style={styles.grid}>

          <Row style={styles.row}>
            <AnimatedBar
                progress={score}
                height={40}
                borderColor={"#DDD"}
                fillColor={"#EEE"}
                barColor={color}
                borderRadius={5}
                borderWidth={5}
                duration={3000}
                style={{justifyContent:'center',alignItems:'center', flexDirection: 'row'}}
              >
              <Text style={styles.barText}>
                {statusText}
              </Text>
            </AnimatedBar>
          </Row>
          <Text styleName="multiline" style={{height: 55, marginTop: 15}}>{this.state.summary.text}</Text>
        </View>
      );
    } else if (this.state.isReportLoading == true) {
      return this.renderLoading();
    } else {
      return (<View></View>);
    }
  }

  renderReportButton() {
    return(
      <Button
        onPress={this._handleReport}
        styleName="secondary full-width">
          <Text>View Full Report</Text>
      </Button>
    );
  }

  renderNavigationBar() {
    return(
      <NavigationBar
        styleName="inline"
        style={{
          container: {
            height: 40,
            paddingVertical: 0,
          },
          componentsContainer:{
            //backgroundColor: 'grey',
            paddingHorizontal: 5,
            paddingVertical: 0,
            flex: 1,
          },
          leftComponent:{
            //backgroundColor: 'grey',
            flex: 2,
          },
          centerComponent:{
            width: 'auto',
            paddingHorizontal: 0,
            paddingVertical: 0,
            //backgroundColor: 'grey',
            flex: 5,
          },
          rightComponent:{
            flex: 2,
            //width: 'auto',
            //paddingHorizontal: 0,
            //backgroundColor: 'grey',
          }
        }}
        leftComponent={
          <Button onPress={this.state.isEditMode?this._handleCancelEdit:this._handleEdit}>
            <Subtitle>{this.state.isEditMode?"Cancel":"Edit Meal"}</Subtitle>
          </Button>
        }
        centerComponent={
          <Button onPress={this.openCalendar}>
            <Subtitle>{moment(this.state.startDate).format("D MMM")} to {moment(this.state.endDate).format("D MMM")}</Subtitle>
          </Button>
          }
        rightComponent={this.state.isEditMode?<View />:(
          <Button onPress={this._handleAdd}>
            <Subtitle>Add Meal</Subtitle>
          </Button>
        )}>
      </NavigationBar>
    );
  }

  renderCalendar(){
    return (
      <Calendar
        i18n="en"
        ref={(calendar) => {this.calendar = calendar;}}
        color={{mainColor: '#ffffff', subColor: '#404040', borderColor: '#d9d9d9'}}
        format="YYYYMMDD"
        minDate="20190101"
        maxDate="20301231"
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onConfirm={this.confirmDate}
      />
    );
  }

  renderReportContainer(){
    return(
      <View style={styles.reportContainer}>
        <View style={styles.shortReportContainer}>
          <Title>Report</Title>
          {this.state.summary==undefined ? this.renderLoading(): this.renderShortReport()}
        </View>
        <View style={styles.buttonContainer}>
        {this.state.isEmpty? <View></View>: this.renderReportButton()}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderCalendar()}
          <ScrollView style={styles.scrollContainer}
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
          />}>
            {this.state.isEditMode?<View />:this.renderReportContainer()}
            {this.state.isEditMode?<View />:<Divider styleName="line" />}
            {this.renderMealListContainer()}
          </ScrollView>
      </View>
    );
  }

  _handleAdd = () => {
    this.redirectToAddMealForm();
  };

  _handleEdit = () => {
    this.setState({isEditMode: true});
  };

  _handleCancelEdit = () => {
    this.setState({isEditMode: false});
  };

  _handleRefresh = () => {
    this.refresh();
  };

  _handleReport = () => {
    this.redirectToReport();
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBarArea: {
      height: 50,
  },
  scrollContainer:{
    flex: 1,
    marginHorizontal: 15,
  },
  reportContainer: {
    height: 200,
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    //backgroundColor: '#ffffb3',
    justifyContent : 'space-between',
    alignItems: 'center',
  },
  shortReportContainer: {
    justifyContent : 'space-around',
    alignItems: 'center',
  },
  mealsContainer: {
    height: 'auto',
    marginTop: 5,
    marginBottom: 20,
    paddingTop: 5,
    //backgroundColor: '#b3e6ff',
    alignItems: 'center',
  },
  refreshContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    height: 50,
    width: 300,
    paddingBottom: 10,
  },
  recipe_image: {
    marginBottom: 5,
    width: 180,
    height: 180,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 25,
  },
  mealGrid: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'column',
    height: 30,
    marginTop: 5,
    width: 300,
    justifyContent:'center',
    alignItems:'center',
    //marginBottom: 5,
  },
  grid: {
    margin: 5,
    height: 'auto',
  },
  barText: {
    backgroundColor: "transparent",
    color: "#FFF",
    fontSize: 22,
    width:160,
    marginLeft:100,
    justifyContent:'center',
    alignItems:'center',
  },
});
