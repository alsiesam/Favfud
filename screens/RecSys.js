import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, FlatList, ActivityIndicator, WebView, List, Alert, TouchableOpacity} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Card } from "react-native-elements";
import { Container, Header, Content, CardItem, Body, Title, Left, Right, Subtitle, Button, Icon } from "native-base";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export default class RecSys extends Component {
  
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        dataSource: [],
        displayData: [],
        hasScrolled: false,
        pageNum: 0,
      }
    }

    componentDidMount(){
      this.fetchData('all');
    }

    fetchData(ids) {
      return fetch('http://django-fyp.herokuapp.com/recsys/id/'+ids)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: [...this.state.dataSource, ...responseJson],
          displayData: responseJson.slice(0, 10),
          pageNum: this.state.pageNum + 1
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
      if(nextPageNum >= this.state.dataSource.length / 10 + 1){return null;}
      var start = originalPageNum * 10;
      var end = start + 10;
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
                <FlatList
                    //horizontal
                    style={{flexGrow:1}}
                    data={this.state.displayData}
                    onScroll={this.handleOnScroll.bind(this)}
                    scrollEventThrottle={500}
                    numColumns={1}
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
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={[{width: width, marginBottom: 30,}, styles.center]}
                    onEndReached={(x)=>{this.displayRecipe()}}
                    onEndReachedThreshold={0.5}
                />
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
      fontWeight: 'bold',
      fontSize: 30,
    },
    recipe_container: {
      padding: 0,
      width: 350,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    recipe_image: {
      width: 320,
      height: 320,
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
  