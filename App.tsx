import React, {type PropsWithChildren} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import CameraComp from './app/Camera/CameraComp';
import QRScanComp from './app/Camera/QRScanComp';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <QRScanComp /> */}
      <CameraComp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
