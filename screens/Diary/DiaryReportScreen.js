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
import moment from "moment";


export default class DiaryReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Report',
  };

  constructor(props) {
    super(props);
    var today = new Date;
    /*this.state = {

    };*/
  }

  render() {
    return(
      <View></View>
    );
  }

}
