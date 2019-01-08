import RecSys from './screens/RecSys';
import Recipe_Information from './screens/Recipe_Information';
import Recipe_Cooking_Time from './screens/Recipe_Cooking_Time';
import Recipe_Ingredients from './screens/Recipe_Ingredients';
import Recipe_Nutrition from './screens/Recipe_Nutrition';
import {createStackNavigator} from 'react-navigation';
import React from "react";
import { Platform, StatusBar, } from 'react-native';
import { Container, } from "native-base";

const Favfud = createStackNavigator({
  RecSys: {screen: RecSys},
  Recipe_Information: {screen: Recipe_Information},
  Recipe_Cooking_Time: {screen: Recipe_Cooking_Time},
  Recipe_Ingredients: {screen: Recipe_Ingredients},
  Recipe_Nutrition: {screen: Recipe_Nutrition},
},{
  initialRouteName: 'RecSys',
  navigationOptions: {
   header: null
  },
});

//export default App;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
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
        <Favfud />
      </Container>
    );
  }
}