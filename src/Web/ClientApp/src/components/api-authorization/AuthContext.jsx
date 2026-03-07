import { createContext, useContext, useState, useEffect } from 'react';
import { UsersClient, LoginRequest, MembersClient, RegisterMemberCommand } from '../../web-api-client';

const AuthContext = createContext(null);

const usersClient = new UsersClient();
const membersClient = new MembersClient();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersClient.infoGET()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  const login = (email, password) =>
    usersClient.login(true, undefined, new LoginRequest({ email, password }))
      .then(() => setIsAuthenticated(true));

  const register = (firstName, lastName, email, password) =>
    membersClient.registerMember(new RegisterMemberCommand({ firstName, lastName, email, password }));

  const logout = () =>
    usersClient.logout({})
      .then(() => setIsAuthenticated(false));

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);