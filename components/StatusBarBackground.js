import React, {Component} from 'react';
import {View, StyleSheet, Platform, Dimensions, } from 'react-native';
import { Constants } from 'expo'

const SCREEN_HEIGHT = Dimensions.get('window').height;

class StatusBarBackground extends Component{
  constructor(props){
    super(props);
    this.state = { 
      statusBarHeight: 0
    }
  }

  render(){
    return(
      <View style={[styles.statusBarBackground, this.props.style, {backgroundColor: 'barColor' in this.props ? this.props.barColor : 'white',} || {}]}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? Constants.statusBarHeight : 0, 
  }

})

module.exports = StatusBarBackground