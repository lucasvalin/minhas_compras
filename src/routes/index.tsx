import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

//Screens
import Login from '../pages/Login';
import Compras from '../pages/Main';
import Lista from '../pages/Lista';
import Carrinho from '../pages/Carrinho';

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Compras"
          component={Compras}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Lista"
          component={Lista}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Carrinho"
          component={Carrinho}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}