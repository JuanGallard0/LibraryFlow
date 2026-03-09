import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./layouts/MainLayout";
import { AuthProvider } from "./components/api-authorization/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <Layout>
            <Routes>
              {AppRoutes.map((route, index) => {
                const { element, ...rest } = route;
                return <Route key={index} {...rest} element={element} />;
              })}
            </Routes>
          </Layout>
        </AuthProvider>
      </ErrorBoundary>
    );
  }
}
