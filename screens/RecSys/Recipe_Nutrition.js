import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { Avatar } from "react-native-elements";
import { Container, Header, Body, Title, Subtitle, Content, Button, Icon, Left, Right, Text} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

const width = Dimensions.get('window').width - 40; //full width
const height = Dimensions.get('window').height; //full height

export default class Recipe_Nutrition extends Component {

    constructor(props){
        super(props);
        this.state = { 
          recipe: props.navigation.state.params.recipe
        }
    }

    getNutrients(recipe) {
        let subset = ({k, na, chole, fatrn, fasat, chocdf, fibtg, procnt, vitc, ca, fe, sugar, enerc_kcal, fat, vita_iu, starch}) => ({k, na, chole, fatrn, fasat, chocdf, fibtg, procnt, vitc, ca, fe, sugar, enerc_kcal, fat, vita_iu, starch});
        return subset(recipe);
    }

    amount(str) {
        var delimiter = "$";
        var arr = str.split(delimiter);
        if(!arr || 2 === arr.length){
            return(arr[0]+' '+arr[1]);
        } else {
            return('NA');
        }
    }

    _renderNutrientTable(key, title, nutrients, i) {
        if(key in nutrients){
            return(
                <Row key={i}>
                    <Col key={'title'+i} style={[{height: 60}, styles.center]}>
                        <Text style={{fontSize: 18, textAlign: 'center'}}>
                            {title}
                        </Text>
                    </Col>
                    <Col key={'amount'+i} style={[{height: 60}, styles.center]}>
                        <Text style={{fontSize: 18, textAlign: 'center'}}>
                            {this.amount(nutrients[key])}
                        </Text>
                    </Col>
                </Row>
            );
        } else {
            return(null);
        }
    }

    _renderGrid(nutrients) {
        if(!nutrients || 0 === nutrients.length){
            return(
                <Text style={[styles.title, styles.center]}>
                    Sorry, no nutrition fact can be provided at this moment.
                </Text>
            );
        }
        var titles = ['Potassium', 'Sodium', 'Cholesterol', 'Trans Fatty acids', 'Saturated Fatty Acids', 'Carbohydrate', 'Fiber', 'Protein', 'Vitamin C', 'Calcium', 'Iron', 'Sugar', 'Energy', 'Fat', 'Vitamin A', 'Starch'];
        var keys = ['k', 'na', 'chole', 'fatrn', 'fasat', 'chocdf', 'fibtg', 'procnt', 'vitc', 'ca', 'fe', 'sugar', 'enerc_kcal', 'fat', 'vita_iu', 'starch'];
        return(
            <Grid>
                {[...Array(titles.length).keys()].map((i) => {
                    return(this._renderNutrientTable(keys[i], titles[i], nutrients, i));
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
                        <Subtitle> Nutrition Fact </Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Container style={styles.screen_container}>
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
                        {this._renderGrid(this.getNutrients(recipe))} 
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
  });