import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { Avatar } from "react-native-elements";
import { Container, Header, Body, Title, Subtitle, Content, Button, Icon, Left, Right, Text} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";


const width = Dimensions.get('window').width - 40; //full width
const height = Dimensions.get('window').height; //full height

export default class Recipe_Cooking_Time extends Component {

    constructor(props){
        super(props);
        this.state = { 
          recipe: props.navigation.state.params.recipe
        }
    }

    getTimes(recipe){
        let subset = ({preptimeinseconds, cooktimeinseconds, totaltimeinseconds}) => ({preptimeinseconds, cooktimeinseconds, totaltimeinseconds});
        return subset(recipe);
    }

    secondsToHms(d) {
        //console.log(d);
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second " : " seconds ") : "";
        var final = hDisplay + mDisplay + sDisplay;
        return final.trim(); 
    }

    _renderTime(key, title, times, i){
        if(key in times){
            return[
                <Row key={'title'+i} style={{height: 60}}>
                    <Text style={[styles.subtitle]}>
                        {title}:
                    </Text>
                </Row>,
                <Row key={'number'+i} style={{height: 60}}>
                    <Text style={[{fontSize: 20}]}>
                        {this.secondsToHms(times[key])}
                    </Text>
                </Row>
            ];
        } else {
            return(null);
        }
    }

    _renderGrid(times) {
        if(!times || 0 === times.length){
            return(
                <Text style={[styles.subtitle, styles.center]}>
                    Sorry, none of the cooking time can be provided at this moment.
                </Text>
            );
        }
        var titles = ['Preparation Time', 'Cook Time', 'Total Time'];
        var keys = ['preptimeinseconds', 'cooktimeinseconds', 'totaltimeinseconds'];
        return(
            <Grid>
                {[...Array(titles.length).keys()].map((i) => {
                    return(this._renderTime(keys[i], titles[i], times, i));
                })}
            </Grid>
        );
    }

    render() {
        const {navigate} = this.props.navigation;
        const recipe = this.state.recipe;
        //console.log(recipe);
        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={()=>navigate('Recipe_Information', {recipe: recipe})}>
                        <Icon name="arrow-back" />
                        <Text> Back </Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title> Recipe  </Title>
                        <Subtitle> Cooking Time </Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Container style={[styles.screen_container]}>
                    <Content style={[{width: width, paddingTop: 20,}]}>
                        <Avatar
                        xlarge
                        rounded
                        source={{uri: recipe.imageurlsbysize_360}}
                        activeOpacity={0.7}
                        containerStyle={{justifyContent: 'center',
                        alignSelf: 'center',}}
                        />
                        <Text style={styles.title}>{recipe.recipe_name}</Text>
                        {this._renderGrid(this.getTimes(recipe))}
                        <Container style={{height: 20,}}></Container>
                    </Content>
                </Container>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    screen_container: {
      flex: 1,
      flexDirection: 'column',
      //justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'skyblue',
      //paddingTop: 50,
      //paddingBottom: 50,
      //paddingLeft: Platform.OS === 'ios' ? 0 : 20,
    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    subtitle: {
        textAlignVertical: "center",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
  });