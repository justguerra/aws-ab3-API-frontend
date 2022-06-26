// This file is used for manual configuration of the Amplify library.
// When Amplify is used in conjunction with the Amplify CLI toolchain or AWS Mobile Hub to manage backend resources,
// an aws-exports.js file is auto-generated and can be used instead of the below to automatically configure the Amplify library.
// In this workshop, we are using the Amplify client libraries without the CLI toolchain so you should edit this file manually.

const awsConfig = {
  Auth: {
    identityPoolId: "us-east-1:46a2761b-18ab-4f94-9377-480dc05877c7", // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
    region: "us-east-1", // example: 'us-east-2'
    userPoolId: "us-east-1_GG5D1CX5N", // example: 'us-east-2_teEUQbkUh'
    userPoolWebClientId: "3ubei9t3cc8lij4p3kombb9juf", // example: '3k09ptd8kn8qk2hpk07qopr86'
  },
  API: {
    endpoints: [
      {
        name: "WildRydesAPI",
        endpoint: "https://wcdscorz61.execute-api.us-east-1.amazonaws.com/prod", // example: 'https://u8swuvl00f.execute-api.us-east-2.amazonaws.com/prod'
        region: "us-east-1", // example: 'us-east-2'
      },
    ],
  },
  Storage: {
    bucket: "serverless-idm-backend-profilepicturesbucket-1q45c5ma27svr", //example: 'wildrydesbackend-profilepicturesbucket-1wgssc97ekdph'
    region: "us-east-1", // example: 'us-east-2'
  },
};

export default awsConfig;
