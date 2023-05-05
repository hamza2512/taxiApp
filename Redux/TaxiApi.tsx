import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

//todo. code management
const code = 'rSCx9rjDpZUHn9uhwVSBwvgiJfm9iq9QGVSH7lkEGoD0AzFuIT6UYQ==';
const videoRequestCode =
  'UveO_qjqlHd-8H-P7VPMIvzhTAataDetSywxsM08dp5hAzFuaSnn7A==';
const endcode = 'Ng6qZmBRCUa6woMonddV5SIQu-3Y8C0odTaye7IBIW_vAzFuYYfHeA==';
const historycode = 'n3EE-WgHmbuDMaSqWW6od96ALPPtjNxNfV1GCQUswQIfAzFueYrsLw==';
const DriverId = '04bb0098-2ce6-41d2-a7b7-e33fbef7f1ac';
const RidedetailsCode =
  '0KVId2Yu7PDNSSaeKHn_V9FSmVKd7npohc9WAARxnDXGAzFuSFz3rA==';
('https://spark-v2-fun.azurewebsites.net/api');
// Define a service using a base URL and expected endpoints
export const TaxiApi = createApi({
  reducerPath: 'TaxiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://spark-v2-fun.azurewebsites.net/api',
  }),
  endpoints: (builder) => ({
    // getPokemonByName: builder.query({
    //   query: (name) => `pokemon/${name}`,
    // }),
    CreateRide: builder.mutation({
      query: (data) => {
        const {driverID, latitude, longitude} = data;
        console.log('latitude id: ' + latitude);
        console.log('longitude id: ' + latitude);
        console.log('Data Object', JSON.stringify(data));
        return {
          url: `/CreateRide?code=${code}&driverId=${driverID}&geoLocation={lat:${latitude},long:${longitude}}`,
          method: 'GET',
        };
      },
    }),
    SendRideVideos: builder.mutation({
      query: (data) => {
        return {
          url: `/StoreMp4FileToBlobStorage?code=${code}`,
          method: 'POST',
          body: data,
          responseHandler: (response) => response.text(),
        };
      },
    }),
    GetActiveRide: builder.mutation({
      query: (driverID) => {
        console.log('====================================');
        console.log('Given Driver Id', driverID);
        console.log('====================================');
        return {
          url: `GetActiveRidesForDevice?code=${code}&driverId=${driverID}`,
          method: 'GET',
          responseHandler: (response) => response.text(),
        };
      },
    }),
    EndRide: builder.mutation({
      query: ({data}) => {
        try {
          const {location, rideId} = data;
          console.log('jami', location.latitude, rideId, location.longitude);
          return {
            url: `/EndRide?code=${code}&geoLocation={lat:${location.latitude},long:${location.longitude}}&rideId=${rideId}`,
            method: 'GET',
            responseHandler: (response) => response.text(),
          };
        } catch (error) {
          console.log('Inside Error of EndRide', error);
          return {data: error};
        }
      },
    }),
    GetHistoryList: builder.mutation({
      query: (DriverId) => {
        try {
          console.log('called', DriverId);
          console.log(`/GetRidesForDriver?code=${code}&driverId=${DriverId}`);
          return {
            url: `/GetRidesForDriver?code=${code}&driverId=${DriverId}`,
            method: 'GET',
          };
        } catch (error) {
          return {data: error};
        }
      },
    }),
    GetRideDetails: builder.mutation({
      query: (rideId) => {
        try {
          console.log('called the ride details view');

          return {
            url: `/GetRideDetails?code=${code}&rideId=${rideId}`,
            method: 'GET',
          };
        } catch (error) {
          console.log('error when fetching', error);
          return {data: error};
        }
      },
    }),
    RequestVideo: builder.mutation({
      query: (rideId: any) => {
        try {
          console.log('called +++++========');

          return {
            url: `/RequestVideoMerging?code=${videoRequestCode}&rideId=${rideId}`,
            method: 'GET',
            responseHandler: (response) => response.text(),
          };
        } catch (error) {
          console.log('error when fetching', error);
          return {data: error};
        }
      },
    }),
    GetRideVideo: builder.mutation({
      query: (rideId: any) => {
        try {
          console.log('called +++++========');

          return {
            url: `/RequestVideoMerging?code=${code}&rideId=${rideId}`,
            method: 'GET',
            responseHandler: (response) => response.text(),
          };
        } catch (error) {
          console.log('error when fetching', error);
          return {data: error};
        }
      },
    }),
  }),
});
// SendRideVideos
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateRideMutation,
  useGetHistoryListMutation,
  useEndRideMutation,
  useGetRideDetailsMutation,
  useSendRideVideosMutation,
  useGetActiveRideMutation,
  useRequestVideoMutation,
  useGetRideVideoMutation,
} = TaxiApi;
