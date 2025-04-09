import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./Context/UserContext";
import Loader from "./components/loader";

const Home = React.lazy(() => import("./pages/home"));
const Login = React.lazy(() => import("./pages/login"));
const Products = React.lazy(() => import("./pages/products"));
const Profile = React.lazy(() => import("./pages/profile"));
const PromoCodes = React.lazy(() => import("./pages/PromoCodes"));


type Role = "Admin" | "Sub Admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const role = localStorage.getItem("role") as Role | null;

  if (!role || !allowedRoles.includes(role)) {
    console.log(allowedRoles, role);
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const queryClient = new QueryClient();

  const userRoutes = [
    { path: "/", element: <Home /> },
    { path: "/products", element: <Products /> },
    { path: "/promo-code", element: <PromoCodes /> },
    { path: "/profile", element: <Profile /> },
  
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
                      <ProtectedRoute allowedRoles={["Admin"]}>
                        {element}
                      </ProtectedRoute>
                    }
                  />
                ))}
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
  );
};

export default App;
