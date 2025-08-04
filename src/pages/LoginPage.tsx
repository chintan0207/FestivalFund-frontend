import { useState } from "react";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, type LoginInput } from "@/lib/validation";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoginLoading } = useAuthStore();

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate("/");
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-5 w-screen h-screen bg-PRIMARY-50">
      <Card className="w-full max-w-sm">
        <CardTitle className="text-xl md:text-2xl text-center">
          Festival Fund
        </CardTitle>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1 relative">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="festival@fund.com"
                />
                {formErrors.email && (
                  <span className="input-error">{formErrors.email}</span>
                )}
              </div>

              <div className="grid gap-1 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                {formErrors.password && (
                  <span className="input-error">{formErrors.password}</span>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-10 w-full">
              {isLoginLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="w-full">
                  Login
                </Button>
              )}

              <div>
                Don't have an account?
                <Button
                  className="p-1"
                  variant="link"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
