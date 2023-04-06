import {Alert, Image, View, Switch} from 'react-native';
import React, {useState} from 'react';
import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';
import {color} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../Redux/Store';
import {storeData} from '../../AsyncStorage';
import {setDriverPreference, setUSerData} from '../../../Redux/CounterSlice';

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const deriverData = useSelector((state: RootState) => state.data.userData);
  const [userData, setUserData] = useState(deriverData);
  const {sizes, colors, icons} = useTheme();
  const [color, setColor] = useState();
  const [videoLength, setVideoLength] = useState();
  const [numberOfVideo, setNumberOfVideo] = useState();

  const Gender = ['Male', 'Female', 'Other'];
  const isEnabled = useSelector(
    (state: RootState) => state.data?.driveWithVedio,
  );
  // const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => {
    // setIsEnabled((previousState) => !previousState);
    dispatch(setDriverPreference(!isEnabled));
  };

  const handleUpdate = async () => {
    if (
      userData?.Liecence &&
      userData?.driverID &&
      userData?.firstname &&
      userData?.lastname
    ) {
      await storeData(userData);
      dispatch(setUSerData(userData));
      navigation.goBack();
    } else {
      Alert.alert('Oops!', 'Some Details are missing', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };
  return (
    <Block scroll flex={1} marginTop={10} color={colors.white}>
      <Block flex={0} padding={10} height={50} justify={'flex-end'}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={icons.back} />
        </TouchableOpacity>
      </Block>

      <Block padding={10} flex={0}>
        <Text bold h4>
          My Profile
        </Text>
      </Block>

      {/* <Block row padding={10} color={colors.white} flex={0}>
        <Block
          radius={25}
          width={50}
          height={50}
          color={colors.facebook}
          flex={0}></Block>
        <Block paddingHorizontal={20}>
          <Text h5>My avatar</Text>
          <Text h6>Upload a photo of yourself</Text>
        </Block>
      </Block> */}
      <Block padding={10}>
        <Block marginTop={sizes.sm} flex={0}>
          <Input
            value={userData?.driverID}
            onChangeText={(text) => {
              setUserData({...userData, driverID: text});
            }}
            placeholder="Driver Id"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block marginTop={sizes.sm} flex={0}>
          <Input
            value={userData?.firstname}
            onChangeText={(text) => {
              setUserData({...userData, firstname: text});
            }}
            placeholder="First Name"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block marginTop={sizes.sm} flex={0}>
          <Input
            value={userData?.lastname}
            onChangeText={(text) => {
              setUserData({...userData, lastname: text});
            }}
            placeholder="Last Name"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block marginTop={sizes.sm} flex={0}>
          <Input
            value={userData?.Liecence}
            onChangeText={(text) => {
              setUserData({...userData, Liecence: text});
            }}
            placeholder="Liscence number"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block marginTop={sizes.sm} flex={0}>
          <View
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <Text>Ride with Video</Text>
            <Switch
              trackColor={{false: '#767577', true: colors.lightgreen}}
              thumbColor={isEnabled ? colors.lightgreen : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </Block>
        {isEnabled ? (
          <>
            <Block marginTop={sizes.sm} flex={0}>
              <Input
                value={videoLength}
                onChangeText={(val) => {
                  setVideoLength(val);
                }}
                placeholder="Length of single Video chunk"
                keyboardType="number-pad"
                style={{
                  backgroundColor: colors.lightwhite,
                  borderRadius: 5,
                  height: 50,
                }}
              />
            </Block>
            <Block marginTop={sizes.sm} flex={0}>
              <Input
                value={numberOfVideo}
                onChangeText={(val) => {
                  setNumberOfVideo(val);
                }}
                placeholder="Videos to be Uploaded"
                style={{
                  backgroundColor: colors.lightwhite,
                  borderRadius: 5,
                  height: 50,
                }}
              />
            </Block>
          </>
        ) : null}
        {/* <Block marginTop={sizes.sm} flex={0}>
          <Input
            placeholder="Adress"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block marginTop={sizes.sm} flex={0}>
          <Input
            placeholder="dd/mm/yyyy"
            style={{
              backgroundColor: colors.lightwhite,
              borderRadius: 5,
              height: 50,
            }}
          />
        </Block>
        <Block
          row
          height={70}
          flex={0}
          justify={'center'}
          align={'center'}
          marginTop={sizes.sm}>
          {Gender.map((item, index) => {
            return (
              <Button
                height={50}
                width={'30%'}
                color={color === item ? colors.lightgreen : colors.purewhite}
                margin={5}
                onPress={() => {
                  setColor(item);
                }}>
                <Text color={color === item ? colors.white : colors.dark}>
                  {item}
                </Text>
              </Button>
            );
          })}
        </Block>  */}
        <Button
          onPress={handleUpdate}
          color={colors.lightgreen}
          marginTop={sizes.md}
          height={50}>
          <Text color={colors.white}>Update</Text>
        </Button>
      </Block>
    </Block>
  );
};

export default Profile;
