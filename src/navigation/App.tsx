import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
// import Menu from "./Menu";
import {useData, ThemeProvider, TranslationProvider} from '../hooks';
import Main from './Main';
import TabNavigator from './TabNavigator';
import {getData} from '../AsyncStorage';
import {useDispatch} from 'react-redux';
import {setDriverId, setUSerData} from '../../Redux/CounterSlice';
export default () => {
  const dispatch = useDispatch();
  const {isDark, theme, setTheme} = useData();
  useEffect(() => {
    getUserData();
    return () => {};
  }, []);
  const getUserData = async () => {
    const userData: any = await getData();
    if (userData) {
      let data = JSON.parse(userData);
      dispatch(setUSerData(data));
      dispatch(setDriverId(data?.driverID));
    }
    // console.log(dt);
  };
  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Main />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
