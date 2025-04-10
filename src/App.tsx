import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./Context/UserContext";
import Loader from "./components/loader";

const Login = React.lazy(() => import("./pages/login"));
const Register = React.lazy(() => import("./pages/register"));
const Tasks = React.lazy(() => import("./pages/tasks"));



interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {


  return <>{children}</>;
};

const App: React.FC = () => {
  const queryClient = new QueryClient();

  const userRoutes = [
    { path: "/", element: <Tasks /> },
  
  ];

  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={false}
            toastStyle={{
              width: "300px",
              fontSize: "14px",
              borderRadius: "8px",
            }}
          />
        </div>
        <BrowserRouter>
          <Suspense
            fallback={<Loader size="w-24 h-24" color="border-t-primary" />}
          >
            <Routes>
              <Route element={<Layout />}>


                {userRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute>
                        {element}
                      </ProtectedRoute>
                    }
                  />
                ))}
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
  );
};

export default App;
