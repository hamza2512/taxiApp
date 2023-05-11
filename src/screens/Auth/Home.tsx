import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ToastAndroid,
  Modal,
  Alert,
} from 'react-native';
import {Block, Button, Input, Text} from '../../components';

import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import {useTheme} from '../../hooks';
import {useNavigation} from '@react-navigation/native';
import * as Location from 'expo-location';
import {
  useCreateRideMutation,
  useEndRideMutation,
  useGetHistoryListMutation,
  useSendRideVideosMutation,
  useGetActiveRideMutation,
} from '../../../Redux/TaxiApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  setColor,
  setmodal,
  setRecordingStart,
} from '../../../Redux/CounterSlice';
import {RootState} from '../../../Redux/Store';
import {clearAll} from '../../AsyncStorage';
import {Camera} from 'expo-camera';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as FileSystem from 'expo-file-system';
import {Audio} from 'expo-av';
import {useIsFocused} from '@react-navigation/native';
// import * as Sentry from 'sentry-expo';
import * as Sentry from '@sentry/react-native';

const Home = () => {
  const userData = useSelector((state: RootState) => state.data.userData);
  const {colors, sizes, icons} = useTheme();
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rideId, setRideId] = useState();
  const [deviceId, setDeviceId] = useState();
  const navigation = useNavigation();
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);

  //Sentry Testing
  // try {
  //   // your code

  //   console.log(Hello);
  // } catch (error) {
  //   console.log('Testing ', error);
  //   // Sentry.Native.captureException(error);
  // }
  // throw new Error('My first Sentry error22!');

  const isRecordingAllowed = useSelector(
    (state: RootState) => state.data.driveWithVedio,
  );
  const isFocused = useIsFocused();
  const modal = useSelector((state: RootState) => state.data.modal);
  // const color = useSelector((state:RootState)=>state.data.color)

  // const [createRide,{data}] = useGetHistoryListMutation()
  const formatNumber = (number) => `0${number}`.slice(-2);

  const getRemaining = useCallback((time) => {
    const mins = Math.floor(time / 60);
    const hour = Math.floor(mins / 60);
    const secs = time - mins * 60;
    return {
      hour: formatNumber(hour),
      mins: mins <= 59 ? formatNumber(mins) : 0,
      secs: formatNumber(secs),
    };
  }, []);
  const {mins, secs, hour} = getRemaining(remainingSecs);

  const [createRide, {data, isLoading, error: startedRide}] =
    useCreateRideMutation();
  const [EndRide, {data: endride, error: RideEnddata}] = useEndRideMutation();
  const [SendRideVideos] = useSendRideVideosMutation();
  const [GetActiveRide, ...values] = useGetActiveRideMutation();
  const [rideEndData, setRideEndData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!RideEnddata && !rideEndData) return;

    EndToastFunction();
  }, [RideEnddata, rideEndData]);
  useEffect(() => {
    if (!startedRide && !rideId) return;

    startToastFunction();
  }, [startedRide, rideId]);

  // useEffect(() => {
  //   if (!startedRide?.data && !rideId) return;
  //   // const rideid = startedRide?.data.split(':');
  //   console.log('=============Ride Id=======================');
  //   // console.log(startedRide?.data);
  //   console.log(rideId);
  //   console.log('====================================');
  //   // setRideId(rideid[1].trim());
  // }, [startedRide, rideId]);

  useEffect(() => {
    if (count === 2) {
      setCount(0);
      endlocation();
    }
  }, [count]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs) => remainingSecs + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const driverLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      // console.error('Permission to access location was denied');
      Alert.alert('Update', 'Permission to Access location is Denied', [
        {text: 'OK'},
      ]);
      return false;
    }

    // console.log('=================INSIDE location===================', status);

    let loc = await Location.getCurrentPositionAsync({
      accuracy: 4,
    });
    console.log('location=-----------------', loc);
    setLocation(loc);

    return loc.coords;
  };
  useLayoutEffect(() => {
    driverLocation();
  }, [isFocused, startedRide]);

  useEffect(() => {
    if (!visible) {
      setRemainingSecs(0);
      setIsActive(false);
    }
  }, [visible]);

  const startlocation = useCallback(
    (val) => {
      console.log('location logging');
      console.log('----', val?.latitude);

      createRide({
        driverID: userData?.driverID,
        latitude: val?.latitude,
        longitude: val?.longitude,
      }).then((item) => {
        reference.current = true;
        setRideId(item?.data?.rideId);
        setDeviceId(item?.data?.deviceId);
        // deviceId = item?.data?.deviceId;
        taskId = item?.data?.rideId;

        dispatch(setRecordingStart(true));
      });
      // setLocation(null);
    },
    [location],
  );

  useEffect(() => {
    if (!visible) return;
    driverLocation().then((val) => startlocation(val));
    // if (!location) {
    //   driverLocation().then((val) => startlocation());
    // } else {
    //   console.log('----===+++');
    //   startlocation();
    // }
  }, [visible]);

  const endlocation = () => {
    // console.log('Inside of EndLocation function ');
    if (rideId) {
      // console.log('Inside of EndLocation function if condition');
      // const data = {
      //   location: location?.coords,
      //   rideId: rideId,
      // };
      let data;
      driverLocation().then((val) => {
        data = {
          location: val,
          rideId: rideId,
        };

        EndRide({data}).then((res) => {
          setRideEndData(res);
          console.log('End Ride Response', res);
        });
        // setLocation(null);
      });
      // console.log('===============EnD Ride=====================');
      // console.log(data);
      // console.log(rideId);
      // console.log('====================================');
      // EndRide({data}).then((res) => {
      //   setRideEndData(res);
      //   // console.log('End Ride Response', res);
      // });
    }
  };

  const startToastFunction = useCallback(() => {
    ToastAndroid.show('Ride Started', ToastAndroid.SHORT);
  }, []);
  const EndToastFunction = useCallback(() => {
    if (RideEnddata || rideEndData) {
      ToastAndroid.show('Ride Ended', ToastAndroid.SHORT);
    }
  }, [RideEnddata, rideEndData]);
  if (modal) {
    Alert.alert('Update', 'This feature will be availble soon', [
      {text: 'OK', onPress: () => dispatch(setmodal(false))},
    ]);
  }
  const Feature = () => {
    Alert.alert('Update', 'This feature will be availble soon', [{text: 'OK'}]);
  };

  const cameraRef = useRef(null);
  const recording = useSelector((state: RootState) => state.data.recording);
  const reference = useRef(true);

  const frontCamera = Camera.Constants.Type.front;

  const startRecording = async () => {
    // console.log('------Inside of Start Recording---');
    try {
      const {status} = await Camera.requestCameraPermissionsAsync();
      const audioPersmission = (await Audio.requestPermissionsAsync()).status;
      if (status === 'granted' && audioPersmission === 'granted') {
        if (!frontCamera) {
          console.log('Front camera not found----------------');
          return;
        }

        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['480p'],
          maxDuration: 30,
          mute: false,
        });
        // console.log('URI Vedio', video.uri);
        saveVideo(video.uri);
      } else {
        // console.log('Camera permission not granted');
        Alert.alert('Error', 'Camera permission not granted', [{text: 'OK'}]);
      }
    } catch (error) {
      console.log('Inside catch of startRecording');
      console.log(error);
    }
  };

  let temp = 0;
  let body: any[] = [];

  const saveVideo = async (uri) => {
    // console.log('Inside Save Vedio');
    temp = temp + 1;

    const fsRead = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    await FileSystem.deleteAsync(uri, {idempotent: true});

    const newPath = {
      fileName: `${temp}_${deviceId}_${rideId}.mp4`,
      videoFileInBase64: fsRead,
    };

    body.push(newPath);
    // console.log('============Reference ========================');
    // console.log(reference.current);
    // console.log('====================================');
    if (body.length >= 2 || reference.current == false) {
      try {
        // console.log(
        //   '=================Inside Api calling of Sending Videos===================',
        //   body.length,
        // );

        const res = await SendRideVideos(body);
        // console.log('=======Send Vedio response=============================');
        // console.log(res);
        if (res?.data) {
          body = [];

          if (recording === false) {
            // console.log(
            //   '=================Settings vedios Empty===================',
            // );
            temp = 0;
          }
        }
      } catch (error) {
        // console.log('=============Send Vedio Error=======================');
        console.log(error);
        // console.log('====================================');
      }
    }
  };

  const recordingHalt = () => {
    reference.current = false;
    // console.log('Inside Halt before reference', reference.current);

    cameraRef.current.stopRecording();

    // console.log('Inside After before', recording);
  };

  useEffect(() => {
    let interval: any;
    if (isRecordingAllowed) {
      if (recording) {
        // console.log('Inside When Recording true');
        startRecording();
        interval = setInterval(() => {
          startRecording();
        }, 32000);
      } else {
        recordingHalt();
      }
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handlePress = () => {
    // toggle()
    setIsActive(!isActive);
    setVisible(!visible);
    setCount((count) => count + 1);
    if (!recording == false) {
      dispatch(setRecordingStart(!recording));
    }
    // endlocation()
  };
  return (
    <ImageBackground
      style={{flex: 1}}
      resizeMode="stretch"
      source={require('../../../assets/Home.png')}>
      <Block safe flex={1}>
        {isFocused && (
          <Camera
            ref={cameraRef}
            style={{height: 1, width: 1}}
            type={frontCamera}
          />
        )}
        <Block
          row
          flex={0}
          padding={20}
          justify="space-between"
          align="center"
          marginTop={sizes.sm}>
          <View></View>
          <Block
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
        <Block
          padding={20}
          marginHorizontal={'5%'}
          flex={0.57}
          marginTop={20}
          radius={sizes.l}>
          <TouchableOpacity onPress={handlePress}>
            <Image source={visible ? icons.stop : icons.play} />
          </TouchableOpacity>
          {visible ? (
            <Block
              flex={0}
              position={'absolute'}
              bottom={-65}
              width={'80%'}
              height={80}
              right={'15%'}
              style={{
                zIndex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              color={colors.white}>
              {startedRide || rideId ? (
                <Text
                  color={colors.red}
                  style={{
                    alignSelf: 'center',
                  }}
                  h1>
                  {hour} : {mins} : {secs}
                </Text>
              ) : null}
            </Block>
          ) : null}
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default Home;
