
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AUTH_IMAGES } from "@/utils/authUtils";
import AuthLayout from "./AuthLayout";
import ImageSelector from "./ImageSelector";
import { ClickPoint } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullPageLoader } from "@/components/ui/Loader";

enum LoginStep {
  Email,
  GraphicalPassword,
}

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [step, setStep] = useState(LoginStep.Email);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      setStep(LoginStep.GraphicalPassword);
    }
  };

  const handleGraphicalPasswordComplete = async (clickPoints: ClickPoint[]) => {
    try {
      await login({
        email,
        clickPoints,
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled in the context
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        step === LoginStep.Email
          ? "Enter your email to continue"
          : "Enter your graphical password"
      }
    >
      {step === LoginStep.Email ? (
        <form onSubmit={handleEmailSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-destructive text-sm">{emailError}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </form>
      ) : (
        <div className="animate-fadeIn">
          <ImageSelector
            images={DEFAULT_AUTH_IMAGES}
            onComplete={handleGraphicalPasswordComplete}
            mode="login"
          />
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setStep(LoginStep.Email)}
              className="w-full"
            >
              Back to email
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;
