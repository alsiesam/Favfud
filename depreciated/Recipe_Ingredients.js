import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { Avatar } from "react-native-elements";
import { Container, Header, Body, Title, Subtitle, Content, Button, Icon, Left, Right, Text} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

const width = Dimensions.get('window').width - 40; //full width
const height = Dimensions.get('window').height; //full height

export default class Recipe_Ingredients extends Component {

    constructor(props){
        super(props);
        this.state = { 
          recipe: props.navigation.state.params.recipe
        }
    }

    getIngredients(recipe) {
        var ingredient_list = recipe.ingredients;
        var delimiter = "$";
        var ingredient_arr = ingredient_list.split(delimiter).map(function(e){return e.trim();});
        return ingredient_arr;
    }

    _renderGrid(numberofservings, ingredients_arr) {
        return(
            <Grid>
                <Row style={{height: 60}}>
                    <Text style={styles.subtitle}>
                        Number of servings:
                    </Text>
                </Row>
                <Row style={{height: 60}}>
                    { [...Array(numberofservings).keys()].map((i) => {
                        return(
                        <Col key={i} style={styles.cols}>
                            <Icon type="Ionicons" name="md-person" />
                        </Col>
                        );
                    }) }
                </Row>
                <Row style={{height: 60}}>
                    <Text style={styles.subtitle}>
                        Ingredients:
                    </Text>
                </Row>
                { ingredients_arr.map((ingredients, i) => {
                    return(
                    <Row key={i} style={styles.rows}>
                        <Text>{ingredients}</Text>
                    </Row>
                    );
                }) }
                <Row style={{justifyContent: 'center', alignItems: 'center', height: 60}}>
                    <Text style={styles.subtitle}>
                        Ready to cook!
                    </Text>
                </Row>
            </Grid>
        );
    }

    render() {
        const {navigate} = this.props.navigation;
        const {goBack} = this.props.navigation;
        const recipe = this.state.recipe;
        //console.log(recipe);
        return(
            <Container>
                <Header>
                    <Left>
                    <Button transparent onPress={()=>goBack()}>
                        <Icon name="arrow-back" />
                        <Text> Back </Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title> Recipe </Title>
                        <Subtitle> Ingredients </Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Container style={[styles.screen_container,]}>
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
                        {this._renderGrid(recipe.numberofservings, this.getIngredients(recipe))} 
                        <Container style={{height: 40,}}></Container>
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
    cols: {
        width: 40,
    },
    rows: {
        //justifyContent: 'center',
        //alignItems: 'center',
        height: 40,
        marginBottom: 20,
        //backgroundColor: 'skyblue',
    },
  });