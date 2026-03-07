import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsersClient, LoginRequest, MembersClient, RegisterMemberCommand } from '../../web-api-client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<number>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

const usersClient = new UsersClient();
const membersClient = new MembersClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  const fetchRoles = async () => {
    const res = await fetch('/api/Users/me');
    if (res.ok) {
      const data = await res.json();
      setRoles(data.roles);
    }
  };

  useEffect(() => {
    usersClient.infoGET()
      .then(() => {
        setIsAuthenticated(true);
        return fetchRoles();
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  const login = (email: string, password: string): Promise<void> =>
    usersClient.login(true, undefined, new LoginRequest({ email, password }))
      .then(() => {
        setIsAuthenticated(true);
        return fetchRoles();
      });

  const register = (firstName: string, lastName: string, email: string, password: string): Promise<number> =>
    membersClient.registerMember(new RegisterMemberCommand({ firstName, lastName, email, password }));

  const logout = (): Promise<void> =>
    usersClient.logout({})
      .then(() => {
        setIsAuthenticated(false);
        setRoles([]);
      });

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, roles, isAdmin: roles.includes('Administrator'), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
