import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify'; 
import LoginComponent from './LoginComponent';
import MainPage from './MainPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(_user => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/main" /> : <LoginComponent />} />
        <Route path="/main" element={<MainPage />} />
        {/* Redirect to /main if no matching route and user is logged in */}
        <Route path="*" element={isLoggedIn ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
