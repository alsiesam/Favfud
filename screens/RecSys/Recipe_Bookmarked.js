import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, ActivityIndicator, Text, FlatList, AsyncStorage, TouchableOpacity} from 'react-native';
import { SearchBar, } from "react-native-elements";
import { Card, } from "react-native-elements";
import { Container, Header, Content, CardItem, Body, Title, Left, Right, Subtitle, Button, Icon, } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';

const width = Dimensions.get('window').width - 40; //full width
const height = Dimensions.get('window').height; //full height

export default class Recipe_Bookmarked extends Component {
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isRefreshing: false,
        dataSource: [],
        bookmarked_recipe_ids: '',
        hasScrolled: false,
        user_token: 'abc1234',
      }
    }

    componentWillMount() {
        AsyncStorage.getItem('bookmarked_recipe')
        .then((recipes) => {
            const r = recipes ? JSON.parse(recipes) : [];
            if(r.length != 0 && r.join(',') != this.state.bookmarked_recipe_ids){
                ids_str = r.join(',');
                this.setState({bookmarked_recipe_ids: ids_str});
                this.fetchData(this.state.bookmarked_recipe_ids);
            }
            this.setState({isLoading: false});
        });
        AsyncStorage.getItem('user_token')
        .then((ut) => {
            if(ut){
                this.setState({user_token: ut});
            }
        });

    }

    getRefreshedData() {
        AsyncStorage.getItem('bookmarked_recipe')
        .then((recipes) => {
            const r1 = recipes ? JSON.parse(recipes) : [];
            r2 = this.state.bookmarked_recipe_ids.split(',');
            diff_ids = func.arr_diff(r1, r2);
            //console.log(diff_ids);
            if(diff_ids["more"].length != 0) {
                this.setState({bookmarked_recipe_ids: r1.join(',')});
                ids_str = diff_ids["more"].join(',');
                this.fetchData(ids_str);
            }
            if(diff_ids["less"].length != 0) {
                this.setState({bookmarked_recipe_ids: r1.join(',')});
                for(var i = 0; i < diff_ids["less"].length; i++){
                    this.setState({ dataSource: this.state.dataSource.filter(function(rec) {return rec.id != diff_ids["less"][i];}) });
                };
            }
        });
    }

    fetchData(recipe_ids) {
        return fetch('http://django-fyp.herokuapp.com/recsys/id/ids', {
            headers: new Headers ({
                ids: recipe_ids
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            dataSource: [...this.state.dataSource, ...responseJson],
          }, function(){
            //console.log(responseJson)
          });
  
        })
        .catch((error) =>{
          console.error(error);
        });
    }

    handleOnScroll() {
        this.setState({hasScrolled: true});
    }

    refresh() {
        this.setState({ isRefreshing: true });
        this.getRefreshedData();
        this.setState({ isRefreshing: false });
    }

    renderBookmarkedRecipes() {
        const {navigate} = this.props.navigation;
        data = this.state.dataSource;
        if(data.length == 0){
            return(<Container style={styles.center}><Text style={styles.remind_text}>There is no bookmarked recipe</Text><Text style={styles.remind_text}>at this moment.</Text></Container>);
        } else {
            return(
                <FlatList
                    //horizontal
                    style={{flexGrow:1}}
                    data={data}
                    onRefresh={() => this.refresh()}
                    refreshing={this.state.isRefreshing}
                    onScroll={this.handleOnScroll.bind(this)}
                    scrollEventThrottle={500}
                    numColumns={2}
                    renderItem={({ item: rowData }) => {
                      return(
                          <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData, user_token: this.state.user_token}, key: 'Info'+rowData.id})}>
                          <Card
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
                    contentContainerStyle={[{width: width, marginBottom: 30,}, styles.center]}
                    // onEndReached={(x)=>{this.displayRecipe()}}
                    // onEndReachedThreshold={0.5}
                />
            );
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
              <Container style={styles.screen_container}>
              <StatusBar
                  barStyle="light-content"
              />
              <Text>Loading...</Text>
                  <ActivityIndicator/>
              </Container>
              )
        } else {
            return(
                <Container>
                    <Header>
                    <Left />
                    <Body>
                        <Title>Bookmarked</Title>
                    </Body>
                    <Right />
                    </Header>
                    <Container style={styles.screen_container}>
                        {this.renderBookmarkedRecipes()}
                    </Container>
                </Container>
            );
        }
    }
  
  }
  
  const styles = StyleSheet.create({
    screen_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    remind_text: {
        fontSize: 20,
        color: 'gray',
    },
    recipe_container: {
        padding: 0,
        width: width/2-10,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        justifyContent: 'center',
      },
      recipe_image: {
        width: width/2-10,
        height: width/2-10,
        backgroundColor: 'transparent',
        alignSelf: 'center',
      },
      recipe_text: {
        marginBottom: 10,
        textAlignVertical: "center",
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
  });
  