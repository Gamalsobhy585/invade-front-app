import { toast } from "react-toastify";
import { logout as logoutApi } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast( "Logged out successfully" );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    },
  });

  return { logout, isLoggingOut };
};

export default useAuth;
