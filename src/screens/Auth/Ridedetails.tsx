import {Image, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';
import MapView, {Callout, Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useGetRideDetailsMutation} from '../../../Redux/TaxiApi';
import moment from 'moment';
import {string} from 'yup';

const Ridedetails = ({route}) => {
  const {colors, sizes, icons} = useTheme();
  const navigation = useNavigation();
  const [startedlat, setStartedlat] = useState();
  const [startedlong, setStartedlong] = useState();
  const [endedlat, setEndedlat] = useState();
  const [endedlong, setEndedlong] = useState();
  const [regionState, setRegionState] = useState();
  const {rideId} = route.params;
  const [startGeoLocation, setstartGeolocation] = useState({});
  const [rideDetails, {data, error}] = useGetRideDetailsMutation();
  // console.log('rideId', rideId);
  const lat = data?.endGeoLocation;
  // console.log('Details', lat);
  // console.log('error', error);
  // var start = JSON.stringify(data?.startGeoLocation)
  // var ans = JSON.parse(start?.replace("lat",'"lat"').replace("long",'"long"'))
  // console.log(JSON.parse(data));
  // var start = data?.startGeoLocation.splice(3,10)
  // console.log(data?.startGeoLocation);
  const parseLocation = (location: string) => {
    return JSON.parse(
      location?.replace('lat', '"lat"').replace('long', '"long"'),
    );
  };
  // console.log('Type of Data', typeof data);
  let res = {};
  for (const key in data) {
    res[key] = data[key];
  }
  // console.log('============Res========================');
  // console.log(res);
  // console.log('====================================');
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

  // console.log(startLat, ' ', startLong);
  // console.log(typeof startLat, ' ', typeof startLong);
  // console.log(endLat, ' ', endLong);
  // console.log(typeof endLat, ' ', typeof endLong);
  useEffect(() => {
    if (!startLong || !startLat || !endLat || !endLong) return;
    setStartedlong(startLong);
    setStartedlat(startLat);
    setEndedlat(endLat);
    setEndedlong(endLong);
  }, [startLat, startLong, endLat, endLong]);

  useEffect(() => {
    rideDetails(rideId);
  }, [rideId]);

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
      <Block flex={0.7}>
        {startedlat && startedlong ? (
          <MapView
            style={{height: 500}}
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
        style={{zIndex: 2, borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
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
            // onPress={() => {
            //   navigation.navigate('Video', {url: data?.videoLinks});
            // }}
          >
            <Text color={colors.white}>Play Recording</Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Ridedetails;
