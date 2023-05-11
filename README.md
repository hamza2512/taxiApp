#CDK-SoftUI
Inspired by SoftUI

npx expo start --tunnel

node version compatible : 16.17.1

<!-- eas build -p android --profile preview -->

// "eas": {
// "projectId": "2528fdb7-dfed-49ca-8043-c8b96ebc1990"
// }

<!-- Sentry.io -->

Accocunt Credentails

email : viyed65244@glumark.com
password: viyed65244@glumark.com

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

<!-- Driver ID
04bb0098-2ce6-41d2-a7b7-e33fbef7f1ac -->

//End point

<!-- Request the Vedios -->
<!-- https://spark-v2-fun.azurewebsites.net/api/RequestVideoMerging?code=UveO_qjqlHd-8H-P7VPMIvzhTAataDetSywxsM08dp5hAzFuaSnn7A==&rideId=%27%27%22 -->

<!-- Get Vedios -->
<!-- https://spark-v2-fun.azurewebsites.net/api/GetRideDetails?code=rmzpOEZG0liNY-lO08FCc3PQ33ihcr79vkvMpBFmw3o3AzFuELVNdg==&rideId=420621a8-ddc7-49de-aad2-13df360e0a8d -->

<!-- //
https://spark-v2-fun.azurewebsites.net/api/GetVideosForRide?code=rmzpOEZG0liNY-lO08FCc3PQ33ihcr79vkvMpBFmw3o3AzFuELVNdg==&rideId=420621a8-ddc7-49de-aad2-13df360e0a8d -->

<!-- api/RequestVideoMerging?ride=lkjhlkjhlkj&status=dfd -->
