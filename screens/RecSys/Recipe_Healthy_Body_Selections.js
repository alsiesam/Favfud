import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, View, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity, Image, Animated, } from 'react-native';
import { Divider, Rating } from "react-native-elements";
import { Row, Col } from "react-native-easy-grid";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Title, Text, Heading } from '@shoutem/ui';
import { Constants } from 'expo';
import color from '../../constants/Colors';
import * as func from './Recipe_Functions.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'recipe_ratings'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const HEALTHY_CHOICE_URL = `${API_HOST}recsys/recommendation/healthy/body/selections/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;
const HEADER_HEIGHT = (Platform.OS === 'ios') ? Constants.statusBarHeight : 0;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;

const THEME_COLOR = color.hbsThemeColor;
const THEME_TEXT_COLOR = color.hbsThemeTextColor;

export default class Recipe_Healthy_Body_Selections extends Component {

    animatedScroll = new Animated.Value(0);
    imgScale = this.animatedScroll.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: "clamp"
    });
    imgOpacity = this.animatedScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0.2, 0],
    });
    imgTextOpacity = this.animatedScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
    });


    static navigationOptions = {
        title: 'Healthy Choice',
    };
    
    constructor(props){
      super(props);
      this.state = { 
        isLoading: true,
        isRefreshing: false,
        user_token: props.navigation.state.params.user_token,
        recommend_recipe: [],
        dataSource: [],
        rated_recipe_ids: '',
        hasScrolled: false,
        noRecommend: false,
        activeSlide: 0,
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
            if(!responseJson || Object.keys(responseJson[0]).length === 0){
                this.setState({
                    noRecommend: true,
                });
            } else {
                this.setState({
                    recommend_recipe: responseJson,
                });
            }
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
        arr = theme.split('_');
        theme_prototype = arr[0];
        theme_type = arr[1].charAt(0).toUpperCase() + arr[1].slice(1);
        if(arr.length == 3){
            sexuality = arr[2].charAt(0).toUpperCase() + arr[2].slice(1);
        }
        switch(theme_prototype){
            case 'age':
                if(theme_type == 'Adults')
                    desc = `Recipes for ${sexuality} ${theme_type}`;
                else if(theme_type == 'Teens'){
                    theme_type = 'Teenagers';
                    desc = `Recipes for ${sexuality} ${theme_type}`;
                }
                else
                    desc = `Recipes for ${theme_type}`;
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
        let recipe = this.state.recommend_recipe;
        return(
            <View>
                <Text key={-1} style={styles.main_desc}>
                        Weekly recommended recipes for improving your health condition and helping you in nurturing a healthy eating habit.
                        Enjoy your meal!
                </Text>
                <Carousel
                    key={'carousel'}
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.recommend_recipe}
                    renderItem={({ item: item }) => {
                        return(
                            <View key={item.theme} style={{margin: 5,}}>
                                {this.renderRecipesInList(this.parseSectionDesc(item.theme), item.recommend_recipes, item.theme, navigate, this.state)}
                            </View>
                        );
                    }}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    sliderWidth={SCREEN_WIDTH}
                    itemWidth={SCREEN_WIDTH * 0.84}
                />
                <Pagination
                    key={'pagination'}
                    dotsLength={recipe.length}
                    activeDotIndex={ this.state.activeSlide }
                />
            </View>
        );
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
            <View borderRadius={20} style={styles.section_container}>
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
                <View style={styles.scroll_view}>
                    <Animated.ScrollView
                        scrollEventThrottle={5}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.animatedScroll}}}], {useNativeDriver: true})}
                        style={{zIndex: 0}}
                    >
                        <View style={styles.screen_view}>
                            <Animated.View style={[{
                                transform: [{translateY: Animated.multiply(this.animatedScroll, 0.65)}, {scale: this.imgScale}],
                            },]}>
                                <Animated.View style={[styles.banner_view, {opacity: this.imgTextOpacity,}]}>
                                    <Animated.Image
                                        source={require('../../assets/images/healthy.jpeg')}
                                        style={{height: IMAGE_HEIGHT, width: "100%", opacity: this.imgOpacity,}}
                                    >
                                    </Animated.Image>
                                    <Animated.View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', opacity: this.imgTextOpacity,}}>
                                        <Text style={styles.banner_text}>Healthy Body</Text>
                                        <Text style={{...styles.banner_text, ...{marginBottom: 10}}}>Selections</Text>
                                    </Animated.View>
                                </Animated.View>
                                </Animated.View>
                                {
                                    this.state.noRecommend 
                                    ?
                                        <View style={styles.noRecommend_container}> 
                                            <Text style={styles.main_desc}>Sorry, there is no recipe to be recommended to you at the moment.</Text>
                                        </View>
                                    :
                                    this.renderSections()
                                }
                        </View>
                    </Animated.ScrollView>
                </View>
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
        backgroundColor: THEME_COLOR,
    },
    banner_image: {
        opacity: 0.2,
    },
    banner_container: {
        width: SCREEN_WIDTH,
        height: IMAGE_HEIGHT,
        backgroundColor: THEME_COLOR,
        justifyContent: 'flex-end',
    },
    banner_text: {
        color: THEME_TEXT_COLOR,
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
    noRecommend_container: {
        flexDirection:'row',
        flex: 1,
        flexWrap: 'wrap',
        marginVertical: 20,
    },
    section_container: {
        width: SCREEN_WIDTH * 0.85,
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation:  Platform.OS == 'android' ? 2 : 0,
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
    list_row: {
        paddingLeft: 10,
        paddingRight: 10,
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12,
	},
    smallest_recipe_image: {
        width: (SCREEN_WIDTH-200)/4,
        height: (SCREEN_WIDTH-200)/4,
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
  });
  