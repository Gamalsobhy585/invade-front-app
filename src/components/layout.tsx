import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useAuth from "..//hooks/useAuth";
import { useEffect } from "react";
import { useUserContext } from "../Context/UserContext";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { name, email } = useUserContext();
  const { logout, isLoggingOut } = useAuth();
  const Auth = localStorage.getItem("token");
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();



  useEffect(() => {
    if (!Auth) navigate("/login");
  }, [Auth, navigate]);


  return (
    <div
      className="p-4 grid grid-cols-5 xl:grid-cols-6 h-screen bg-[#f7f7f7] overflow-hidden"
      dir={i18n.language == "ar" ? "rtl" : "ltr"}
    >
      <aside className="hidden lg:flex flex-col  col-span-1 border  rounded-2xl py-4 bg-background">
        <div>
          <header className="flex justify-center items-center pb-4 mx-4 border-b">
            <Link to="/">
            <img src="/logo.png" alt="logo" width={50} />
            </Link>
          </header>
          <div className="pt-4">
            <ul className="flex flex-col gap-4 p-0">

            
          
            </ul>
          </div>
        </div>
        <div className="mt-auto px-4">
          <Button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className=" w-full tex"
          >
            {t("log")}
          </Button>
        </div>
      </aside>
      <main className="flex flex-col col-span-5 lg:col-span-4 xl:col-span-5 px-4 gap-4 overflow-y-scroll">
      <div className="rounded-2xl w-full bg-background flex items-center justify-between px-4">
        <div className="flex justify-between items-center gap-2 py-4">
          <Link to="/profile">
            <div className="rounded-full border-4 border-primary overflow-hidden">
             
            </div>
          </Link>
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold">{name || "Guest"}</h3>
            <p className="text-muted-foreground">{email || "example@domain.com"}</p>
          </div>
        </div>
        <div className="flex items-center justify-end  gap-4 ">
      
        </div>
      </div>
      <Outlet />
    </main>
    </div>
  );
}
