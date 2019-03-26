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

  redirectToDiary(){
    this.props.navigation.navigate('Diary')
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
