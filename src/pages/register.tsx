import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
import { registerSchema } from "../features/auth/schema";
import { register } from "../features/auth/api";
import { RegisterForm } from "../features/auth/register-form";
import { Helmet } from "react-helmet";
import { z } from "zod";
import {  useNavigate } from "react-router-dom";

const Register = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      await register(data);
      toast.success("Registration successful!");
      navigate("/login"); 
    } catch (error: any) {
      console.error("Register failed", error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <main className="relative px-4 flex justify-center items-center h-screen">
        <img
          src="invade-bg.png"
          alt="bg"
          className="absolute object-cover w-full h-full"
        />
        <RegisterForm
          onSubmit={form.handleSubmit(onSubmit)}
          register={form.register}
          errors={form.formState.errors}
          loading={loading}
        />
      </main>
    </>
  );
};;

export default Register;
