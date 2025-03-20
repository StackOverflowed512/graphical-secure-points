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
import { toast } from "@/components/ui/use-toast";
import { FullPageLoader } from "@/components/ui/Loader";

enum RegistrationStep {
    UserInfo,
    GraphicalPassword,
}

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [step, setStep] = useState(RegistrationStep.UserInfo);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
    });

    const validateForm = () => {
        const newErrors = {
            username: "",
            email: "",
        };

        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setStep(RegistrationStep.GraphicalPassword);
        }
    };

    const handleGraphicalPasswordComplete = async (
        clickPoints: ClickPoint[]
    ) => {
        try {
            await register({
                username: formData.username,
                email: formData.email,
                clickPoints,
            });
            toast({
                title: "Account created successfully",
                description:
                    "You can now log in using your graphical password.",
            });
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            // Error is already handled in the context
        }
    };

    if (loading) {
        return <FullPageLoader />;
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle={
                step === RegistrationStep.UserInfo
                    ? "Enter your information to get started"
                    : "Create your graphical password"
            }
        >
            {step === RegistrationStep.UserInfo ? (
                <form onSubmit={handleContinue}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            {errors.username && (
                                <p className="text-destructive text-sm">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Continue
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => navigate("/login")}
                                >
                                    Log in
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
                        mode="register"
                    />
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setStep(RegistrationStep.UserInfo)}
                            className="w-full"
                        >
                            Back to user information
                        </Button>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default Register;