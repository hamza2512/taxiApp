import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useGetHistoryListMutation} from '../../../Redux/TaxiApi';
import moment from 'moment';
// import * as Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../Redux/Store';

const Rides = () => {
  const userData = useSelector((state: RootState) => state.data.userData);
  const {colors, sizes, icons} = useTheme();
  const navigation = useNavigation();
  const [gethistory, {data: RideData, error, isLoading}] =
    useGetHistoryListMutation();
  const [arr, setArr] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      console.warn(userData?.driverID);
      gethistory(userData?.driverID);
      // sort()
    }, []),
  );
  useEffect(() => {
    if (!RideData) return;
    // console.log('riders', RideData);
    var array = RideData?.map((val) => val);
    array?.sort(
      (a, b) => new Date(a['rideStarted']) - new Date(b['rideStarted']),
    );
    array?.reverse();
    setArr(array);

    console.log('first element: ' + array[0]?.rideStarted);
    console.log(
      'moment data1: ' +
        moment(array[0]?.rideStarted).format('dd MM yyyy hh:mm:ss'),
    );
  }, [RideData]);

  const Feature = () => {
    Alert.alert('Update', 'This feature will be availble soon', [{text: 'OK'}]);
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      resizeMode="stretch"
      source={require('../../../assets/Home.png')}>
      <Block
        row
        flex={0}
        padding={20}
        justify="space-between"
        align="center"
        marginTop={sizes.sm}>
        {/* <TouchableOpacity
          onPress={() => {
            console.log('add'), Feature();
          }}>
          <Image
            style={{marginTop: sizes.s}}
            source={require('../../../assets/Shape.png')}
          />
        </TouchableOpacity> */}
        <View></View>
        <Block
          gray
          justify="center"
          align="center"
          padding={sizes.s}
          flex={0.04}
          height={30}
          radius={sizes.xl}
          align="center">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('profile');
            }}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/Avatar.png')}
              style={{
                height: 32,
                width: 32,
                borderRadius: 20,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </Block>
      </Block>
      <Block>
        {isLoading ? (
          <ActivityIndicator
            size={'large'}
            animating={isLoading}
            color={colors.lightgreen}
          />
        ) : (
          <Block flex={1} scroll>
            {arr?.map((item, index) => {
              console.log('ride: ' + item?.rideStarted);
              console.log('rideId: ' + item?.id);

              var start = new Date(item?.rideStarted);
              var end = new Date(item?.rideEnded);

              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Ridedetails', {rideId: item?.id});
                  }}>
                  <Block padding={20}>
                    <Block
                      height={110}
                      flex={0}
                      radius={12}
                      color={colors.seagreen}>
                      <Block align="flex-end" flex={0.3}>
                        <Block
                          color={colors.date}
                          align="center"
                          radius={8}
                          width={'45%'}>
                          <Text bold p>
                            {new Date(item?.rideStarted).toLocaleDateString()}
                          </Text>
                        </Block>
                      </Block>
                      <Block
                        row
                        paddingRight={20}
                        paddingLeft={20}
                        paddingTop={5}>
                        <Block>
                          <Text size={sizes.sm} bold>
                            Ride # {`${index + 1}`.padStart(6, '0')}
                          </Text>
                          <Text size={sizes.sm} bold marginTop={5}>
                            {start.getUTCHours() +
                              ':' +
                              GetMinutesHelper(start.getUTCMinutes())}{' '}
                            —
                            {end.getUTCHours() +
                              ':' +
                              GetMinutesHelper(end.getUTCMinutes())}
                          </Text>
                        </Block>
                        <Block align="flex-end">
                          <Image source={icons.path} />
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </TouchableOpacity>
              );
            })}
          </Block>
        )}
      </Block>
    </ImageBackground>
  );
};

function GetMinutesHelper(minutes: any) {
  if (minutes < 10) {
    return '0' + minutes;
  } else return minutes;
}

export default Rides;
