import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useAuth from "..//hooks/useAuth";
import { useEffect } from "react";
import { useUserContext } from "../Context/UserContext";

export default function Layout() {
  const { name, email } = useUserContext();
  const { logout, isLoggingOut } = useAuth();
  const Auth = localStorage.getItem("token");
  const navigate = useNavigate();




  useEffect(() => {
    if (!Auth) navigate("/login");
  }, [Auth, navigate]);


  return (
    <div className="h-screen grid grid-rows-[auto_1fr] bg-[#f7f7f7] overflow-hidden">
      {/* Navbar */}
      <header className="bg-background flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/">
            <img src="/logo.png" alt="logo" width={80} />
          </Link>
  
          {/* User Info */}
          <div className="flex items-center gap-3">
           
            <div className="flex flex-col">
              <span className="text-base font-medium">{name || "Guest"}</span>
              <span className="text-sm text-muted-foreground">{email || "example@domain.com"}</span>
            </div>
          </div>
        </div>
  
        {/* Log out button on the right */}
        <Button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="text-sm"
        >
          Log out
        </Button>
      </header>
  
      {/* Page Content */}
      <main className="p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
  
}
