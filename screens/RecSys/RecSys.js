import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity, ScrollView, Image, AsyncStorage} from 'react-native';
import { Rating, Divider } from "react-native-elements";
import { Card, } from "react-native-elements";
import { Container, Header, Content, 
  //Card, 
CardItem, Body, Title, Left, Right, Subtitle, Button, Icon} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel from 'react-native-snap-carousel';
import * as func from './Recipe_Functions.js';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const async_storage_keys = ['user_token', 'email_address'];

const span = 5

// const NavigationBar = (props) => {
//   console.log(props);
//   icon_name = Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'
//   return(
//     <Button transparent onPress={() => Alert.alert('aaa')}>
//       <Icon name={icon_name} style={{marginLeft: 20, color: 'black'}}/>
//     </Button>
//   );
// }

export default class RecSys extends Component {

    static navigationOptions = ({navigation}) => ({
      title: 'RecSys',
      //headerLeft: <NavigationBar />,
    });
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isFetching: false,
        dataSource: [],
        favoriteRecipes: [{}],
        popularRecipes: [{}],
        randomRecipes: [{}],
        //hasScrolled: false,
        //pageNum: 0,
        greeting: 'Hi, Guest.',
      }
    }

    componentDidMount(){
      AsyncStorage.multiGet(async_storage_keys).then((response) => {
        var user_token = response[0][1];
        var user_name = response[1][1];
        if(user_token){
          this.setState({user_token: user_token});
          this.fetchFavoriteRecipes(this.state.user_token);
          this.fetchPopularRecipes();
          this.fetchRandomRecipes();
          func.fetchBookmarkedRecipes(this.state.user_token);
          func.fetchRatedRecipes(this.state.user_token);
        }
        if(user_name){
          this.setState({user_name: user_name});
          var d = new Date();
          var n = d.getHours();
          var greet = 'Hi';
          if(n >= 6 && n < 12) {
            greet = 'Good morning, ';
          } else if(n >= 12 && n < 18) {
            greet = 'Good Afternoon, ';
          } else {
            greet = 'Good night, ';
          }
          this.setState({greeting: greet+this.state.user_name+'.'})
        }
        this.setState({isLoading: false,})
      });
    }

    fetchFavoriteRecipes(user_token) {
      if(!user_token){
        return;
      }
      return fetch('http://django-fyp.herokuapp.com/recsys/recommendation/yrfav/', {
        headers: new Headers ({
          usertoken: user_token,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //isLoading: false,
          //dataSource: [...this.state.dataSource, ...responseJson],
          favoriteRecipes: responseJson, //responseJson.slice(0, span),
          //pageNum: this.state.pageNum + 1
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchPopularRecipes() {
      return fetch('http://django-fyp.herokuapp.com/recsys/recommendation/popular/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //isLoading: false,
          //dataSource: [...this.state.dataSource, ...responseJson],
          popularRecipes: responseJson, //responseJson.slice(0, span),
          //pageNum: this.state.pageNum + 1
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchRandomRecipes() {
      return fetch('http://django-fyp.herokuapp.com/recsys/recommendation/random/8')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //isLoading: false,
          //dataSource: [...this.state.dataSource, ...responseJson],
          randomRecipes: responseJson, //responseJson.slice(0, span),
          //pageNum: this.state.pageNum + 1
        }, function(){
          //console.log(responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }

    fetchMore() {
      //console.log('fetching');
      this.displayRecipe(); return;
      if(this.state.hasScrolled === false){return null;}
      var next = this.state.pageNum + 1;
      if(next == 55){return null;}
      var initial = next * 10 + 1;
      var end = initial + 9;
      var queryID = initial + '-' + end;
      this.fetchData(queryID);
    }

    displayRecipe() {
      if(this.state.hasScrolled === false){return null;}
      var originalPageNum = this.state.pageNum;
      var nextPageNum = originalPageNum + 1;
      if(nextPageNum >= this.state.dataSource.length / span + 1){return null;}
      var start = originalPageNum * span;
      var end = start + span;
      //console.log(start); console.log(end);
      this.setState({
        displayData: [...this.state.displayData, ...this.state.dataSource.slice(start, end)],
        pageNum: nextPageNum
      });
      //return(this.renderPageNum(originalPageNum));
    }

    renderPageNum(pageNum){
      console.log(pageNum);
      return(
        <Container><Text>{pageNum}</Text></Container>
      );
    }

    handleOnScroll() {
      this.setState({hasScrolled: true});
    }

    refresh() {
      this.setState({ isFetching: true });
      this.fetchData('random/5');
      this.setState({ isFetching: false })
    }
  
    render() {
        const {navigate} = this.props.navigation;
        if(this.state.isLoading){
            return(
            <Container style={styles.screen_container}>
            <StatusBar
                barStyle="light-content"
            />
            <Text>Loading...</Text>
                <ActivityIndicator/>
            </Container>
            )
        }
        return(
          <Container>
            {/* <Header>
            <Left />
              <Body>
                <Title>RecSys</Title>
              </Body>
            <Right />
            </Header> */}
            <Container style={styles.screen_container}>
              {/* <Content style={[styles.content, ]}> */}
                <ScrollView>
                  <Text style={[styles.title]}>{this.state.greeting}</Text>
                  {/* <Divider style={{ marginBottom: 20, }} /> */}
                  
                  {func.renderMainMenuRecipes('Your Favorites', this.state.favoriteRecipes, want_divider=true, navigate, this.state)}
                  {func.renderMainMenuRecipes('Popular Cuisines', this.state.popularRecipes, want_divider=true, navigate, this.state)}
                  {func.renderMainMenuRecipes('Random Picks', this.state.randomRecipes, want_divider=false, navigate, this.state)}


                  {/* <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.displayData}
                    renderItem={({ item: rowData }) => {
                      return(
                          <TouchableOpacity key={rowData.id} onPress={() => navigate('Recipe_Information', {recipe: rowData})}>
                          <Card
                            title={rowData.recipe_name}
                            image={{ 
                            uri: rowData.imageurlsbysize_360 
                            }}
                            imageStyle={styles.recipe_image}
                            containerStyle={[styles.recipe_container]}
                          >
                          </Card>
                          </TouchableOpacity>
                      );
                    }}
                    sliderWidth={width}
                    itemWidth={width}
                  /> */}
                </ScrollView>
                {/* </Content> */}
              </Container>
            </Container>
        );
    }
  
  }
  
  const styles = StyleSheet.create({
    screen_container: {
      flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      //backgroundColor: 'skyblue',
    },
    title: {
      margin: 20,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle: {
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      fontSize: 20,
      fontWeight: 'bold'
    },
    content: {
      paddingTop: 0,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  