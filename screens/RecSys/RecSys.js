import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity, ScrollView, Image, AsyncStorage} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Rating, Divider } from "react-native-elements";
import { Card, } from "react-native-elements";
import { Container, Header, Content, 
  //Card, 
CardItem, Body, Title, Left, Right, Subtitle, Button, Icon} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel from 'react-native-snap-carousel';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const span = 5

export default class RecSys extends Component {
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isFetching: false,
        dataSource: [],
        favoriteRecipes: [],
        popularRecipes: [],
        randomRecipes: [],
        //hasScrolled: false,
        //pageNum: 0,
        user_token: 'abc1234',
        user_name: 'Guest',
        greeting: 'Hi, Guest.',
      }
    }

    componentWillMount(){
      this.fetchFavoriteRecipes();
      this.fetchPopularRecipes();
      this.fetchRandomRecipes();
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
      AsyncStorage.getItem('user_token')
      .then((ut) => {
        if(ut){
          this.setState({user_token: ut});
        }
      });
      AsyncStorage.getItem('user_name')
      .then((un) => {
        if(un){
          this.setState({user_name: un});
        }
      });
      this.setState({greeting: greet+this.state.user_name+'.'})
    }

    fetchFavoriteRecipes() {
      return fetch('http://django-fyp.herokuapp.com/recsys/id/ids/1-8')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
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
      return fetch('http://django-fyp.herokuapp.com/recsys/id/random/8')
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
      return fetch('http://django-fyp.herokuapp.com/recsys/id/random/8')
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
            <Header>
            <Left />
              <Body>
                <Title>RecSys</Title>
              </Body>
            <Right />
            </Header>
            <Container style={styles.screen_container}>
              {/* <Content style={[styles.content, ]}> */}
                <ScrollView>
                  <Text style={[styles.title]}>{this.state.greeting}</Text>
                  {/* <Divider style={{ marginBottom: 20, }} /> */}
                  <Text style={[styles.subtitle]}>Your Favorites</Text>
                  <FlatList
                      horizontal={true}
                      data={this.state.favoriteRecipes}
                      // onRefresh={() => this.refresh()}
                      // refreshing={this.state.isFetching}
                      // onScroll={this.handleOnScroll.bind(this)}
                      // scrollEventThrottle={500}
                      // numColumns={1}
                      renderItem={({ item: rowData }) => {
                        return(
                            <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: this.state.user_token}, key: 'Info'+rowData.id})}>
                            <Card
                              //title={rowData.recipe_name}
                              image={{ 
                              uri: rowData.imageurlsbysize_360 
                              }}
                              imageStyle={styles.recipe_image}
                              containerStyle={[styles.recipe_container]}
                            >
                            <Row style={{height: 50}}><Text numberOfLines={2}>{rowData.recipe_name}</Text></Row>
                            </Card>
                            {/* <Card transparent>
                              <CardItem>
                                <Image source={{uri: rowData.imageurlsbysize_360 }} style={styles.recipe_image} />
                              </CardItem>
                              <CardItem>
                                <Row style={{height: 50}}><Text numberOfLines={2}>{rowData.recipe_name}</Text></Row>
                              </CardItem>
                            </Card> */}
                            </TouchableOpacity> 
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={[{marginBottom: 20,}, styles.center]}
                      //onEndReached={(x)=>{this.displayRecipe()}}
                      //onEndReachedThreshold={0.5}
                      showsHorizontalScrollIndicator={false}
                  />
                  <Divider style={{ marginBottom: 20, }} />
                  <Text style={[styles.subtitle]}>Popular Cuisines</Text>
                  <FlatList
                      horizontal={true}
                      data={this.state.popularRecipes}
                      // onRefresh={() => this.refresh()}
                      // refreshing={this.state.isFetching}
                      // onScroll={this.handleOnScroll.bind(this)}
                      // scrollEventThrottle={500}
                      // numColumns={1}
                      renderItem={({ item: rowData }) => {
                        return(
                          <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: this.state.user_token}, key: 'Info'+rowData.id})}>
                            <Card
                              //title={rowData.recipe_name}
                              image={{ 
                              uri: rowData.imageurlsbysize_360 
                              }}
                              imageStyle={styles.recipe_image}
                              containerStyle={[styles.recipe_container]}
                            >
                            <Row style={{height: 50}}><Text numberOfLines={2}>{rowData.recipe_name}</Text></Row>
                            </Card>
                            </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={[{marginBottom: 20,}, styles.center]}
                      //onEndReached={(x)=>{this.displayRecipe()}}
                      //onEndReachedThreshold={0.5}
                      showsHorizontalScrollIndicator={false}
                  />
                  <Divider style={{ marginBottom: 20, }} />
                  <Text style={[styles.subtitle]}>Random Picks</Text>
                  <FlatList
                      horizontal={true}
                      data={this.state.randomRecipes}
                      // onRefresh={() => this.refresh()}
                      // refreshing={this.state.isFetching}
                      // onScroll={this.handleOnScroll.bind(this)}
                      // scrollEventThrottle={500}
                      // numColumns={1}
                      renderItem={({ item: rowData }) => {
                        return(
                          <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: this.state.user_token}, key: 'Info'+rowData.id})}>
                            <Card
                              //title={rowData.recipe_name}
                              image={{ 
                              uri: rowData.imageurlsbysize_360 
                              }}
                              imageStyle={styles.recipe_image}
                              containerStyle={[styles.recipe_container]}
                            >
                            <Row style={{height: 50}}><Text numberOfLines={2}>{rowData.recipe_name}</Text></Row>
                            </Card>
                            </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={[{marginBottom: 20,}, styles.center]}
                      //onEndReached={(x)=>{this.displayRecipe()}}
                      //onEndReachedThreshold={0.5}
                      showsHorizontalScrollIndicator={false}
                  />
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
      justifyContent: 'center',
      alignItems: 'center',
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
    recipe_container: {
      padding: 0,
      width: 160,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    recipe_image: {
      width: 150,
      height: 150,
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    recipe_text: {
      marginBottom: 10,
      textAlignVertical: "center",
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    content: {
      paddingTop: 0,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  