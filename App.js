import RecSys from './screens/RecSys';
import Recipe_Information from './screens/Recipe_Information';
import Recipe_Cooking_Time from './screens/Recipe_Cooking_Time';
import Recipe_Ingredients from './screens/Recipe_Ingredients';
import Recipe_Nutrition from './screens/Recipe_Nutrition';
import {createStackNavigator} from 'react-navigation';

const App = createStackNavigator({
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

export default App;
