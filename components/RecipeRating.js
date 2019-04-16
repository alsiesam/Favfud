import React, {Component} from 'react';
import {View, StyleSheet, Platform, } from 'react-native';
import { Icon } from 'native-base';

let star_dim = {
  width: 30,
  height: 30,
}

class RecipeRating extends Component{
  constructor(props){
    super(props);
    this.state = { 
      rated_stars: 0,
      star_colors: Array(5).fill({color: 'lightgray'}),
    }
  }

  async componentWillMount() {
    await this.handleProps(this.props);
  }

  async handleProps(props){
    if('imageSize' in props){
      star_dim.width = props['imageSize']
      star_dim.height = props['imageSize']
    }
    if('startingValue' in props){
      await this.coloring(props['startingValue']-1).done();
    }
  }

  coloring(rating) {
    let tmp_color = [];
    [...Array(5).keys()].map(x =>
      tmp_color[x] = x <= rating ? {color: 'gold'} : {color: 'lightgray'}
    )
    return new Promise((resolve) => {
      this.setState({
        star_colors: tmp_color,
        rated_stars: rating + 1,
      },() => {
        resolve();
      });
    });
  }

  render(){
    return(
      <View style={{flex: 1, flexDirection: 'row',}}>
          {
            [...Array(5).keys()].map(x =>
                <Icon
                    key={`star${x}`}
                    name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                    onPress={() => {
                      this.props.onFinishRating(x+1);
                      this.coloring(x);
                    }
                    }
                    style={[styles[`stars${x}`], this.state.star_colors[x]]}
                />
            )
          }
      </View>
    );
  }
}

let stars = {}
for(x = 0; x < 5; x++){
  stars[`stars${x}`] = star_dim
}
const styles = StyleSheet.create(stars)

module.exports = RecipeRating