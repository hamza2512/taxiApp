import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Auth/Home'
import BottomNavigation from '../components/BottomNavigation'
import Rides from '../screens/Auth/Rides'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'


const TabNavigator = () => {
    const Tab = createBottomTabNavigator()
    // const color = useSelector((state:RootState)=> {state.Taxidata.playcolor})
    
  return (
    <Tab.Navigator
    screenOptions={({
        headerShown:false
    })}
    tabBar={({ state, navigation }) => (
      <BottomNavigation />
    )}
    
    >
        <Tab.Screen name='Home' component={Home}/>
        <Tab.Screen name='Rides' component={Rides}/>
        
    </Tab.Navigator>
  )
}

export default TabNavigator