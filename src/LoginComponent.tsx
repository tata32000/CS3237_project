import { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import awsConfig from './aws-exports';

// copied from serviceWorker.js to know if it is localhost or not
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// by default, say it's localhost
const oauth = {
  domain: 'xxx.auth.us-east-2.amazoncognito.com',
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'http://localhost:3000/',
  redirectSignOut: 'http://localhost:3000/',
  responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
};

// if not, update the URLs
if (!isLocalhost) {
  oauth.redirectSignIn = 'https://master.xxx.amplifyapp.com/';
  oauth.redirectSignOut = 'https://master.xxx.amplifyapp.com/';
}

// copy the constant config (aws-exports.js) because config is read only.
const configUpdate = awsConfig;
// update the configUpdate constant with the good URLs
configUpdate.oauth = oauth;
// Configure Amplify with configUpdate
Amplify.configure(configUpdate);

const LoginComponent = () => {

  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data }}) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch(error) {
      console.error(error);
      console.log("Not signed in");
    }
  };

  console.log(user);
  console.log(customState)

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <button 
          onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google })}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
