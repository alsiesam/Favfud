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
import moment from "moment";
import { Col, Row, Grid } from "react-native-easy-grid";
import Calendar from '../../library/react-native-calendar-select';

const MEAL_REQUEST_URL = 'http://127.0.0.1:8000/api/diary/meals/';

export default class AddMealFormScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Add Meal',
  };

  constructor(props) {
    super(props);
    var today = new Date;
    /*this.state = {

    };*/
  }

  submitAddRequest() {
    if (this.state.userToken !== undefined && this.state.servings !== undefined && this.state.dishId !== undefined && this.state.date !== undefined) {
      this.addMeal({
        user_token: this.state.userToken,
        servings: this.state.servings,
        dish_id: this.state.dishId,
        date: this.state.date,
      }, (response) => {
        console.log("Cannot Add Meal");
        console.log(response);
      });
    }
  }

  addMeal(meal, callback) {
      fetch(MEAL_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meal)
      }).then((response) => {
        return response.json();
      }).then((response) => {
        console.log(response);
        if (response) {
          console.log(response);
          this.redirectToDiary();
        } else {
          if (callback) { callback(response); }
        }
      }).done();
    }

  redirectToDiary(){
    this.props.navigation.navigate('Diary');
  }

  render() {
    return(
      <View style={styles.container}>
        <Grid style={styles.grid}>
          <Row style={styles.rowLabel}><Subtitle>Date: </Subtitle></Row>
          <Row style={styles.rowInput}>
            {/*<Button onPress={this.openCalendar}>
              <Text>{moment(this.state.startDate).format("D MMM")} to {moment(this.state.endDate).format("D MMM")}</Text>
            </Button>*/}
          </Row>

          <Row style={styles.rowLabel}><Subtitle>No. of Servings: </Subtitle></Row>
          <Row style={styles.rowInput}></Row>

          <Row style={styles.rowLabel}><Subtitle>Dish: </Subtitle></Row>
          <Row style={styles.rowInput}></Row>
        </Grid>
      </View>
    );
  }
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
  rowLabel: {
    height: 30,
    marginTop: 10,
    marginBottom: 10,
    //justifyContent: 'flex-start',
    //backgroundColor:'grey',
  },
  rowInput: {
    height: 60,
    marginTop: 10,
    marginBottom: 10,
    //justifyContent: 'flex-start',
    //backgroundColor:'#5050A0',
  },
});
