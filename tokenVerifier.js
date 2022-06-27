import { CognitoJwtVerifier } from "aws-jwt-verify";

(async) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_XcJ6ltIFs", // mandatory, can't be overridden upon calling verify
    tokenUse: "id", // needs to be specified here or upon calling verify
    clientId: "5r6qgleec4p4q4j255e42mj2e1", // needs to be specified here or upon calling verify
    //   groups: "admins", // optional
    //   graceSeconds: 0, // optional
    //   scope: "my-api/read", // optional
    customJwtCheck: (payload, header, jwk) => {}, // optional
  });
  function checa(params) {
    const jwt =
      "eyJraWQiOiJIS0VPMStsQkhieDZHUG5KeXUwd2NseXFDWW1hdXc3MHY2UXhQY1wvYWxTOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyODZkNjVmNC0yYzJlLTQ4ZTEtYTk3Ni1mNzk5NTFkYzYyMTUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWGNKNmx0SUZzIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6ImV1fHJvZHJpZ29ndWVycmF8Y29tfGJyIiwiY3VzdG9tOmdlbnJlIjoiamF6eiIsIm9yaWdpbl9qdGkiOiI5ZGFiZjA2Ni0wY2E2LTQzMjYtYmRjMi04Zjc1Nzc4M2VlMjYiLCJhdWQiOiI1cjZxZ2xlZWM0cDRxNGoyNTVlNDJtajJlMSIsImV2ZW50X2lkIjoiMDFlM2YzOGQtZWRiZC00NGM5LWI0ZGEtNzBhNDE5OGE3YjI0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NTYyNTU5MTQsInBob25lX251bWJlciI6Iis1NTExOTkzMTMyMDY2IiwiZXhwIjoxNjU2MjU5NTE0LCJpYXQiOjE2NTYyNTU5MTQsImp0aSI6ImE1N2U1NzYwLTk3MzUtNDljYy04MTgzLWZmNWQyNmU0MWRjOCIsImVtYWlsIjoiZXVAcm9kcmlnb2d1ZXJyYS5jb20uYnIifQ.tvyVS2IQr7HoY_BIRmFoDeIYIuw3CWZcosMeJP8guynbQJ5_5mhb8FPnPNhjSbrZVTpOqzcI6jvhjw2r6Jj3h_BcJDNM63CYRzf8-3IxhIoyawwDu1R7WcCFdaWySbyeg-gtobtPCfHFa3MMuIOhYc33qCRVZvfWQ2dEGdYatW5J6VTRoUmnbIuiGP_foT22Dd-Qy8hkfAJ_JBaOOA_O0KP5Y3scg0tEEJjUEF9ZgbMpwVm5n1mw_Wozvtuak1Vv644qwbJ-cdknr87hb8pbYUUXtlJPobTbMMi6gLzuOboxcB_lj92ITL3k611bxuSJqiPW4bB4lWlkJ9I6qrvl0g";

    try {
      const payload = verifier.verify(jwt, {
        groups: "users", // Cognito groups overridden: should be users (not admins)
      });
      console.log("Token is valid. Payload:", payload);
    } catch {
      console.log("Token not valid!");
    }
  }

  checa();
};
