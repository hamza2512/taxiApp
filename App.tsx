import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {Provider} from 'react-redux';

import TabNavigator from './src/navigation/TabNavigator';
import {store} from './Redux/Store';
import {Context} from './src/components/Context';
import {useKeepAwake} from 'expo-keep-awake';

export default function App() {
  // useEffect(() => {
  //   activateKeepAwake();
  //   return () => {
  //     deactivateKeepAwake();
  //   };
  // }, []);
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
