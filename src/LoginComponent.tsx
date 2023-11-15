import { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import awsConfig from './aws-exports';

Amplify.configure(awsConfig);

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
          onClick={() => Auth.federatedSignIn()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
