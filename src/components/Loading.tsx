import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from '../hooks';

const Loading = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={colors.lightgreen}
        size={Platform.OS === 'ios' ? 'large' : 80}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
});

export default Loading;
