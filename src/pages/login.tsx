import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
import { loginSchema } from "../features/auth/schema";
import { login } from "../features/auth/api";
import { useUserContext } from "../Context/UserContext";
import { LoginForm } from "../features/auth/login-form";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false);
  const { setToken, setName, setEmail } = useUserContext();
  const navigate = useNavigate(); 


  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await login(data);
      const { token, name, email } = response.data;

      setToken(token);
      setName(name);
      setEmail(email);
      toast.success("Login successful!");
      navigate("/"); 



      
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <main className="relative px-4 flex justify-center items-center h-screen">
        <img
          src="invade-bg.png"
          alt="bg"
          className="absolute object-cover w-full h-full"
        />
        <LoginForm
          onSubmit={form.handleSubmit(onSubmit)}
          register={form.register}
          errors={form.formState.errors}
          loading={loading}
        />
      </main>
    </>
  );
};

export default Login;
