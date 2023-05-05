/*eslint-disable no-bitwise */

import {useMemo, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {
  BleManager,
  Device,
  Characteristic,
  BleError,
} from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import * as Location from 'expo-location';
import base64 from 'react-native-base64';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): boolean;
  allDevices: Device[];
  connectToDevice: (deviceId: Device) => Promise<void>;
  connectedDevice: Device | null;
}

// const serviceId = '00001801-0000-1000-8000-00805f9b34fb';
// const characteristicId = '00002a05-0000-1000-8000-00805f9b34fb';
const serviceId = '0000fe59-0000-1000-8000-00805f9b34fb';
const characteristicId = '8ec90003-f315-4f60-9fb8-838830daea50';

const LocationPermission = async () => {
  let {status} = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Update', 'Permission to Access location is Denied', [
      {text: 'OK'},
    ]);
    return false;
  }
  return 'granted';
};
function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const requestAndroid31Permissions = async () => {
    const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
      //Permissions for Access Location
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Fine Location',
        message: 'App requires to Access Location',
        buttonPositive: 'OK',
      },
    );

    const bluetoothScanPermissions = await PermissionsAndroid.request(
      //Permissions to Scan
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Scan Permission',
        message: 'App requires Bluetooth Permission',
        buttonPositive: 'OK',
      },
    );
    const bluetoothConnectPermissions = await PermissionsAndroid.request(
      //Permissions for Bluetooth Connect
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Scan Permission',
        message: 'App requires Bluetooth Connecting',
        buttonPositive: 'OK',
      },
    );

    // console.log(
    //   'inside request Android31 Bluetooth Permissions ---',
    //   bluetoothScanPermissions,
    //   bluetoothConnectPermissions,
    //   bluetoothFineLocationPermissions,
    // );
    return (
      bluetoothScanPermissions === 'granted' &&
      bluetoothConnectPermissions === 'granted' &&
      bluetoothFineLocationPermissions === 'granted'
    );
  };

  const requestPermissions = async () => {
    console.log('Inside requestPermission');
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          //Permissions for Access Location
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Fine Location',
            message: 'App requires to Access Location',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionGranted =
          await requestAndroid31Permissions();
        console.log('isGranted status', isAndroid31PermissionGranted);
        return isAndroid31PermissionGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert(JSON.stringify(error.message));
        return false;
      }

      if (device && device.name?.includes('KBPro')) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
    return true;
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      const services = await device.services();
      //Service Discovering
      services.forEach((service) => {
        // Get an array of all the characteristics associated with this service
        console.log('SERVICE UUIDS', service.uuid);

        service
          .characteristics()
          .then((characteristics) => {
            // Loop through the array of characteristics
            characteristics.forEach((characteristic) => {
              // Access the UUID of each characteristic
              console.log('Charasterisc', characteristic.uuid);
              // console.log(
              //   'isCharacteristicNotifiable',
              //   characteristic.isNotifiable,
              // );
              // console.log(
              //   'isCharacteristicNotifying',
              //   characteristic.isNotifying,
              // );
              // console.log(
              //   'isCharacteristic indication',
              //   characteristic.isIndicatable,
              // );
            });
          })
          .catch((error) => {
            console.log('^^^^^^^^^^^^ERROR^^^^^^^^^^^^', error);
          });
      });
      // console.log('====================================');
      // console.log(res);
      // console.log(services);
      // console.log('ALl services!!!!', deviceConnection);
      // console.log('====================================');
      Alert.alert(`Your connected to device ${device.localName}`);
      //Start Streaming
      startStreamingData(deviceConnection);
    } catch (error) {
      bleManager.stopDeviceScan();
      console.log('ERROR IN DEVICE CONNECTION -------------', error);
      Alert.alert(JSON.stringify(error?.message));
    }
  };
  const startStreamingData = async (device: Device) => {
    if (device) {
      // const val = await device.readCharacteristicForService(
      //   HEART_RATE_UUID,
      //   characteristicId,
      //   device.id,
      // );
      // device.character
      // console.log('myreadable value : ', device);
      device.monitorCharacteristicForService(
        // bleManager.monitorCharacteristicForDevice(
        // device.id,
        serviceId,
        characteristicId,
        onHeartRateUpdate,
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    // console.log('====================================');
    // console.log(characteristic?.isNotifying);
    // console.log('====================================');

    // bleManager.logLevel().then((res) => {
    //   console.log('===============Log=====================');
    //   console.log(res);
    //   console.log('====================================');
    // });
    // console.log('================CHaracterishtisifas====================');
    // console.log(characteristic);
    // console.log('====================================');
    try {
      console.log(
        '================characteristic .descriptors====================',
        characteristic,
      );
      if (error) {
        console.log('ERROR---', error);
        return -1;
      } else if (!characteristic?.value) {
        console.log('No Data was recieved');
        return -1;
      }
      const charac = characteristic.value.toString();
      console.log('%%%%%%%%%%', charac);
      console.log('===================Raw Data=================');
      const rawData = base64.decode(characteristic.value);
      console.log(rawData);
      console.log('====================================');
    } catch (error) {
      console.log('++++++ ERROR +++ in CATCH++++++', error);
    }
    // let innerHeartRate: number = -1;

    // const firstBitValue: number = Number(rawData) & 0x01;

    // if (firstBitValue === 0) {
    //   innerHeartRate = rawData[1].charCodeAt(0);
    // } else {
    //   innerHeartRate =
    //     Number(rawData[1].charCodeAt(0) << 8) +
    //     Number(rawData[2].charCodeAt(2));
    // }

    // setHeartRate(innerHeartRate);
  };

  // const startStreamingData = async (device: Device) => {
  //   if (device) {
  //     device.monitorCharacteristicForService();
  //   } else {
  //     console.log("No Device Connected");
  //   }
  // };

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
  };
}
export default useBLE;
