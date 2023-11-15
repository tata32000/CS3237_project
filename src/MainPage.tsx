import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { signOutUser } from './authService'; 
// import mqtt, { MqttClient } from 'mqtt';
// import CERT from './certs/cert';
// import KEY from './certs/privateKey';
// import CA from './certs/rootCA';
import { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';
import { Hub } from 'aws-amplify';

const MainPage = () => {
  const [doorState, setDoorState] = useState('Unknown');

  useEffect(() => {
    PubSub.addPluggable(
      new AWSIoTProvider({
        aws_pubsub_region: 'ap-southeast-2',
        aws_pubsub_endpoint:
          'wss://a3ir1nqy23cnya-ats.iot.ap-southeast-2.amazonaws.com/mqtt'
      })
    );

    PubSub.subscribe('esp32/door').subscribe({
      next: (data) => {
        console.log('Message received', data);
        setDoorState('test');
      },
      error: (error) => console.error(error),
      complete: () => console.log('Done'),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.listen('pubsub', (data: any) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        const connectionState = payload.data.connectionState as ConnectionState;
        console.log(connectionState);
      }
    });

    return () => {
      PubSub.removePluggable('AWSIoTProvider'); // Disconnect client when the component unmounts
    };
  }, []);

  const publishMessage = async (action: string) => {
    await PubSub.publish('esp32/door', { action });
  };

  const handleLock = () => {
    publishMessage('lock');
  };

  const handleUnlock = () => {
    publishMessage('unlock');
  };

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'User'); // Fallback to 'User' if name is not available
    }
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Main Page</h1>
        <p className="mb-4">Hi {userName}!</p> 
        <p>Will see some picture here</p>
        <div className="text-center">
        <h2 className="mb-4">Door State: {doorState}</h2>
        <button 
          onClick={handleLock}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Lock
        </button>
        <button 
          onClick={handleUnlock}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Unlock
        </button>
      </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MainPage;
