import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList} from 'react-native';
import {
  Text,
  Button,
  View,
  TextInput,
  Divider,
  NavigationBar,
  Title,
  Icon,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import moment from "moment";
import Calendar from '../../library/react-native-calendar-select';

const ACCESS_TOKEN = 'access_token';
const EMAIL_ADDRESS = 'email_address';

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
      endDate: today
    };
    this.getTokenAndEmail();
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  async getTokenAndEmail() {
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      this.setState({token});
      this.setState({email});
    } catch (err) {
      console.log('[getToken] Error')
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navBarArea}>
          <NavigationBar
            styleName="inline"
            leftComponent={(
              <Button onPress={this._handleRefresh}>
                {/*<Text>Refresh</Text>*/}
              </Button>
            )}
            centerComponent={
              <Title>{moment(this.state.startDate).format("D MMM")} to {moment(this.state.endDate).format("D MMM")}</Title>}
            rightComponent={(
              <Button onPress={this.openCalendar}>
                <Icon name="events" />
              </Button>
            )}>
          </NavigationBar>
        </View>

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
                <Text>Report</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  styleName="secondary full-width">
                    <Text>View Full Report</Text>
                </Button>
              </View>
            </View>
            <View style={styles.mealsContainer}>
              <Text>Meal List</Text>
            </View>
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

  _handleRefresh = () => {
    this.getTokenAndEmail();
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
    height: 70,
  },
  scrollContainer:{
    flex: 1,
    marginHorizontal: 15,
  },
  reportContainer: {
    height: 200,
    marginBottom: 5,
    paddingTop: 10,
    backgroundColor: '#ffffb3',
    justifyContent : 'space-between',
    alignItems: 'center',
  },
  shortReportContainer: {
    justifyContent : 'space-around',
    alignItems: 'center',
  },
  mealsContainer: {
    height: 400,
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 15,
    backgroundColor: '#b3e6ff',
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
});
