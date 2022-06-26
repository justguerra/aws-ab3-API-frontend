import { Amplify, Auth } from "aws-amplify";
import awsconfig from "./amplify-config";
Amplify.configure(awsconfig);

const usuario = "rodrigoguerra";
const senha = "Qwert!321";
const mail = "test@foxway.com.br";

//Todo implementar Interface
//Todo Implementar Lambda
//Carregar Amplify Config de Acordo
//Enviar dados de Login para o Cognito Auth
//Salvar Tokens de Autenticacacao
//Usar Tokens para acessar o API Gateway
//Visualizar dados da API Gateway

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
cognitoUser = signIn();

cognitoUser.then();

async function signIn() {
  try {
    const user = await Auth.signIn("rodrigoguerra", "Qwert!321");
    console.log(user.signInUserSession.accessToken);
    console.log(user.signInUserSession.idToken);
    console.log(user.signInUserSession.refreshToken);
    console.log("logou com o usuário:" + user.username);
    console.log("logou com o usuário:" + user.attributes.email);
    console.log("logou com o usuário:" + user.pool.userPoolId);
    console.log(user);
  } catch (error) {
    console.log("error signing in", error);
  }
}
