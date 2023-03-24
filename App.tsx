import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import { Provider } from 'react-redux';

import TabNavigator from './src/navigation/TabNavigator';
import { store } from './Redux/Store';
import { Context } from './src/components/Context';

export default function App() {
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
