import { Image, View } from 'react-native'
import React from 'react'
import Block from './Block'
import { useTheme } from '../hooks'
import Button from './Button'
import Modal from '.'
import { useNavigation } from '@react-navigation/native'
import { Text } from '.'
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'
import { setmodal } from '../../Redux/CounterSlice'
import { RootState } from '../../Redux/Store'
const BottomNavigation = () => {
  const { colors, sizes, icons } = useTheme()
  const navigation = useNavigation()
  const [activeScreen, setActiveScreen] = React.useState("Home");
  const [modalVisible, setModalVisible] = React.useState(false);
  const modal = useSelector((state:RootState)=>state.data.modal)
  // const color = useSelector((state:RootState)=>state.data.color)
// console.log("color,",color);

  const dispatch = useDispatch()
  return (
    <Block flex={0} color={colors.white} justify="flex-end">
      <Block
        row
        paddingVertical={sizes.sm}
        height={70}
        flex={0}
        color={colors.purewhite}
        justify="center"
        align="center"
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
      >
        <Block>
          <Button
            onPress={() => { navigation.navigate("Rides"), setActiveScreen("Rides") }}
          >
            <Image source={activeScreen === "Rides" ? icons.greencircle : icons.circle} />
            <Text color={activeScreen === "Rides" ? colors.lightgreen : colors.black} bold size={10}>
              Rides
            </Text>
          </Button>
        </Block>
        <Block flex={0} paddingBottom={20}>
          <Button
            // secondary
            onPress={() => { navigation.navigate("Home"), setActiveScreen("Home") }}
            color={colors.lightgreen}
            // gradient={gradients.primary}
            height={130}
            width={120}
            style={{
              borderTopLeftRadius: 90,
              borderTopRightRadius: 90,
              borderWidth: 1,
              borderColor: colors.white,
            }}
          >
            <Block flex={0} color={colors.white} align="center" width={60} height={70} radius={40} justify="center"  >
              {activeScreen === "Home" ?
                <Feather name="send" size={30} color="green" /> :
                <Image source={icons.send} />
              }
            </Block>
          </Button>
        </Block>
        <Block>
          <Button
          onPress={()=>{dispatch(setmodal(true))}}
          >
            <Block height={8} marginLeft={25} flex={0} width={8} radius={30} color={colors.lightgreen} />
            <Image source={require('../../assets/notification.png')} />

            <Text black bold size={10}>
              Alerts
            </Text>
          </Button>
        </Block>
       
      </Block>
    </Block>
  )
}

export default BottomNavigation