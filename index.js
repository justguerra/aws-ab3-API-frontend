import { Amplify, Auth, UserPool } from "aws-amplify";
import awsconfig from "./amplify-config";

const usuario = "rodrigoguerra";
const senha = "Qwert!321";
const mail = "test@foxway.com.br";
let user = "";
//Enviar dados de Login para o Cognito Auth
//Salvar Tokens de Autenticacacao
//Usar Tokens para acessar o API Gateway
//Visualizar dados da API Gateway

(async () => {
  const form = document.querySelector(".form");
  const email = document.querySelector(".email");
  const password = document.querySelector(".password");
  const addDogBtn = document.querySelector(".add-dog-btn");
  const addCatBtn = document.querySelector(".add-cat-btn");
  let loginStatusForm = document.querySelector(".login-status-form");
  let formStatus = 0;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    document.querySelector(".cat").classList.add("invisible");
    document.querySelector(".dog").classList.add("invisible");
    document.querySelector(".user-mod").classList.add("invisible");

    loginStatusForm.innerHTML = "";
    try {
      updateMsg("Descobrindo de qual empresa você pertence!");
      tenantVerifier(email.value, password.value);
      //const res = await signIn(cognitoUser, email.value, password.value);
    } catch (e) {
      console.log("Login fail. Error: ", e);
    }
  });

  addDogBtn.addEventListener("click", async (event) => {
    try {
      apiAccess(false, "dogs");
      //const res = await signIn(cognitoUser, email.value, password.value);
    } catch (e) {
      console.log("Login fail. Error: ", e);
    }
  });

  addCatBtn.addEventListener("click", async (event) => {
    try {
      apiAccess(false, "cats");
      //const res = await signIn(cognitoUser, email.value, password.value);
    } catch (e) {
      console.log("Login fail. Error: ", e);
    }
  });
})();

async function signIn(email, senha) {
  try {
    console.log(email.replace(/[@.]/g, "|"));
    user = await Auth.signIn(email.replace(/[@.]/g, "|"), senha);
    // const user = await Auth.signIn("rodrigoguerra", "Qwert!321");
    console.log(user.signInUserSession.accessToken);
    console.log(user.signInUserSession.idToken);
    console.log(user.signInUserSession.refreshToken);
    console.log("logou com o usuário:" + user.username);
    console.log("logou com o usuário:" + user.attributes.email);
    console.log("logou com o usuário:" + user.pool.userPoolId);
    updateMsg("Logado com sucesso!", "success");
    updateMsg("Seu usuário é " + user.username);

    console.log(user);
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
    let jwt = user.signInUserSession.accessToken.jwtToken;
    apiAccess(jwt, "dogs");
    apiAccess(jwt, "users");

    apiAccess(jwt, "cats");
  } catch (error) {
    console.log("error signing in", error);
    updateMsg("Sua senha está errada", "text-danger");
  }
}
async function tenantVerifier(email, senha) {
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
    updateMsg("Sua empresa é a " + data.Item.domain);
    updateMsg("Tenant 00" + data.Item.tenant_id);

    console.log(newAmplifyConfig);
    Amplify.configure(newAmplifyConfig);
    return newAmplifyConfig;
  }

  let cognitoTenant = await fetchAsyncGetCognito(finalURL);

  signIn(email, senha);
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

function updateMsg(msg, style) {
  const loginStatusForm = document.querySelector(".login-status-form");
  loginStatusForm.insertAdjacentHTML(
    "beforeend",
    '<li class="' +
      "list-group-item list-group-item-" +
      (style || "light") +
      '" >' +
      msg +
      "</li>"
  );
}

async function apiAccess(JWT, path) {
  let primeiroAcesso = true;
  if (JWT == false) {
    JWT = user.signInUserSession.accessToken.jwtToken;
    primeiroAcesso = false;
    console.log(JWT);
  }
  const urlAPI = "https://y5xre89ndl.execute-api.us-east-1.amazonaws.com/prod/";
  try {
    let response = await fetch(urlAPI + path, {
      headers: {
        "Content-Type": "application/json",
        Authorization: JWT,
      },
    });
    let data = await response.json();
    if (response.status == 403) {
      updateMsg("Pacote " + path + " não adquirido!", "warning ");
      updateMod(path, data, false);
    } else if (response.status == 200) {
      if (primeiroAcesso) {
        updateMsg("Pacote " + path + " adquirido!", "info ");
      }
      console.log(data);
      updateMod(path, data, true);
    }
  } catch (error) {
    console.log("error acessando backend in " + (path || "users"), error);
    updateMsg("Erro acessando o pacote " + path + " !", "danger ");
  }
}

function updateMod(path, data, hasAccess) {
  switch (path) {
    case "cats":
      updateCat(data, hasAccess);
      break;
    case "users":
      updateUsers(data, hasAccess);
      break;

    case "dogs":
      updateDog(data, hasAccess);
      break;
    default:
      break;
  }
}

function updateCat(data, hasAccess) {
  const catElement = document.querySelector(".cat");
  const catH6 = document.querySelector(".cat h6");
  const catDiv = document.querySelector(".cat div");
  const catBtn = document.querySelector(".cat button");
  catElement.classList.remove("invisible");

  if (hasAccess) {
    catBtn.classList.remove("invisible");
    catElement.classList.remove("sem-acesso");

    catH6.innerHTML = "Gatos, veja fotos de gatos.";

    const catElemt = document.querySelector(".catImage");
    let catUrl = "https://cataas.com" + data.url;
    catElemt.insertAdjacentHTML(
      "beforeend",
      '<img src="' + catUrl + '" alt="" >'
    );
  } else {
    catElement.classList.add("sem-acesso");

    catBtn.classList.add("invisible");
    catH6.innerHTML = "Sem Acesso";
    catDiv.innerHTML = "";
  }
}

function updateUsers(data, hasAccess) {
  const userElement = document.querySelector(".usr-table");
  const userDiv = document.querySelector(".user-mod");
  userElement.innerHTML = "";
  userDiv.classList.remove("invisible");

  if (hasAccess) {
    userElement.innerHTML = "";
    userElement.insertAdjacentHTML(
      "beforeend",
      " <thead><td>Nome</td><td>Email</td></thead>"
    );
    for (let i = 0; i < data.length; i++) {
      userElement.insertAdjacentHTML(
        "beforeend",
        "<tr>" +
          "<td>" +
          data[i].name +
          "</td>" +
          "<td>" +
          data[i].email +
          "</td>" +
          "</tr>"
      );
    }
  } else {
    userElement.classList.add("invisible");
    userElement.innerHTML = "";
  }
}

function updateDog(data, hasAccess) {
  const dogElement = document.querySelector(".dog");
  const dogH6 = document.querySelector(".dog h6");
  const dogDiv = document.querySelector(".dog div");
  const dogBtn = document.querySelector(".dog button");

  dogElement.classList.remove("invisible");

  if (hasAccess) {
    dogH6.innerHTML = "O melhor amigo do homem.";
    const dogElement = document.querySelector(".dogImage");
    let dogUrl = data.message;
    dogElement.insertAdjacentHTML(
      "beforeend",
      '<img src="' + dogUrl + '" alt="" >'
    );
  } else {
    dogBtn.classList.add("invisible");
    dogElement.classList.add("sem-acesso");
    dogH6.innerHTML = "Sem Acesso";
    dogDiv.innerHTML = "";
  }
}
