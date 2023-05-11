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

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://13bf389c954e44ba837795f5ce56e528@o4505166195392512.ingest.sentry.io/4505166196965376',
  tracesSampleRate: 1.0,
  enableNative: false,
});

function App() {
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

// export default App;
export default Sentry.wrap(App);
