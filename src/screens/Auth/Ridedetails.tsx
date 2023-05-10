import {ActivityIndicator, Image, View} from 'react-native';
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';
import MapView, {Callout, Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  useGetRideDetailsMutation,
  useGetRideVideoMutation,
  useRequestVideoMutation,
} from '../../../Redux/TaxiApi';
import moment from 'moment';
import {PROVIDER_GOOGLE} from 'expo';

const Ridedetails = ({route}) => {
  const {colors, sizes, icons} = useTheme();
  const navigation = useNavigation();
  const [btnText, setBtnText] = useState<string>('Request Recording');
  const [startedlat, setStartedlat] = useState();
  const [startedlong, setStartedlong] = useState();
  const [endedlat, setEndedlat] = useState();
  const [endedlong, setEndedlong] = useState();
  const [regionState, setRegionState] = useState();
  const {rideId} = route.params;
  const [startGeoLocation, setstartGeolocation] = useState({});

  // Api's Mutations
  const [rideDetails, {data, error}] = useGetRideDetailsMutation();
  const [videoStatus, {data: status, error: statusError, isLoading}] =
    useRequestVideoMutation();
  const [
    fetchVideo,
    {data: getVideo, error: videoError, isLoading: videoLoading},
  ] = useGetRideVideoMutation();

  ///////
  // console.log('rideId', rideId);
  const lat = data?.endGeoLocation;
  const mapRef = useRef(MapView);

  const parseLocation = (location: string) => {
    return JSON.parse(
      location?.replace('lat', '"lat"').replace('long', '"long"'),
    );
  };
  useLayoutEffect(() => {
    rideDetails(rideId);
  }, []);
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  let res = {};
  for (const key in data) {
    res[key] = data[key];
  }
  var startLat = +data?.startGeoLocation
    ?.replace(/\"/g, '')
    ?.replace(/{/g, '')
    ?.replace(/}/g, '')
    ?.replace(/,/g, ':')
    ?.split(':')[1];
  var startLong = +data?.startGeoLocation
    ?.replace(/\"/g, '')
    ?.replace(/{/g, '')
    ?.replace(/}/g, '')
    ?.replace(/,/g, ':')
    ?.split(':')[3];
  var endLat = +data?.endGeoLocation
    ?.replace(/\"/g, '')
    ?.replace(/{/g, '')
    ?.replace(/}/g, '')
    ?.replace(/,/g, ':')
    ?.split(':')[1];
  var endLong = +data?.endGeoLocation
    ?.replace(/\"/g, '')
    ?.replace(/{/g, '')
    ?.replace(/}/g, '')
    ?.replace(/,/g, ':')
    ?.split(':')[3];

  useEffect(() => {
    const stat = data?.rideStatus;

    switch (stat) {
      case 'NotRequested':
        setBtnText('Request Recording');
        break;
      case 'VideoMergeInProgress':
        // code block
        setBtnText('Merging in Progress');
        break;
      case 'MergeComplete':
        // code block
        setBtnText('Get Recording');
        break;
      default:
        setBtnText('Request Video');
        break;
    }
    // if (data?.rideStatus === 'VideoMergeInProgress') {
    // console.log('=============Get Video=======================');
    // console.log('Ride details', data);
    // console.log('====================================');
    //   setBtnText('Play Recording');
    // }
  }, [data]);

  const handleButtonPress = () => {
    if (btnText === 'Request Recording') {
      // setBtnText('Merging in Progress');
      videoStatus(rideId).then(() => setBtnText('Merging in Progress')); //Request for Videos
    } else if (btnText === 'Get Recording') {
      fetchVideo(rideId).then(() => setBtnText('Play Recording')); //Get the Videos
    } else if (btnText === 'Play Recording') {
      navigation.navigate('Video', {url: getVideo});
    }
    // else if (btnText === 'Merge in Progress') {
    //   setBtnText('Play Recording');
    // }
  };

  useEffect(() => {
    if (!startLong || !startLat || !endLat || !endLong) return;
    setStartedlong(startLong);
    setStartedlat(startLat);
    setEndedlat(endLat);
    setEndedlong(endLong);
  }, [startLat, startLong, endLat, endLong]);

  return (
    <Block safe flex={1}>
      <Block
        flex={0.1}
        color={colors.white}
        row
        align="center"
        marginTop={10}
        paddingTop={10}
        paddingLeft={20}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={icons.back} />
        </TouchableOpacity>
        <Block align="center">
          <Text h4>Ride Details</Text>
        </Block>
      </Block>
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          animating={isLoading}
          color={colors.lightgreen}
        />
      ) : (
        <>
          <Block flex={0.7}>
            {startedlat && startedlong ? (
              <MapView
                style={{height: 500}}
                provider={PROVIDER_GOOGLE}
                ref={mapRef}
                initialRegion={{
                  latitude: startedlat,
                  longitude: startedlong,
                  // latitude: 37.78825,
                  // longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                region={regionState}
                onRegionChangeComplete={(res) => {
                  // console.log('region coordinates', res);
                  setRegionState(res);
                }}>
                <Marker
                  coordinate={{latitude: startedlat, longitude: startedlong}}
                  pinColor={'red'}>
                  <Callout>
                    <Text>Starting point</Text>
                  </Callout>
                </Marker>
                <Marker
                  coordinate={{latitude: endedlat, longitude: endedlong}}
                  pinColor={'blue'}>
                  <Callout>
                    <Text>Ending point</Text>
                  </Callout>
                </Marker>
              </MapView>
            ) : null}
          </Block>
          <Block
            height={250}
            width={'100%'}
            color={colors.white}
            position="absolute"
            bottom={0}
            style={{
              zIndex: 2,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}>
            <Block row paddingLeft={20} paddingTop={10} flex={0.2}>
              <Image source={icons.red} />
              <Block paddingLeft={10}>
                <Text p bold>
                  Ride Start At
                </Text>
                <Text>
                  {moment(data?.rideStarted).format('DD MMMM YYYY')}{' '}
                  {moment(data?.rideStarted).format('HH:MM:SS')}
                </Text>
              </Block>
            </Block>
            <Block row paddingLeft={20} paddingTop={10} flex={0.2}>
              <Image style={{marginTop: 5}} source={icons.blue} />
              <Block paddingLeft={10}>
                <Text p bold>
                  Ride Ends At
                </Text>
                <Text>
                  {moment(data?.rideEnded).format('DD MMMM YYYY')}{' '}
                  {moment(data?.rideEnded).format('HH:MM:SS')}
                </Text>
              </Block>
            </Block>
            <Block row paddingLeft={20} paddingTop={10} flex={0.2}>
              <Image style={{marginTop: 8}} source={icons.timer} />
              <Block paddingLeft={10}>
                <Text p bold>
                  Recording Duration
                </Text>
                <Text>{data?.duration}</Text>
              </Block>
            </Block>
            <Block flex={0.4}>
              <Button
                height={50}
                width={'50%'}
                style={{alignSelf: 'center'}}
                marginTop={20}
                color={colors.lightgreen}
                disabled={btnText === 'Merging in Progress' ? true : false}
                onPress={handleButtonPress}>
                <Text color={colors.white}>{btnText}</Text>
              </Button>
            </Block>
          </Block>
        </>
      )}
    </Block>
  );
};

export default Ridedetails;
