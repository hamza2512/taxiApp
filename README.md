#CDK-SoftUI
Inspired by SoftUI

npx expo start --tunnel

node version compatible : 16.17.1

<!-- Sentry.io -->

Accocunt Credentails

email : fobacas122@duiter.com
password: ytrewq1234

<!-- Commented code of Background Service  Home.tsx-->

  <!-- BackgroundFetch.registerTaskAsync(
    'recordVideo',
    {
      minimumInterval: 5,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async () => {
      await startRecording();
      return BackgroundFetch.Result.NewData;
    },
  );

  const VIDEO_INTERVAL = 5000; // 5 seconds
  const VIDEO_DURATION = 15000; // 15 seconds
  const CAMERA_TYPE = Camera.Constants.Type?.front;
  const CAMERA_QUALITY = Camera.Constants.VideoQuality['480p'];

  async function startRecording() {
    console.log('Inside Start Recording');
    const camera = await Camera.getAvailableCameraTypesAsync();
    if (camera.includes(CAMERA_TYPE)) {
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      if (cameraPermission.granted) {
        const cameraInstance = await Camera.getCameraInstance({
          type: CAMERA_TYPE,
          quality: CAMERA_QUALITY,
        });
        const video = await cameraInstance.recordAsync({
          maxDuration: VIDEO_DURATION,
        });
        console.log('============Video========================');
        console.log(video);
        console.log('====================================');
        const fileUri = video.uri;
        await FileSystem.moveAsync({
          from: fileUri,
          to: `${FileSystem.cacheDirectory}/video-${Date.now()}.mp4`,
        });
      }
    }
  }

  TaskManager.defineTask('recordVideo', async () => {
    console.log('Inside TaskManager Define Task');
    await startRecording();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  BackgroundFetch.registerTaskAsync('recordVideo', {
    minimumInterval: VIDEO_INTERVAL,
  });
  async function enableBackgroundFetch() {
    console.log('Inside TaskManager Enable Fetch');
    await BackgroundFetch.setMinimumIntervalAsync(VIDEO_INTERVAL);
  }
  enableBackgroundFetch(); -->
