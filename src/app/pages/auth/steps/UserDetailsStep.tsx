import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Eye, EyeOff } from "../../../lib/icons";
import { cn } from "../../../components/ui/utils";

export interface UserDetailsStepProps {
  onNext: () => void;
}

export function UserDetailsStep({ onNext }: UserDetailsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "hc_superuserprod@gmail.com",
    password: "password123!",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    const password = formData.password;
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!formData.confirmPassword || formData.confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">
        Welcome to Insights<br />
        <span className="text-primary">Let's Get Started!</span>
      </h2>

      <Button variant="outline" className="mb-6 flex w-full items-center justify-center gap-2 rounded-full py-6 text-base font-medium border-border bg-card text-foreground hover:bg-muted hover:text-foreground transition-transform duration-150 active:scale-[0.97]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5" aria-hidden="true">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Sign up with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">
            First Name <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input 
            id="firstName"
            placeholder="First name" 
            aria-required="true"
            aria-invalid={!!errors.firstName}
            className={cn("h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", errors.firstName && "border-red-500 focus-visible:ring-red-500")}
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          {errors.firstName && <span className="text-xs text-red-500 font-medium" role="alert">{errors.firstName}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">
            Last Name <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input 
            id="lastName"
            placeholder="Last name" 
            aria-required="true"
            aria-invalid={!!errors.lastName}
            className={cn("h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", errors.lastName && "border-red-500 focus-visible:ring-red-500")}
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          {errors.lastName && <span className="text-xs text-red-500 font-medium" role="alert">{errors.lastName}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <Label htmlFor="userEmail" className="text-sm font-semibold text-foreground">
          Email <span className="text-primary" aria-hidden="true">*</span>
        </Label>
        <Input 
          id="userEmail"
          type="email"
          placeholder="john@example.com" 
          aria-required="true"
          aria-invalid={!!errors.email}
          className={cn("h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", errors.email && "border-red-500 focus-visible:ring-red-500")}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <span className="text-xs text-red-500 font-medium" role="alert">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <Label htmlFor="createPassword" className="text-sm font-semibold text-foreground">
          Create Password <span className="text-primary" aria-hidden="true">*</span>
        </Label>
        <p className={cn("text-xs font-medium mb-1", errors.password ? "text-red-500" : "text-muted-foreground")}>
          Must be at least 8 characters with uppercase, lowercase, number & special character.
        </p>
        <div className="relative">
          <Input
            id="createPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            aria-required="true"
            aria-invalid={!!errors.password}
            className={cn("h-11 pr-10 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", errors.password && "border-red-500 focus-visible:ring-red-500")}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-8">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
          Confirm Password <span className="text-primary" aria-hidden="true">*</span>
        </Label>
        <p className="text-xs text-muted-foreground font-medium mb-1">
          Re-enter Password
        </p>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter Password"
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            className={cn("h-11 pr-10 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            {showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
          </button>
        </div>
        {errors.confirmPassword && <span className="text-xs text-red-500 font-medium" role="alert">{errors.confirmPassword}</span>}
      </div>

      <Button onClick={handleNextClick} className="w-full rounded-md py-6 text-base font-semibold">
        Next
      </Button>
    </div>
  );
}
