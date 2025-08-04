import { useState } from "react";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { registerSchema, type RegisterInput } from "@/lib/validation";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isRegisterLoading } = useAuthStore();

  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    console.log("result");

    if (!result.success) {
      const errors: Partial<Record<keyof RegisterInput, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        errors[field] = err.message;
      });

      setFormErrors(errors);
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    const success = await register(data);

    if (success) {
      navigate("/");
    } else {
      toast.error("Registration failed. Please try again.");
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {formErrors.name && (
                  <span className="input-error">{formErrors.name}</span>
                )}
              </div>

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

              <div className="grid gap-1 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
                {formErrors.confirmPassword && (
                  <span className="input-error">
                    {formErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <CardFooter className="flex flex-col mt-10 w-full">
              {isRegisterLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="w-full">
                  Register
                </Button>
              )}

              <div>
                Already Registered?
                <Button
                  className="p-1"
                  variant="link"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
