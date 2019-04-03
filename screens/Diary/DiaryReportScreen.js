import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, Alert} from 'react-native';
import { AppRegistry, Platform } from "react-native";
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
import { Col, Row, Grid } from "react-native-easy-grid";
import AnimatedBar from "react-native-animated-bar";
import moment from "moment";

import {getConsumptionPerMeal, getNutritionLimit, getConsumptionPercentage, generateSummary} from './DiaryFunctions'

export default class DiaryReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Report',
  };

  constructor(props) {
    super(props);
    //var today = new Date;
    var reportInfo = props.navigation.getParam('reportInfo');
    var consumptionPerMeal = getConsumptionPerMeal(reportInfo);
    var limit = getNutritionLimit();
    var summary = generateSummary(consumptionPerMeal);
    this.state = {
      limit: limit,
      reportInfo: reportInfo,
      consumptionPerMeal: consumptionPerMeal,
      summary: summary,
    };
    console.log(this.state);
  }

  consumptionPercentageOf(nutrition, consumptionPerMeal=this.state.consumptionPerMeal, limit=this.state.limit) {
    return getConsumptionPercentage(nutrition, consumptionPerMeal, limit);
  }

  renderBarChart(nutrition) {
    var percentage = this.consumptionPercentageOf(nutrition);
    var color = "#05FF84";
    if (percentage>=1.4 || percentage<=0.6){
      color = "#FF2C07";
    } else if (percentage>=1.2 || percentage<=0.8) {
      color = "#FF8506";
    }
    return(
      <View style={{ height: 50, marginTop: 5,}}>
        <AnimatedBar
            progress={percentage}
            height={40}
            borderColor={"#DDD"}
            fillColor={"#EEE"}
            barColor={color}
            borderRadius={5}
            borderWidth={5}
            duration={3000}
          >
            <Text style={styles.barText}>
              {Math.round(percentage*100).toString()}%
            </Text>
          </AnimatedBar>
      </View>
    );
  }

  render() {
    return(
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'flex-start', marginBottom: 0}}>
          <Text>You have taken {this.state.reportInfo.numOfMeals} meals.</Text>
          <Subtitle>Nutrition consumption (average per meal):</Subtitle>
        </View>
        <Grid style={styles.grid}>
          <Divider styleName="line"/>
          <Row style={styles.row}>
            <Text>Energy: {Math.round(this.state.consumptionPerMeal.energy)} kcal</Text>
            <Text>{Math.round(this.consumptionPercentageOf("energy")*100)}% of normal intake</Text>
            {this.renderBarChart("energy")}
          </Row>
          <Divider styleName="line"/>
          <Row style={styles.row}>
            <Text>Carbohydrate: {Math.round(this.state.consumptionPerMeal.carb)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("carb")*100)}% of normal intake</Text>
            {this.renderBarChart("carb")}
          </Row>
          <Divider styleName="line"/>
          <Row style={styles.row}>
            <Text>Fat: {Math.round(this.state.consumptionPerMeal.fat)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("fat")*100)}% of normal intake</Text>
            {this.renderBarChart("fat")}
          </Row>
          <Divider styleName="line"/>
          <Row style={styles.row}>
            <Text>Protein: {Math.round(this.state.consumptionPerMeal.protein)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("protein")*100)}% of normal intake</Text>
            {this.renderBarChart("protein")}
          </Row>
        </Grid>
        {/*this.renderReminderText()*/}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 15
    //backgroundColor: "grey",
  },
  subtitleContainer: {
    margin: 5,
    alignItems: 'center'
  },
  grid: {
    margin: 5,
    height: 'auto',
  },
  row: {
    flexDirection: 'column',
    height: 'auto',
    marginTop: 10,
    //marginBottom: 5,
  },
  barText: {
    backgroundColor: "transparent",
    color: "#FFF",
    fontSize: 25,
  },
});
