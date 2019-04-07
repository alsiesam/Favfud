import React from 'react';
import { ScrollView, StyleSheet,AsyncStorage, SectionList, FlatList, Image, TouchableOpacity, Alert} from 'react-native';
import { AppRegistry, Platform } from "react-native";
import {
  Text,
  Button,
  View,
  TextInput,
  Divider,
  NavigationBar,
  Title,
  Subtitle,
  Icon,
  Caption,
} from '@shoutem/ui';
import { Col, Row, Grid } from "react-native-easy-grid";
import AnimatedBar from "react-native-animated-bar";
import moment from "moment";

export default class DiaryReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Diary - Report',
  };

  constructor(props) {
    super(props);
    var token = props.navigation.getParam('token');
    var summary = props.navigation.getParam('summary');
    var nutritionPercentage = props.navigation.getParam('nutritionPercentage');
    var nutritionValue = props.navigation.getParam('nutritionValue');
    var recommendations = props.navigation.getParam('recommendations');
    this.state = {
      token: token,
      summary: summary,
      nutritionPercentage: nutritionPercentage,
      nutritionValue: nutritionValue,
      recommendations: recommendations,
    };
    console.log(recommendations);
  }

  renderBarChart(nutrition) {
    var percentage = this.state.nutritionPercentage[nutrition];
    var color = "#05FF84";
    if (percentage>=1.4 || percentage<=0.6){
      color = "#FF2C07";
    } else if (percentage>=1.2 || percentage<=0.8) {
      color = "#FF8506";
    }
    return(
      <View style={{ height: 50, marginTop: 5,}}>
        <AnimatedBar
            progress={percentage}
            height={40}
            borderColor={"#DDD"}
            fillColor={"#EEE"}
            barColor={color}
            borderRadius={5}
            borderWidth={5}
            duration={3000}
          >
            <Text style={styles.barText}>
              {Math.round(percentage*100).toString()}%
            </Text>
          </AnimatedBar>
      </View>
    );
  }

  renderNutritionRow(nutrition) {
    var nutritionName = nutrition;
    var nutritionUnit = "gram";
    if (nutritionName == "carb") {nutritionName = "Carbohydrates";}
    else if (nutritionName == "energy") {
      nutritionName = "Energy";
      nutritionUnit = "kcal";
    }
    else if (nutritionName == "fat") {nutritionName = "Fat";}
    else if (nutritionName == "protein") {nutritionName = "Protein";}
    return(
      <Row style={styles.row}>
        <Text>{nutritionName}: {Math.round(this.state.nutritionValue[nutrition])} {nutritionUnit}</Text>
        <Text>{Math.round(this.state.nutritionPercentage[nutrition]*100)}% of normal intake</Text>
        {this.renderBarChart(nutrition)}
      </Row>
    );
  }

  renderRecommendations() {
    return(
      <View>
        <Divider styleName="section-header" style={{justifyContent:"center", paddingTop:15, paddingBottom:5}}>
          <Subtitle style={{fontSize: 20}}>Recommendations:</Subtitle>
        </Divider>
        <Text style={{fontSize: 14, marginTop:5, marginBottom:0}}>{this.state.summary.text}</Text>
        <Text style={{fontSize: 14, marginTop:5, marginBottom:5}}>Here are some recommendations:</Text>
        {this.renderRecipeList(this.state.recommendations)}
      </View>
    );
  }

  renderRecipeList(recipeList) {
    const {navigate} = this.props.navigation;
    return(
      <Grid style={styles.mealGrid}>
          {/*
          <Row style={{height: 'auto', backgroundColor: '#e6e6e6',}}>
              <Text>
                  {moment(date).format("D MMM YYYY")}
              </Text>
          </Row>
          */}
          <FlatList
            horizontal={true}
            data={recipeList}
            numColumns={1}
            renderItem={({ item: rowData, index }) => {
              return(
                <View style={{marginTop: 10, marginRight: 30,}}>
                  <TouchableOpacity key={rowData.id} onPress={() => navigate({routeName: 'Diary_Recipe_Information', params: {recipe: rowData, user_token: this.state.token}, key: 'Info'+rowData.id})}>
                    <Image
                      style={styles.recipe_image}
                      source={{uri: rowData.imageurlsbysize_360}}
                    />
                    <Row style={{height: 50, width: styles.recipe_image.width, flexDirection:'row'}}>
                      <Text numberOfLines={2} style={{flex: 1, flexWrap: 'wrap'}}>
                        {rowData.recipe_name}
                      </Text>
                    </Row>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{marginLeft: 20, }}
          />
      </Grid>
    );
  }

  render() {
    let haveRecommendations = Object.keys(this.state.recommendations).length>0
    return(
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Divider styleName="section-header" style={{justifyContent:"center", paddingTop:15, paddingBottom:5}}>
            <Title style={{fontSize: 20}}>Summary</Title>
          </Divider>
          <Text style={{fontSize: 14, marginTop:5, marginBottom:15}}>{this.state.summary.text}</Text>
          <Divider styleName="section-header" style={{justifyContent:"center", paddingTop:15, paddingBottom:5}}>
            <Subtitle style={{fontSize: 20}}>Nutrition Consumption:</Subtitle>
          </Divider>
        </View>
        <Grid style={styles.grid}>
          {this.renderNutritionRow("energy")}
          <Divider styleName="line"/>
          {this.renderNutritionRow("carb")}
          <Divider styleName="line"/>
          {this.renderNutritionRow("fat")}
          <Divider styleName="line"/>
          {this.renderNutritionRow("protein")}
        </Grid>
        {/*this.renderReminderText()*/}
        {haveRecommendations?
          this.renderRecommendations(): <View />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 0,
    //backgroundColor: "grey",
  },
  subtitleContainer: {
    margin: 5,
    alignItems: 'center'
  },
  grid: {
    margin: 5,
    height: 'auto',
  },
  row: {
    flexDirection: 'column',
    height: 'auto',
    marginTop: 10,
    //marginBottom: 5,
  },
  barText: {
    backgroundColor: "transparent",
    color: "#FFF",
    fontSize: 25,
  },
  mealGrid: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  recipe_image: {
    marginBottom: 5,
    width: 180,
    height: 180,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 25,
  },
});
