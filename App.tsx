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
  dsn: 'https://8c4513ba4f0848c6bcc0472f89c5a790@o4504991605129216.ingest.sentry.io/4504991950831616',
  tracesSampleRate: 1.0,
  enableNative: false,
});

//xileyi2116@jthoven.com

function App() {
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
