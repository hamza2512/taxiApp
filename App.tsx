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
// import * as Sentry from 'sentry-expo';
import * as Sentry from '@sentry/react-native';

function App() {
  // useEffect(() => {
  //   activateKeepAwake();
  //   return () => {
  //     deactivateKeepAwake();
  //   };
  // }, []);

  // Sentry.init({
  //   dsn: 'https://f83f767ec70043ac9139303414317a08@o4504954336837632.ingest.sentry.io/4504954344767488',
  //   enableInExpoDevelopment: true,
  //   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  // });

  // Sentry.init({
  //   dsn: 'https://f83f767ec70043ac9139303414317a08@o4504954336837632.ingest.sentry.io/4504954344767488',
  //   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  //   // We recommend adjusting this value in production.
  //   tracesSampleRate: 1.0,
  //   enableNative: false,
  // });
  // "transformIgnorePatterns": [
  //   "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)"
  // ]
  Sentry.init({
    dsn: 'https://2474b003c1b1486c87d550a3678a091b@o4504988646244352.ingest.sentry.io/4504988651618304',
    tracesSampleRate: 1.0,
    enableNative: false,
  });
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
    // <Sentry.Native.TouchEventBoundary>
    <Provider store={store}>
      <Context>
        <DataProvider>
          <AppNavigation />
        </DataProvider>
      </Context>
    </Provider>
    // </Sentry.Native.TouchEventBoundary>
  );
}

// export default Sentry.Native.wrap(App);
// export default Sentry.wrap(App);
// export default App;
export default Sentry.wrap(App);
