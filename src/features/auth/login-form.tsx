import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  loading: boolean;
}

export function LoginForm({
  onSubmit,
  register,
  errors,
  loading,
  className,
  ...props
}: LoginFormProps & React.ComponentPropsWithoutRef<"div">) {
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
          <img src="/logo.webp" alt="logo" width={100} />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome!</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center ">
          <form className="w-3/4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
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
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}