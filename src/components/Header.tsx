import { View, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks';
import Block from './Block';
import { Text } from '.';
// import { Block, Button, Input,Text } from '.';

interface headerprops {
  title:string;
  }

const Header = (props:headerprops) => {
    const {colors,icons,sizes} = useTheme() 
    const {title} = props
    
  return (
   
    <Block  flex={0} height={250} padding={sizes.sm}  color={colors.white} justify="flex-end" marginTop={20} >
        <Image resizeMode='contain' style={{width:40, height:40,}}  source={icons.locationicon}/>
        <Text  h3 bold={false} marginTop={10} color={colors.lightgreen}>{props.title}</Text>
        {/* <Text h3 color={colors.lightgreen}>Account </Text> */}
        
    </Block>

  )
}

export default Header