import React, {Component} from 'react';
import {View, StyleSheet, Platform, } from 'react-native';
import { Constants } from 'expo';

class StatusBarBackground extends Component{
  constructor(props){
    super(props);
    this.state = { 
      statusBarHeight: 0,
    }
  }

  render(){
    return(
      <View>
        <View style={[
          styles.statusBarBackground,
          this.props.style,
          {height: this.props.height == 'autofix' && Platform.OS === 'ios' ?  Constants.statusBarHeight : 0},
          {backgroundColor: 'barColor' in this.props ? 'transparent' : 'transparent',}
          || {}]}
        >
        </View>
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