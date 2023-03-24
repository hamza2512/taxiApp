// import { Block } from 'react-native'
import React from 'react'
import { Block, Button, Input, Text } from '../../components'
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '../../hooks';
const Videos = ({ route }) => {
  const { url } = route.params
  // console.log(url);
// const url = [
//   "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4",
//   "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4",
//   "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4",
//   "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4",
//   "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4",

// ]


  const {sizes,colors} = useTheme()
  console.log('url logging on');
  console.log(url);
  return (
    // {url?.map((item,index)=>{
    //   <Block>
    // <Block flex={1} padding={20} align={'center'}>

    //   <Video
    //     style={{ width: '100%', height: 220, alignSelf: 'center' }}
    //     source={{
    //       uri: "https://roadmaptestv1rulesengine.blob.core.windows.net/videos5/sample-5s.mp4"

    //     }}
    //     useNativeControls
    //     resizeMode="contain"
    //     isLooping />
    // </Block>
    // </Block>
    //   })}
<Block scroll flex={1} color={colors.white}  padding={20} >
  {url?.map((item,index)=>{
    console.log('video logging started');
    console.log(item);
    return(
      <Block>
      <Video
      // shouldPlay={false}
      // isLoaded={}
        style={{ width: '100%', height: 220, alignSelf: 'center' }}
        source={{
          uri: item
        }}
        useNativeControls
        resizeMode="contain"
        
        isLooping />
        <Text h4 color={colors.lightgreen} >Video {index+1}</Text>
        </Block>
    )
  })}
 
</Block>
  )
}

export default Videos