import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Components} from '../screens';
import Home from '../screens/Auth/Home';
import Profile from '../screens/Auth/Profile';
import Ridedetails from '../screens/Auth/Ridedetails';
import Rides from '../screens/Auth/Rides';
import Signin from '../screens/Auth/Signin';
import Signup from '../screens/Auth/Signup';
import Videos from '../screens/Auth/Videos';
import TabNavigator from './TabNavigator';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
const Stack = createStackNavigator();
const Main = () => {
  const deriverId = useSelector((state: RootState) => state.data.deriverId);
  return (
    <Stack.Navigator>
      {!deriverId ? (
        <Stack.Group>
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Tab"
              component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Ridedetails"
            component={Ridedetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Video"
            component={Videos}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default Main;
