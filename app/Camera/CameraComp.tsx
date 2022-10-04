import {
  Button,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

type Props = {};

const CameraComp = (props: Props) => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const [camPermission, setCamPermisison] = useState<boolean>(false);
  const [storagePermission, setStoragePermisison] = useState<boolean>(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    _checkCamPermission();
  }, []);

  const _checkCamPermission = async (): Promise<void> => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      setCamPermisison(cameraPermission === 'authorized');
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

  const _getStoragePermission = async (): Promise<void> => {
    try {
      const newStoragePermission = await PermissionsAndroid.request(permission);
      setStoragePermisison(newStoragePermission === 'granted');
    } catch (error) {
      throw error;
    }
  };

  const _clickPhoto = async () => {
    try {
      const photo = await camera.current?.takeSnapshot({
        quality: 85,
        skipMetadata: true,
      });

      const hasPermission = await PermissionsAndroid.check(permission);

      if (hasPermission && photo?.path) {
        const res = await CameraRoll.saveToCameraRoll(photo?.path);
        console.log(res);
        console.log('SAVED');
      } else {
        await _getStoragePermission();
        if (photo?.path) {
          const res = await CameraRoll.saveToCameraRoll(photo?.path);
          console.log(res);
          console.log('SAVED');
        }
      }

      console.log(photo);
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={styles.main}>
      {!camPermission && (
        <Button title="Get Cam Permisison" onPress={_getCamPermission} />
      )}
      {camPermission && (
        <>
          {device ? (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                ref={camera}
                isActive={true}
                photo={true}
              />
              <TouchableOpacity
                style={styles.circluarButton}
                onPress={_clickPhoto}
              />
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </>
      )}
    </View>
  );
};

export default CameraComp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  circluarButton: {
    backgroundColor: '#fff',
    height: 80,
    width: 80,
    borderRadius: 100 / 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
});
