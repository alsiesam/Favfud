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
const DIARY_CHOICE_URL = `${API_HOST}recsys/recommendation/diary/selections/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;

export default class Recipe_Diary_Selections extends Component {

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
        recommend_recipe: [],
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
        return fetch(DIARY_CHOICE_URL, header)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            recommend_recipe: [...this.state.recommend_recipe, ...responseJson],
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

    renderSections() {
        const {navigate} = this.props.navigation;
        let render = [];
        let recipe = this.state.recommend_recipe;
        for(var i = 0; i < this.state.recommend_recipe.length; i++){
            render.push(
                <View key={i} style={{marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5,}}>
                    {this.renderRecipesInList(recipe[i].recommend_recipes, recipe[i].theme, navigate, this.state)}
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
        desc = `These recipes contain ${recommend_reason}, `;
        desc += `which help you achieve a standard level of nutrient intake.`;
        return desc;
    }

    renderRecipesInList(data, theme, navigate, state) {
        if(!data || Object.keys(data[0]).length == 0){
          return;
        }

        return(
            <View style={styles.section_container}>
			    <Title style={styles.subtitle}>Diary Recommendation This Week</Title>
                <Text style={styles.sub_desc}>{this.getDesc(data, theme)}</Text>
                <Divider style={{ marginBottom: 10, }} />
                {data.map((rowData, index) => {
                    recipe = rowData;
                    return (
                        <TouchableOpacity key={recipe.id} onPress={() => navigate({routeName: 'Recipe_Information', params: {recipe: recipe, user_token: state.user_token}, key: 'Info'+recipe.id})}>
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
                <ScrollView contentContainerStyle={styles.scroll_view}>
                    <View style={styles.screen_view}>
                        <View style={styles.banner_view}>
                            <ImageBackground
                            source={require('../../assets/images/diary.jpg')}
                            style={styles.banner_container}
                            imageStyle={styles.banner_image}
                            >
                            <Text style={styles.banner_text}>Diary</Text>
                            <Text style={{...styles.banner_text, ...{marginBottom: 10}}}>Selections</Text>
                            </ImageBackground>
                        </View>
                        <Text style={styles.main_desc}>
                            Recommended recipes based on your Diary records to help you maintain a balanced diet.
                            Enjoy your meal!
                        </Text>
                        {this.renderSections()}
                    </View>
                </ScrollView>
            );
        }
    }
  
  }
  
  const styles = StyleSheet.create({
    scroll_view: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: 'aliceblue',
    },
    screen_view: {
        flex: 1,
    },
    banner_view: {
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
        backgroundColor: 'rgba(157, 65, 244, 0.4)',
        justifyContent: 'flex-end',
    },
    banner_text: {
        color: 'rgba(255, 255, 255, 1)',
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
  