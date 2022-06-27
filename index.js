import { Amplify, Auth, UserPool } from "aws-amplify";
import awsconfig from "./amplify-config";

const usuario = "rodrigoguerra";
const senha = "Qwert!321";
const mail = "test@foxway.com.br";

//Enviar dados de Login para o Cognito Auth
//Salvar Tokens de Autenticacacao
//Usar Tokens para acessar o API Gateway
//Visualizar dados da API Gateway

(async () => {
  const form = document.querySelector(".form");
  const email = document.querySelector(".email");
  const password = document.querySelector(".password");
  let formStatus = 0;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      tenantVerifier(email.value);
      //const res = await signIn(cognitoUser, email.value, password.value);
    } catch (e) {
      console.log("Login fail. Error: ", e);
    }
  });
})();

async function tenantVerifier(email) {
  console.log("Inicia Verificacao do Tenant");
  lambdaCognitoTenantUrl =
    "https://0ywa8nsqe7.execute-api.us-east-1.amazonaws.com/cognitoTenant?email=";

  let finalURL = lambdaCognitoTenantUrl + email;

  async function fetchAsyncGetCognito(url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let newAmplifyConfig = awsconfig;

    newAmplifyConfig.Auth.identityPoolId = data.Item.identityPoolId;
    newAmplifyConfig.Auth.region = data.Item.region;
    newAmplifyConfig.Auth.userPoolId = data.Item.userPoolId;
    newAmplifyConfig.Auth.userPoolWebClientId = data.Item.userPoolWebClientId;
    console.log("Retorna Amplify Config Atualizado");
    console.log(newAmplifyConfig);
    Amplify.configure(newAmplifyConfig);
    return newAmplifyConfig;
  }

  let cognitoTenant = await fetchAsyncGetCognito(finalURL);

  signIn(email);
}

async function signUp() {
  try {
    const { user } = await Auth.signUp({
      username: usuario,
      password: senha,
      attributes: {
        email: mail, // optional
        // phone_number, // optional - E.164 number convention
        // // other custom attributes
        // 'custom:favorite_flavor': 'Cookie Dough'  // custom attribute, not standard
      },
    });
    console.log(user);
  } catch (error) {
    console.log("error signing up:", error);
  }
}
// cognitoUser = signIn();

// cognitoUser.then();

async function signIn(email) {
  try {
    console.log(email.replace(/[@.]/g, "|"));
    const user = await Auth.signIn(email.replace(/[@.]/g, "|"), "Qwert!23");
    // const user = await Auth.signIn("rodrigoguerra", "Qwert!321");
    console.log(user.signInUserSession.accessToken);
    console.log(user.signInUserSession.idToken);
    console.log(user.signInUserSession.refreshToken);
    console.log("logou com o usuário:" + user.username);
    console.log("logou com o usuário:" + user.attributes.email);
    console.log("logou com o usuário:" + user.pool.userPoolId);
    console.log(user);
    user.refreshToken;
    let user2 = Object.getPrototypeOf(user);

    let clientID = user.pool.userPoolId;
    let dominio = email.split("@")[1].replace(/[@.]/g, "|");
    let JWTlocal =
      localStorage[
        "CognitoIdentityServiceProvider." +
          clientID +
          "." +
          dominio +
          ".accessToken"
      ];
    apiAccess(user.signInUserSession.accessToken.jwtToken);
  } catch (error) {
    console.log("error signing in", error);
  }
}

async function apiAccess(JWT) {
  const urlAPI =
    "https://y5xre89ndl.execute-api.us-east-1.amazonaws.com/prod/users";
  try {
    let response = await fetch(urlAPI, {
      headers: {
        "Content-Type": "application/json",
        Authorization: JWT,
      },
    });

    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("error acessando backend in", error);
  }
}
