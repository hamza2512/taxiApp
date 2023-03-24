import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('@userdata', JSON.stringify(value));
  } catch (e) {
    return e;
  }
};
export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@userdata');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
    return e;
  }
};
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};
