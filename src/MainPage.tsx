import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { signOutUser } from './authService'; 

const MainPage = () => {
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
