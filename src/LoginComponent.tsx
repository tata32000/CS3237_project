import { signInWithGoogle } from './authService';

const LoginComponent = () => {
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      // User is signed in, you can redirect or enable access
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <button 
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
