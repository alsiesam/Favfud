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

import {fetchMealRecordByToken, updateMealRecords, generateMealRecipes, generateReportInfo, getDiarySummaryWithReportInfo} from './DiaryFunctions'

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
    var today = new Date;
    var startDate = moment(today).subtract(6, 'days');
    this.state = {
      email:'',
      token:'',
      startDate: startDate,
      endDate: moment(today),
      mealRecords:{}, //Key: YYYY-MM-DD; Value
      /*mealList: [{}],*/
      mealRecipes: {},
      isLoading: false,
      refreshing: false,
      reportInfo: {
        numOfDays: 0,
        numOfMeals: 0,
        energy: 0,
        fat: 0,
        carb: 0,
        protein: 0,
      },
    };
  }

  refresh(){
    console.log("Refresh");;
    if(!this.state.isLoading) {
      this.setState({
        isLoading: true,
        mealRecords: {},
        mealRecipes: {},
      });
      if(this.state.token && this.state.token != ''){
        this.setup(this.state.token);
      } else {
        this.setState({isLoading: false,});
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
      //console.log("My token is: "+user_token);
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
    this.setState({
      startDate: moment(startDate),
      endDate: moment(endDate),
    });
    this.refresh();
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  async setup(token){
    try {
      let responseJson = await fetchMealRecordByToken(token);
      let mealRecords = updateMealRecords(responseJson, this.state.mealRecords);
      this.setState({mealRecords: mealRecords});

      console.log("Processing Meal");
      let mealRecipes = await generateMealRecipes(this.state.mealRecords);
      this.setState({mealRecipes: mealRecipes});
      console.log("Process Meal Finished");

      let reportInfo = generateReportInfo(this.state.mealRecords, this.state.mealRecipes, this.state.startDate, this.state.endDate);
      this.setState({reportInfo: reportInfo});
      console.log(this.state.reportInfo);

      let summary = getDiarySummaryWithReportInfo(this.state.reportInfo);
      this.setState({summary: summary});
      console.log(this.state.summary);

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

  redirectToReport(){
    this.props.navigation.navigate('DiaryReport', {
      reportInfo: this.state.reportInfo,
    });
  }

  renderMealListContainer(){
    return(
      <View style={styles.mealsContainer}>
        <Title>Meal List</Title>
        {this.state.isLoading?
          this.renderLoading() :
          /*this.state.mealRecipes.map((key, item) => (
            <Grid>
              {this.inRange(key) ? this.renderRecipeList(key, item): <View></View>}
            </Grid>
          ))*/
          Object.keys(this.state.mealRecipes).sort().reverse().map((date, i) => (
            <Grid key={i}>
              {this.inRange(date) ? this.renderRecipeList(date, this.state.mealRecipes[date]): <View></View>}
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
              return(
                <View style={{marginTop: 20, marginRight: 30,}}>
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
            contentContainerStyle={{marginLeft: 20, }}
          />
      </Grid>
    );
  }

  renderLoading(){
    return(
      <View style={{
        flex: 1,
        marginTop: 20,
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
    console.log(this.state.summary.text);
    if(this.state.summary != {}){
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
    } else {
      return this.renderLoading();
    }
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
        /*
        leftComponent={
          <Button onPress={this._handleRefresh}>
            <Subtitle>Refresh</Subtitle>
          </Button>
        }
        */
        centerComponent={
          <Button onPress={this.openCalendar}>
            <Subtitle>{moment(this.state.startDate).format("D MMM")} to {moment(this.state.endDate).format("D MMM")}</Subtitle>
          </Button>
          }
        rightComponent={(
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
            <View style={styles.reportContainer}>
              <View style={styles.shortReportContainer}>
                <Title>Report</Title>
                {/*
                  this.state.reportInfo.numOfDays==0 ? <View />: this.renderShortReport()
                  */}
                {this.state.summary==undefined ? this.renderLoading(): this.renderShortReport()}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this._handleReport}
                  styleName="secondary full-width">
                    <Text>View Full Report</Text>
                </Button>
              </View>
            </View>
            <Divider styleName="line" />
            {this.renderMealListContainer()}
          </ScrollView>
      </View>
    );
  }

  _handleAdd = () => {
    this.redirectToAddMealForm();
  };

  _handleRefresh = () => {
    this.refresh();
  };

  _handleReport = () => {
    this.redirectToReport();
  };

  _changeDatePeriod = () => {
    this.setState({startDate: "18-Feb", endDate: "24-Feb"});
    this.showAlert('Setting Date Period', 'Date period set.');
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
