import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {Provider} from 'react-redux';

import TabNavigator from './src/navigation/TabNavigator';
import {store} from './Redux/Store';
import {Context} from './src/components/Context';
import {useKeepAwake} from 'expo-keep-awake';
import VersionCheck from 'react-native-version-check-expo';

export default function App() {
  // useEffect(() => {
  //   activateKeepAwake();
  //   return () => {
  //     deactivateKeepAwake();
  //   };
  // }, []);
  useEffect(() => {
    VersionCheck.needUpdate({
      depth: 2,
      currentVersion: '1.0',
      latestVersion: '2.0',
    }).then((res) => {
      console.log(res);
      if (res?.isNeeded) {
        alert('Please update your Application');
      }
      // false; because first two fields of current and the latest versions are the same as "0.1".
    });
  }, []);
  useKeepAwake();
  return (
    <Provider store={store}>
      <Context>
        <DataProvider>
          <AppNavigation />
        </DataProvider>
      </Context>
    </Provider>
  );
}
