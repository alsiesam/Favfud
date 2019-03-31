import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, Alert} from 'react-native';
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
import { BarChart, Grid as ChartGrid} from 'react-native-svg-charts'
import moment from "moment";


export default class DiaryReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Report',
  };

  constructor(props) {
    super(props);
    var today = new Date;
    this.state = {
      reportInfo: props.navigation.getParam('reportInfo'),
    };
  }

  renderBarChart() {
    const fill = 'rgb(204, 224, 254)'
    const data   = [ 50, 25, 10];
    return(
      <View style={{ flexDirection: 'row', height: 100, paddingVertical: 10 }}>
        <BarChart
            style={{ flex:1 }}
            data={ data }
            svg={{ fill }}
            contentInset={{ top: 10, bottom: 10 }}
            horizontal={true}
            showGrid={false}
            spacing={0.2}
        >
            <ChartGrid/>
        </BarChart>
      </View>
    );
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          {/*<Subtitle>Num. of days: {this.state.reportInfo.numOfDays} days</Subtitle>*/}
          <Subtitle>Your average daily nutrition consumption: </Subtitle>
        </View>
        <Grid style={styles.grid}>
          <Row style={{flexDirection: 'column'}}>
            <Text>Energy: {Math.round(this.state.reportInfo.energy/this.state.reportInfo.numOfDays)} kcal</Text>
            <Text>{Math.round(this.state.reportInfo.energy/this.state.reportInfo.numOfDays/23)}% of normal intake</Text>
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Carbohydrate: {Math.round(this.state.reportInfo.carb/this.state.reportInfo.numOfDays)} grams</Text>
            <Text>{Math.round(this.state.reportInfo.carb/this.state.reportInfo.numOfDays/3.8)}% of normal intake</Text>
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Fat: {Math.round(this.state.reportInfo.fat/this.state.reportInfo.numOfDays)} grams</Text>
            <Text>{Math.round(this.state.reportInfo.fat/this.state.reportInfo.numOfDays/0.766)}% of normal intake</Text>
          </Row>
          <Row style={{flexDirection: 'column'}}>
            <Text>Protein: {Math.round(this.state.reportInfo.protein/this.state.reportInfo.numOfDays)} grams</Text>
            <Text>{Math.round(this.state.reportInfo.protein/this.state.reportInfo.numOfDays/0.72)}% of normal intake</Text>
          </Row>
        </Grid>
        {/*this.renderBarChart()*/}
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
});
