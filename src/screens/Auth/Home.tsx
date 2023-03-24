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

const Home = () => {
  const userData = useSelector((state: RootState) => state.data.userData);
  const {colors, sizes, icons} = useTheme();
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rideId, setRideId] = useState();
  const navigation = useNavigation();
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  // const [recording, setRecording] = useState(false);
  // const [vedioIndex, setVedioIndex] = useState(0);
  // const [vedioBase64, setVedioBase64] = useState<any>([]);
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
  const [GetActiveRide] = useGetActiveRideMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!RideEnddata) return;
    EndToastFunction();
  }, [RideEnddata]);
  useEffect(() => {
    if (!startedRide) return;

    startToastFunction();
  }, [startedRide]);

  useEffect(() => {
    if (!startedRide?.data) return;
    const rideid = startedRide?.data.split(':');
    setRideId(rideid[1].trim());
  }, [startedRide]);

  // console.log("Reduxvalue",modal);
  useEffect(() => {
    if (count === 2) {
      setCount(0);
      endlocation();
    }
  }, [count]);

  useEffect(() => {
    let interval = null;
    // console.log("isActive",isActive);
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs) => remainingSecs + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log('log test');
      console.log('log test 2');

      console.log('location: ', await Location.getCurrentPositionAsync({}));
      let location = await Location.getCurrentPositionAsync({});
      console.log('log test 3');

      console.log('location: ', location);
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (!visible) {
      setRemainingSecs(0);
      setIsActive(false);
    }
  }, [visible]);

  const startlocation = useCallback(() => {
    console.log('location logging');
    console.log(location);

    const res = createRide({
      driverID: userData?.driverID,
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    });
  }, [location]);

  useEffect(() => {
    if (!visible) return;
    else {
      startlocation();
    }
  }, [visible]);

  const endlocation = () => {
    if (rideId) {
      const data = {
        location: location?.coords,
        rideId: rideId,
      };
      EndRide({data});
    }
  };

  const startToastFunction = useCallback(() => {
    ToastAndroid.show('Ride Started', ToastAndroid.SHORT);
  }, []);
  const EndToastFunction = useCallback(() => {
    if (RideEnddata) {
      ToastAndroid.show('Ride Ended', ToastAndroid.SHORT);
    }
  }, [RideEnddata]);
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
  // reference.current = recording;

  const frontCamera = Camera.Constants.Type.front;
  let deviceId: String;
  let taskId: String;
  const startRecording = async () => {
    console.log('------Inside of Start Recording---');
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
          maxDuration: 15,
          mute: false,
        });
        console.log('URI Vedio', video.uri);
        saveVideo(video.uri);
      } else {
        console.log('Camera permission not granted');
      }
    } catch (error) {
      console.log('Inside catch of startRecording');
      console.log(error);
    }
  };
  // const sendingVedios = async () => {
  //   try {
  //     if (body.length == 0) {
  //       return;
  //     }
  //     console.log('=================Inside Api calling===================');

  //     const res = await SendRideVideos(body);
  //     console.log('=======Send Vedio response=============================');
  //     console.log(res);
  //     if (res?.data) {
  //       body = [];
  //       console.log(
  //         '=================Settings vedios Empty===================',
  //       );
  //       if (recording === false) {
  //         temp = 0;
  //       }
  //     }
  //   } catch (error) {
  //     console.log('=============Send Vedio Error=======================');
  //     console.log(error);
  //     console.log('====================================');
  //   }
  // };
  let temp = 0;
  let body: any[] = [];

  const saveVideo = async (uri) => {
    // console.log('================Inside of SAve Vedio====================');

    temp = temp + 1;

    const fsRead = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    const newPath = {
      fileName: `${temp}_${deviceId}_${taskId}`,
      videoFileInBase64: fsRead,
    };

    body.push(newPath);
    // console.log('Recording Status', reference.current);
    // console.log('Recording Status', recording);
    if (body.length >= 2 || reference.current == false) {
      // await sendingVedios();
      try {
        // console.log('=================Inside Api calling===================');

        const res = await SendRideVideos(body);
        // console.log('=======Send Vedio response=============================');
        console.log(res);
        if (res?.data) {
          body = [];
          // console.log(
          //   '=================Settings vedios Empty===================',
          // );
          if (recording === false) {
            temp = 0;
          }
        }
      } catch (error) {
        console.log('=============Send Vedio Error=======================');
        console.log(error);
        console.log('====================================');
      }
    }

    // const filename = uri.split('/').pop();
    // const path = `${FileSystem.cacheDirectory}${temp}${filename}`;
    // await FileSystem.copyAsync({
    //   from: uri,
    //   to: path,
    // });
    // console.log(`Video saved to ${path}`);
  };

  // BackgroundFetch.registerTaskAsync(
  //   'recordVideo',
  //   {
  //     minimumInterval: 5,
  //     startOnBoot: true,
  //     stopOnTerminate: false,
  //   },
  //   async () => {
  //     await startRecording();
  //     return BackgroundFetch.Result.NewData;
  //   },
  // );

  // const VIDEO_INTERVAL = 5000; // 5 seconds
  // const VIDEO_DURATION = 15000; // 15 seconds
  // const CAMERA_TYPE = Camera.Constants.Type?.front;
  // const CAMERA_QUALITY = Camera.Constants.VideoQuality['480p'];

  // async function startRecording() {
  //   console.log('Inside Start Recording');
  //   const camera = await Camera.getAvailableCameraTypesAsync();
  //   if (camera.includes(CAMERA_TYPE)) {
  //     const cameraPermission = await Camera.getCameraPermissionsAsync();
  //     if (cameraPermission.granted) {
  //       const cameraInstance = await Camera.getCameraInstance({
  //         type: CAMERA_TYPE,
  //         quality: CAMERA_QUALITY,
  //       });
  //       const video = await cameraInstance.recordAsync({
  //         maxDuration: VIDEO_DURATION,
  //       });
  //       console.log('============Video========================');
  //       console.log(video);
  //       console.log('====================================');
  //       const fileUri = video.uri;
  //       await FileSystem.moveAsync({
  //         from: fileUri,
  //         to: `${FileSystem.cacheDirectory}/video-${Date.now()}.mp4`,
  //       });
  //     }
  //   }
  // }

  // TaskManager.defineTask('recordVideo', async () => {
  //   console.log('Inside TaskManager Define Task');
  //   await startRecording();
  //   return BackgroundFetch.BackgroundFetchResult.NewData;
  // });

  // BackgroundFetch.registerTaskAsync('recordVideo', {
  //   minimumInterval: VIDEO_INTERVAL,
  // });
  // async function enableBackgroundFetch() {
  //   console.log('Inside TaskManager Enable Fetch');
  //   await BackgroundFetch.setMinimumIntervalAsync(VIDEO_INTERVAL);
  // }
  // enableBackgroundFetch();

  const recordingHalt = () => {
    // console.log('Inside Halt before');
    reference.current = false;
    cameraRef.current.stopRecording();

    // console.log('Inside After before', recording);
  };

  const getActiveRidesForDevice = async () => {
    const driverID = userData?.driverID;
    const {data} = await GetActiveRide(driverID);
    if (data?.istaskActive) {
      reference.current = true;
      startRecording();
      deviceId = data?.deviceId;
      taskId = data?.taskId;
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecordingAllowed) {
      if (recording) {
        getActiveRidesForDevice();
        // startRecording();
        interval = setInterval(() => {
          // startRecording();
          getActiveRidesForDevice();
        }, 23000);
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

    dispatch(setRecordingStart(!recording));
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
            // onRecordingStatusUpdate={handleRecordingStatusUpdate}
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
        <Block padding={20} flex={0.57} marginTop={20} radius={sizes.l}>
          <TouchableOpacity onPress={handlePress}>
            <Image source={visible ? icons.stop : icons.play} />
          </TouchableOpacity>
          {visible ? (
            <Block
              flex={0}
              position={'absolute'}
              bottom={-65}
              width={'70%'}
              height={80}
              style={{zIndex: 1, alignSelf: 'center', justifyContent: 'center'}}
              color={colors.white}>
              {startedRide ? (
                <Text color={colors.red} style={{alignSelf: 'center'}} h1>
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
