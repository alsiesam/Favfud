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
//import FusionCharts from "react-native-fusioncharts";
//import ProgressBarClassic from 'react-native-progress-bar-classic';
import AnimatedBar from "react-native-animated-bar";
import moment from "moment";

export default class DiaryReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Report',
  };

  constructor(props) {
    super(props);
    var today = new Date;
    var reportInfo = props.navigation.getParam('reportInfo');
    this.state = {
      reportInfo: reportInfo,
      energy_perMeal: reportInfo.energy/reportInfo.numOfMeals,
      carb_perMeal: reportInfo.carb/reportInfo.numOfMeals,
      fat_perMeal: reportInfo.fat/reportInfo.numOfMeals,
      protein_perMeal: reportInfo.protein/reportInfo.numOfMeals,
      limit: {
        energy: 2000/3,
        carb: 200/3,
        fat: 76.6/3,
        protein: 72/3,
      }
    };

  }

  consumptionPercentageOf(nutrition) {
    switch (nutrition) {
      case "energy":
        return(this.state.energy_perMeal/this.state.limit.energy);
        break;
      case "carb":
        return(this.state.carb_perMeal/this.state.limit.carb);
        break;;
      case "fat":
        return(this.state.fat_perMeal/this.state.limit.fat);
        break;;
      case "protein":
        return(this.state.protein_perMeal/this.state.limit.protein);
        break;
      default:
      return 0;
    }
  }

  renderBarChart(nutrition) {
    //<View style={{ flexDirection: 'row', height: 'auto', paddingVertical: 10 }}>
    /*
    <FusionCharts
      type="angulargauge"
      width='300'
      height='150'
      dataFormat="json"
      dataSource={this.state.dataSource}
      libraryPath={this.libraryPath} // set the libraryPath property
    />

      <ProgressBarClassic
        progress={percentage}
        valueStyle={'balloon'}
      />

    */

    var percentage = this.consumptionPercentageOf(nutrition);
    var color = "#05FF84";
    if (percentage>=1.4 || percentage<=0.6){
      color = "#FF2C07";
    } else if (percentage>=1.2 || percentage<=0.8) {
      color = "#FF8506";
    }
    return(
      <View style={{ height: 100}}>
        <AnimatedBar
            progress={percentage}
            height={50}
            borderColor={"#DDD"}
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
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Subtitle>Num. of meals: {this.state.reportInfo.numOfMeals} meals</Subtitle>
          <Subtitle>Your average nutrition consumption (per meal): </Subtitle>
        </View>
        <Grid style={styles.grid}>
          <Row style={{flexDirection: 'column'}}>
            <Text>Energy: {Math.round(this.state.energy_perMeal)} kcal</Text>
            <Text>{Math.round(this.consumptionPercentageOf("energy")*100)}% of normal intake</Text>
            {this.renderBarChart("energy")}
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Carbohydrate: {Math.round(this.state.carb_perMeal)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("carb")*100)}% of normal intake</Text>
            {this.renderBarChart("carb")}
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Fat: {Math.round(this.state.fat_perMeal)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("fat")*100)}% of normal intake</Text>
            {this.renderBarChart("fat")}
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Protein: {Math.round(this.state.protein_perMeal)} grams</Text>
            <Text>{Math.round(this.consumptionPercentageOf("protein")*100)}% of normal intake</Text>
            {this.renderBarChart("protein")}
          </Row>
        </Grid>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
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
  barText: {
    backgroundColor: "transparent",
    color: "#FFF",
    fontSize: 25,
  },
});
