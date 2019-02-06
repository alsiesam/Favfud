import RecSys from './screens/RecSys/RecSys';
import Recipe_Information from './screens/RecSys/Recipe_Information';
import Recipe_Cooking_Time from './screens/RecSys/Recipe_Cooking_Time';
import Recipe_Ingredients from './screens/RecSys/Recipe_Ingredients';
import Recipe_Nutrition from './screens/RecSys/Recipe_Nutrition';
import Recipe_Search from './screens/RecSys/Recipe_Search';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import React from "react";
import { Platform, StatusBar, } from 'react-native';
import { Container, Footer, FooterTab, Icon, Button} from "native-base";

const screens = ["RecSys", "Recipe_Information", "Recipe_Cooking_Time", "Recipe_Ingredients", "Recipe_Nutrition", "Recipe_Search"];
const ratingScreens = ["Recipe_Information", "Recipe_Cooking_Time", "Recipe_Ingredients", "Recipe_Nutrition"];

const RecSysMain = createStackNavigator({
  RecSys: {screen: RecSys},
  Recipe_Information: {screen: Recipe_Information},
  Recipe_Cooking_Time: {screen: Recipe_Cooking_Time},
  Recipe_Ingredients: {screen: Recipe_Ingredients},
  Recipe_Nutrition: {screen: Recipe_Nutrition},
  Recipe_Search: {screen: Recipe_Search},
},{
  initialRouteName: 'RecSys',
  navigationOptions: {
   header: null
  },
});

const RecSysFooter = createBottomTabNavigator({
  RecSysStack: RecSysMain
},{
  initialRouteName: 'RecSysStack',
  navigationOptions: {
   header: null
  },
  tabBarPosition: "bottom",
  tabBarComponent: (props) => renderDefaultFooter(props),
});

function renderDefaultFooter(props) {
  var lastScreen = props.navigation.state.routes.slice(-1).pop().routes.slice(-1).pop().routeName;
  //if(!ratingScreens.includes(lastScreen)){
    return(
      <Footer>
        <FooterTab>
          <Button 
            //active
            onPress={() => {props.navigation.navigate("RecSys")}}
          >
            <Icon name="home" />
          </Button>
          <Button 
            //active
            onPress={() => {props.navigation.navigate("Recipe_Search")}}
          >
            <Icon name="search" />
          </Button>
        </FooterTab>
      </Footer>
    );
  //} 
  // else {
  //   return(
  //     <Footer>
  //       <FooterTab>
  //         <Button 
  //           //active
  //           onPress={() => {props.navigation.navigate("RecSys")}}
  //         >
  //           <Icon name="home" />
  //         </Button>
  //         <Button 
  //           //active
  //           onPress={() => {props.navigation.navigate("Recipe_Search")}}
  //         >
  //           <Icon name="search" />
  //         </Button>
  //         <Button
  //           onPress={() => {}}
  //         >
  //           <Icon name="heart" style={{color: 'red',}}/>
  //         </Button>
  //         <Button
  //           onPress={() => {}}
  //         >
  //           <Icon name="star" style={{color: 'gold',}}/>
  //         </Button>
  //         <Button>
  //           <Icon name="bookmark" style={{color: 'brown',}}/>
  //         </Button>
  //       </FooterTab>
  //     </Footer>
  //   );
  // }
}

//export default App;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      heart_color: 'red',
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container style={{ paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, }}>
        <RecSysFooter />
      </Container>
    );
  }
}