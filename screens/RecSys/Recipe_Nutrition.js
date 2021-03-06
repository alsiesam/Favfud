import React, { Component } from 'react';
import { Platform, Dimensions, View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Icon, } from "native-base";
import { Avatar } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";

import { Heading, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
var NUTRIENTS = ['Energy', 'Carbohydrate', 'Fiber', 'Protein', 'Starch', 'Cholesterol', 'Sugar', 'Fat', 'Trans Fatty acids', 'Saturated Fatty Acids', 'Vitamin A', 'Vitamin C', 'Sodium', 'Calcium', 'Iron', 'Potassium'];
var NUTRIENTS_ABBR = ['enerc_kcal', 'chocdf', 'fibtg', 'procnt', 'starch', 'chole', 'sugar', 'fat', 'fatrn', 'fasat', 'vita_iu', 'vitc', 'na', 'ca', 'fe', 'k'];

const TEXT_COLOR = 'rgba(0,0,0,1)';

export default class Recipe_Nutrition extends Component {

    constructor(props){
        super(props);
        this.state = { 
          recipe: props.navigation.state.params.recipe
        }
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
              {
                TEXT_COLOR != undefined && TEXT_COLOR.match(/(255\s*,?\s*){2}255/) != null
                ?
                StatusBar.setBarStyle("light-content")
                :
                StatusBar.setBarStyle("dark-content")
              }
            }
        );
    }

    getNutrients(recipe) {
        let subset = ({enerc_kcal, chocdf, fibtg, procnt, starch, chole, sugar, fat, fatrn, fasat, vita_iu, vitc, na, ca, fe, k}) => ({enerc_kcal, chocdf, fibtg, procnt, starch, chole, sugar, fat, fatrn, fasat, vita_iu, vitc, na, ca, fe, k});
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

        numofservings = '';
        if('numberofservings' in recipe){
          numofservings = 
          <Row style={{height:'auto', marginBottom:10}}>
            <Icon type='Ionicons' name='md-person' style={{fontSize:14, marginRight:10, marginTop: 2,}}/>
            <Text style={{fontSize: 14, textAlign: 'center', textAlignVertical: 'center',}}> {
              recipe.numberofservings
            } servings
            </Text>
          </Row>;
        }

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
                    <View style={{flexDirection:'row', flex: 1, flexWrap: 'wrap'}}> 
                        {numofservings}
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