import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity} from 'react-native';
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

const ACCESS_TOKEN = 'access_token';
const EMAIL_ADDRESS = 'email_address';

const API_HOST = 'http://django-fyp.herokuapp.com/';
const RECIPES_URL = `${API_HOST}recsys/recommendation/popular/`;
const RETRIEVE_MEAL_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/diary/meal/?user=';


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
      endDate: today,
      meals:[{}],
      /*mealList: [{}],*/
    };
  }


  componentDidMount(){
    this.getTokenAndEmail();
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.fetchRecipes();
  }

  async getTokenAndEmail() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      this.setState({token});
      this.setState({email});
    } catch (err) {
      console.log('[getToken] Error');
    }
  }

  confirmDate({startDate, endDate, startMoment, endMoment}) {
    this.setState({
      startDate,
      endDate
    });
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  fetchRecipes() {
    return fetch(RECIPES_URL)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        meals: [
          {
            date: moment("2019-03-26"),
            list: responseJson.slice(0,2),
          },
          {
            date: moment("2019-03-23"),
            list: responseJson.slice(2,4),
          },
          {
            date: moment("2019-03-17"),
            list: responseJson.slice(4,6),
          },
          {
            date: moment("2019-03-13"),
            list: responseJson.slice(6,7),
          }
        ]
      });
      console.log(this.state.meals);
    })
    .catch((error) =>{
      console.error(error);
    });
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

  redirectToAddMealForm(){
    this.props.navigation.navigate('AddMealForm');
  }

  redirectToReport(){
    this.props.navigation.navigate('DiaryReport');
  }
  renderMeals(){
    return(
      <View style={styles.mealsContainer}>
        <Title>Meal List</Title>
        {/*this.renderRecipeList(this.state.meals[0].date, this.state.meals[0].list)*/}
        {/*this.renderRecipeList(this.state.meals[1].date, this.state.meals[1].list)*/}
        {/*this.displayTest("hi1234")*/}
        {this.state.meals.map(item => (
          <Grid>
            {this.inRange(item.date) ? this.renderRecipeList(item.date, item.list): <View></View>}
          </Grid>
        ))}
      </View>
    );

  }

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

  render() {
    return (
      <View style={styles.container}>
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
          leftComponent={(
            <Button onPress={this.openCalendar}>
              <Icon name="events" />
            </Button>
          )}
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

          <ScrollView style={styles.scrollContainer}>
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
            <View style={styles.reportContainer}>
              <View style={styles.shortReportContainer}>
                <Title>Report</Title>
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
            {this.renderMeals()}
          </ScrollView>

        {/*<View style={styles.refreshContainer}>
          <View style={styles.buttonContainer}>
            <Button
              styleName="secondary full-width"
              onPress={this._handleRefresh}>
                <Text>Refresh</Text>
            </Button>
          </View>
        </View>*/}
      </View>
    );
  }

  _handleAdd = () => {
    this.redirectToAddMealForm();
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
  }
});
