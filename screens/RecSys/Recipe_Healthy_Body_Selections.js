import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity, Image} from 'react-native';
import { Divider, Rating } from "react-native-elements";
import { Row, Col } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';
import { Title, Text } from '@shoutem/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'recipe_ratings'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const HEALTHY_CHOICE_URL = `${API_HOST}recsys/recommendation/healthy/body/selections/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;

export default class Recipe_Healthy_Body_Selections extends Component {

    static navigationOptions = {
        title: 'Healthy Choice',
    };
    
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isRefreshing: false,
        recommend_recipe: props.navigation.state.params.recommend_recipe,
        user_token: props.navigation.state.params.user_token,
        recommend_recipe: [{}],
        dataSource: [],
        rated_recipe_ids: '',
        hasScrolled: false,
      }
    }

    componentWillMount(){
        this.fetchRecipes(this.state.user_token);
        this.setState({isLoading: false});
    }

    fetchRecipes(user_token) {
        if(!user_token){
          return;
        }
        let header = {
          headers: new Headers ({
            usertoken: user_token,
          }),
        };
        return fetch(HEALTHY_CHOICE_URL, header)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            recommend_recipe: responseJson,
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

    parseSectionDesc(theme) {
        if(!theme){
            return;
        }
        theme_prototype = theme.split('_')[0];
        theme_type = theme.split('_')[1].charAt(0).toUpperCase() + theme.split('_')[1].slice(1);
        switch(theme_prototype){
            case 'age':
                desc = `Recipes for ${them_type}`;
                break;

            case 'illness':
                desc = `Recipes for Controlling of ${theme_type}`;
                break;
            
            case 'bmi':
                desc = `Recipes for ${theme_type} Person`;
                break;

            case 'exercise':
                desc = `Recipes for Fitness Lovers`;
                break;

            case 'low':
                desc = `Recipes with Low Calories`;
                break;
            
            default:
                desc = ``;
                break;
        }
        return desc;
    }

    renderSections() {
        const {navigate} = this.props.navigation;
        let render = [];
        let recipe = this.state.recommend_recipe;
        for(var i = 0; i < this.state.recommend_recipe.length; i++){
            render.push(
                <View key={i} style={{marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5,}}>
                    {this.renderRecipesInList(this.parseSectionDesc(recipe[i].theme), recipe[i].recommend_recipes, recipe[i].theme, navigate, this.state)}
                </View>
            );
        }
        return render;
    }

    getDesc(data, theme) {
        recommend_reason = '';
        if(data && data.length > 0){
            recommend_reason = data[0].reason;
        }
        if(!theme){
            return '';
        }
        type = theme.split('_')[0];
        spec = theme.split('_')[1];
        desc = `These recipes contains ${recommend_reason}, `;
        if(theme.match(/illness_.*/g)){
            desc += `which can help control the condition of your ${spec}.`;
        } else if (theme.match(/age_.*/g)){
            desc += `which can satisfy the nutrition need of your age.`;
        } else if (theme.match(/bmi_.*/g)){
            desc += `they are recommended for you since you are an ${spec} person.`;
        } else if (theme.match(/exercise_.*/g)){
            desc += `they are recommended for you since you like to exercise and protein is necessary for muscle repair and growth.`;
        } else if (theme.match(/low_cal/g)){
            desc += `which are good for all type of people who want to maintain a healthy diet.`;
        }
        return desc;
    }

    renderRecipesInList(title, data, theme, navigate, state) {
        if(!data || Object.keys(data[0]).length == 0){
          return;
        }

        return(
            <View style={styles.section_container}>
			    <Title style={styles.subtitle}>{title}</Title>
                <Text style={styles.sub_desc}>{this.getDesc(data, theme)}</Text>
                <Divider style={{ marginBottom: 10, }} />
                {data.map((rowData, index) => {
                    recipe = rowData.recommend_recipe;
                    return (
                        <TouchableOpacity key={recipe.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: rowData.recommend_recipe, user_token: state.user_token}, key: 'Info'+recipe.id})}>
                            <Row style={styles.list_row}>
                                <Text style={{marginLeft: 5,}}>{index + 1}</Text>
                                <Image
                                    style={[styles.smallest_recipe_image, {marginLeft: 10, marginRight: 10}]}
                                    source={{uri: recipe.imageurlsbysize_90}}
                                />
                                <Col>
                                    <Text numberOfLines={1} style={{fontSize: 18, marginBottom: 5,}}>
                                        {recipe.recipe_name}
                                    </Text>
                                    <Row>
                                        <Rating
                                        type="star"
                                        fractions={1}
                                        startingValue={recipe.rating}
                                        readonly
                                        imageSize={12}
                                        style={{ }}
                                        />
                                    </Row>
                                    <Divider style={{ width: 'auto', marginTop: 10, marginBottom: 10, }} />
                                </Col>
                            </Row>
                        </TouchableOpacity>
                    );
                })}
		    </View>
        );
      }

    render() {
        if (this.state.isLoading) {
            return(
                <View style={styles.screen_view}>
                    <Text>Loading...</Text>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return(
                <View>
                    <ScrollView>
                        <View style={styles.screen_view}>
                            <View style={styles.banner_view}>
                                <ImageBackground
                                source={require('../../assets/images/healthy.jpeg')}
                                style={styles.banner_container}
                                imageStyle={styles.banner_image}
                                >
                                <Text style={styles.banner_text}>Healthy Body</Text>
                                <Text style={{...styles.banner_text, ...{marginBottom: 10}}}>Selections</Text>
                                </ImageBackground>
                            </View>
                            <Text style={styles.main_desc}>
                                Weekly recommended recipes for improving your health condition and helping you in nurturing a healthy eating habit.
                                Enjoy your meal!
                            </Text>
                            {this.renderSections()}
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }
  
  }
  
  const styles = StyleSheet.create({
    screen_view: {
        flex: 1,
        backgroundColor: 'aliceblue',
    },
    banner_view: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    banner_image: {
        opacity: 0.2,
    },
    banner_container: {
        width: SCREEN_WIDTH,
        height: 300,
        backgroundColor: 'rgba(66, 244, 146, 0.2)',
        justifyContent: 'flex-end',
    },
    banner_text: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontFamily: 'Rubik-Bold',
        fontSize: 32,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    main_desc: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        fontSize: 18,
    },
    section_container: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 30,
    },
    subtitle: {
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 20,
    },
    sub_desc: {
        marginLeft: 20,
        marginBottom: 20,
        marginRight: 20,
    },
    recipe_view: {
        margin: 15,
        marginTop: 20,
        width: SCREEN_WIDTH/2-20,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    recipe_image: {
        marginBottom: 5,
        width: SCREEN_WIDTH/2-20,
        height: SCREEN_WIDTH/2-20,
        backgroundColor: 'transparent',
        borderRadius: 25,
    },
    recipe_text: {
        marginBottom: 10,
        textAlignVertical: "center",
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    list_row: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12,
	},
    smallest_recipe_image: {
        width: (SCREEN_WIDTH-200)/4,
        height: (SCREEN_WIDTH-200)/4,
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
  });
  