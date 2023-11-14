import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { signOutUser } from './authService'; 
import mqtt, { MqttClient } from 'mqtt';
import CERT from './certs/cert';
import KEY from './certs/privateKey';
import CA from './certs/rootCA';

const MainPage = () => {
  const [doorState, setDoorState] = useState('Unknown');
  const [client, setClient] = useState<MqttClient>(null as unknown as MqttClient);

  useEffect(() => {

    const mqttClient = mqtt.connect(
      'wss://a3ir1nqy23cnya-ats.iot.ap-southeast-2.amazonaws.com', 
    {
      key:  KEY,
      cert: CERT,
      ca: [ CA ],
      protocolId: 'MQTT',
      protocolVersion: 5,
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      mqttClient.subscribe('esp32/door');
    });

    mqttClient.on('error', (error) => {
      console.error('Connection error:', error);
    });
    
    mqttClient.on('offline', () => {
      console.log('Client went offline');
    });    

    mqttClient.on('message', (topic, message) => {
      const doorState = JSON.parse(message.toString())['state'];
      if (topic === 'esp32/door') {
        setDoorState(doorState.toString());
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end(); // Disconnect client when the component unmounts
    };
  }, []);

  const publishMessage = (action: string) => {
    if (client) {
      const message = JSON.stringify({ 'state': action });
      client.publish('esp32/door', message);
    }
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
