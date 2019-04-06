import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback} from 'react-native';
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

const ACCESS_TOKEN = 'user_token';
const ADD_MEAL_URL  = 'https://favfud-app.herokuapp.com/api/diary/meal/create/';

export default class AddMealFormScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Add Meal',
  };

  constructor(props) {
    super(props);
    this.state = {
      servings: '',
      dishId: '',
      date: moment(),
      token:'',
    };
  }

  componentDidMount(){
    this.getToken();
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

  submitAddRequest() {
    if (this.state.token !== undefined && this.state.servings !== undefined && this.state.dishId !== undefined && this.state.date !== undefined) {
      var payload = {
        user_token: this.state.token,
        servings: this.state.servings,
        dish_ids: this.state.dishId,
        date: moment(this.state.date, "DD-MMM-YYYY").format("YYYY-MM-DD"),
        meal_type: "Others",
      };
      this.addMeal(payload, (response) => {
        console.log("Cannot Add Meal");
        console.log(response);
        this.showAlert("Error", response);
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
        this.redirectToDiary();
      } else {
        if (callback) { callback(response); }
      }
    }

  redirectToDiary(){
    this.props.navigation.navigate('Diary');
  }

  render() {
    return(
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
              <TextInput
                style={styles.textInput}
                placeholder={''}
                keyboardType = {'numeric'}
                onChangeText={(dishId) => this.setState({dishId})}
                value={this.state.dishId}
              />
          </Row>


        </Grid>
        <View style={styles.buttonContainer}>
          <Button styleName="secondary full-width" onPress={this._handleAdd}>
            <Text>Add</Text>
          </Button>
        </View>
      </View>
    );
  }

  _handleAdd = () => {
    this.submitAddRequest();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'flex-start',
  },
  grid: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 30,
    marginHorizontal: 25,
    //backgroundColor:'grey',
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
    marginBottom:20,
    borderRadius:5,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
