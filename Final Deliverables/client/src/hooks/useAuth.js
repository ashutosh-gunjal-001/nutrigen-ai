import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, token } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated: isAuthenticated || !!localStorage.getItem('token'),
    isLoading,
    error,
    token: token || localStorage.getItem('token')
  };
};

export default useAuth;