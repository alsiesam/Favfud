import React, { Component } from 'react';
import { Platform, Dimensions, View, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";

import { Heading, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
var NUTRIENTS = ['Potassium', 'Sodium', 'Cholesterol', 'Trans Fatty acids', 'Saturated Fatty Acids', 'Carbohydrate', 'Fiber', 'Protein', 'Vitamin C', 'Calcium', 'Iron', 'Sugar', 'Energy', 'Fat', 'Vitamin A', 'Starch'];
var NUTRIENTS_ABBR = ['k', 'na', 'chole', 'fatrn', 'fasat', 'chocdf', 'fibtg', 'procnt', 'vitc', 'ca', 'fe', 'sugar', 'enerc_kcal', 'fat', 'vita_iu', 'starch'];

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
                    <Col key={'title'+i} style={[{
                        //backgroundColor:'pink',
                    }, styles.cell]}>
                        <Text style={{fontSize: 18, textAlign: 'left'}}>
                            {title}
                        </Text>
                    </Col>
                    <Col key={'amount'+i} style={[{
                        //backgroundColor:'aliceblue'
                    }, styles.cell]}>
                        <Text style={{fontSize: 18, textAlign: 'right'}}>
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
                <Heading style={styles.title}>
                    Sorry, no nutrition fact can be provided at this moment.
                </Heading>
            );
        }
        return(
            <Grid style={styles.grid}>
                {[...Array(NUTRIENTS.length).keys()].map((i) => {
                    return(this._renderNutrientTable(NUTRIENTS_ABBR[i], NUTRIENTS[i], nutrients, i));
                })}
            </Grid>
        );
    }

    render() {
        const recipe = this.state.recipe;
        return(
            <ScrollView>
                <View style={styles.screen_view}>
                    <Avatar
                    xlarge
                    rounded
                    source={{uri: recipe.imageurlsbysize_360}}
                    activeOpacity={0.7}
                    containerStyle={{justifyContent: 'center',
                    alignSelf: 'center',}}
                    />
                    <View style={{flexDirection:'row', flex: 1, flexWrap: 'wrap'}}> 
                        <Heading style={styles.title}>{recipe.recipe_name}</Heading>
                    </View>
                    {this._renderGrid(this.getNutrients(recipe))} 
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    screen_view: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20,
    },
    grid: {
        alignSelf: 'center',
        width: SCREEN_WIDTH - 80,
    },
    cell: {
        flex: 1,
        flexDirection: 'column',
        height: 60, 
        justifyContent: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
  });