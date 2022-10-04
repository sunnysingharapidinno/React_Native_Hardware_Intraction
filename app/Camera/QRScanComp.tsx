import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

type Props = {};

const QRScanComp = (props: Props) => {
  const [camPermission, setCamPermisison] = useState<boolean>(false);
  const [micPermission, setMicPermisison] = useState<boolean>(false);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const [scanError, setScanError] = useState<string | null>(null);

  const devices = useCameraDevices();

  const device = devices.back;

  useEffect(() => {
    _checkCamPermission();
    _checkMicPermission();
  }, []);

  useEffect(() => {
    if (barcodes) {
      _decodeBarcode();
    }
  }, [barcodes]);

  const _decodeBarcode = () => {
    if (barcodes?.[0]?.content) {
      try {
        console.log(barcodes[0].content);
      } catch (error) {
        setScanError('Invalid QR code');
      }
    } else {
      setScanError('Invalid QR code');
    }
  };

  const _checkCamPermission = async (): Promise<void> => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      setCamPermisison(cameraPermission === 'authorized');
    } catch (error) {
      throw error;
    }
  };

  const _checkMicPermission = async (): Promise<void> => {
    try {
      const micPermission = await Camera.getMicrophonePermissionStatus();
      setMicPermisison(micPermission === 'authorized');
    } catch (error) {
      throw error;
    }
  };

  const _getCamPermission = async (): Promise<void> => {
    try {
      const newCameraPermission = await Camera.requestCameraPermission();
      setCamPermisison(newCameraPermission === 'authorized');
    } catch (error) {
      throw error;
    }
  };

  const _getMicPermission = async (): Promise<void> => {
    try {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      setMicPermisison(newMicrophonePermission === 'authorized');
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={styles.main}>
      {!camPermission && (
        <Button title="Get Cam Permisison" onPress={_getCamPermission} />
      )}
      {/* <View style={styles.margin} />
      {!micPermission && (
        <Button title="Get Mic Permisison" onPress={_getMicPermission} />
      )} */}

      {camPermission && (
        <>
          {device ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </>
      )}
    </View>
  );
};

export default QRScanComp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  margin: {
    margin: 10,
  },
});
