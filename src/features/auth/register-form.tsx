import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  loading: boolean;
}

export function RegisterForm({
  onSubmit,
  register,
  errors,
  loading,
  className,
  ...props
}: RegisterFormProps & React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
          className={cn(
            "flex flex-col gap-6 z-50 basis-full sm:basis-1/2 lg:basis-1/3",
            className
          )}
          {...props}
        >
          <Card className="z-50 rounded-2xl">
            <CardHeader className="items-center">
              <img src="/logo.png" alt="logo" width={100} />
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>Welcome!</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <form className="w-3/4" onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password_confirmation">Password Confirmation</Label>
                    </div>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="Retype Password"
                      autoComplete="new-password"
                      {...register("password_confirmation")}
                    />
                    {errors.password_confirmation && (
                      <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Register"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already Have Account?{" "}
                <Link to="/login" className="text-pink-600 hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      );
}