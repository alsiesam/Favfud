import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, View, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity, Image, Animated, } from 'react-native';
import { Divider, Rating } from "react-native-elements";
import { Row, Col } from "react-native-easy-grid";
import * as func from './Recipe_Functions.js';
import { Title, Text, Heading } from '@shoutem/ui';
import { Constants } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASYNC_STORAGE_KEYS = ['user_token', 'recipe_ratings'];
const API_HOST = 'http://django-fyp.herokuapp.com/';
const DIARY_CHOICE_URL = `${API_HOST}recsys/recommendation/diary/selections/`;
const GET_MULTIPLE_RECIPES_URL = `${API_HOST}recsys/recipe/id/ids`;

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;
const HEADER_HEIGHT = (Platform.OS === 'ios') ? Constants.statusBarHeight : 0;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;

export default class Recipe_Diary_Selections extends Component {

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

    renderSections() {
        const {navigate} = this.props.navigation;
        let render = [];
        let recipe = this.state.recommend_recipe;
        if(recipe.length > 0 && Object.keys(recipe[0]).length != 0){
            render.push(
                <Text key={-1} style={styles.main_desc}>
                    Recommended recipes based on your Diary records to help you maintain a balanced diet.
                    Enjoy your meal!
                </Text>
            );
        }
        for(var i = 0; i < this.state.recommend_recipe.length; i++){
            render.push(
                <View key={i} style={{marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5,}}>
                    {this.renderRecipesInList(recipe[i].recommend_recipes, recipe[i].theme, recipe[i].reason, navigate, this.state)}
                </View>
            );
        }
        return render;
    }

    getDesc(reason) {
        if(!reason){
            return '';
        }
        desc = `These recipes contain ${reason}, `;
        desc += `which help you achieve a standard level of nutrient intake.`;
        return desc;
    }

    renderRecipesInList(data, theme, reason, navigate, state) {
        if(!data || Object.keys(data[0]).length == 0){
          return;
        }

        return(
            <View style={styles.section_container}>
			    <Title style={styles.subtitle}>Diary Recommendation This Week</Title>
                <Text style={styles.sub_desc}>{this.getDesc(reason, theme)}</Text>
                <Divider style={{ marginBottom: 10, }} />
                {data.map((recipe, index) => {
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
                // <ScrollView contentContainerStyle={styles.scroll_view}>
                //     <View style={styles.screen_view}>
                //         <View style={styles.banner_view}>
                //             <ImageBackground
                //             source={require('../../assets/images/diary.jpg')}
                //             style={styles.banner_container}
                //             imageStyle={styles.banner_image}
                //             >
                //             <Text style={styles.banner_text}>Diary</Text>
                //             <Text style={{...styles.banner_text, ...{marginBottom: 10}}}>Selections</Text>
                //             </ImageBackground>
                //         </View>
                //         <Text style={styles.main_desc}>
                //             Recommended recipes based on your Diary records to help you maintain a balanced diet.
                //             Enjoy your meal!
                //         </Text>
                //         {this.renderSections()}
                //     </View>
                // </ScrollView>
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
                                        source={require('../../assets/images/diary.jpg')}
                                        style={{height: IMAGE_HEIGHT, width: "100%", opacity: this.imgOpacity,}}
                                    >
                                    </Animated.Image>
                                    <Animated.View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', opacity: this.imgTextOpacity,}}>
                                        <Text style={styles.banner_text}>Diary</Text>
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
        backgroundColor: 'rgba(157, 65, 244, 0.4)',
    },
    banner_image: {
        opacity: 0.2,
    },
    banner_container: {
        width: SCREEN_WIDTH,
        height: IMAGE_HEIGHT,
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
    noRecommend_container: {
        flexDirection:'row',
        flex: 1,
        flexWrap: 'wrap',
        marginVertical: 20,
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
  