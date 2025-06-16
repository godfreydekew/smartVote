import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useForm, Controller } from 'react-hook-form';
import { authService } from '@/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from '@/hooks/use-api';
import SignupNavbar from '@/components/SignupNavbar';

// Enhanced form schema with all required user fields
const formSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  age: z.string()
    .refine(val => !isNaN(parseInt(val)), {
      message: 'Age must be a number'
    })
    .refine(val => parseInt(val) >= 18, {
      message: 'You must be at least 18 years old'
    }),
  gender: z.string().min(1, {
    message: 'Please select your gender'
  }),
  countryOfResidence: z.string().min(1, {
    message: 'Please select your country of residence'
  })
});

type SignupFormData = z.infer<typeof formSchema>;

interface SignupError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  request?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  };
  message?: string;
}

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    data: signupResponse,
    isLoading,
    error,
    execute: signupUser
  } = useApi(authService.createAccount);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      age: '',
      gender: '',
      countryOfResidence: ''
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const userData = {
        ...data,
        age: parseInt(data.age),
      };
  
      await signupUser(userData);
  
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials.",
        variant: "success",
      });
  
      navigate('/login');
    } catch (error: unknown) {
      const signupError = error as SignupError;
      let errorMessage = "An unexpected error occurred. Please try again.";
  
      if (signupError.response) {
        if (signupError.response.data?.message) {
          errorMessage = signupError.response.data.message;
        } else if (signupError.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (signupError.response.status === 400) {
          errorMessage = "Invalid information provided. Please check your details.";
        }
      } else if (signupError.request) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (signupError.message) {
        errorMessage = signupError.message;
      }
  
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // List of common countries
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil', 
    'Mexico', 'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Saudi Arabia',
    'United Arab Emirates', 'Other'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SignupNavbar />
      
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">
              Create an account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Start your voting journey today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                    {...register('full_name')}
                    disabled={isLoading}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all pr-12"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-vote-blue transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>

                {/* Age Field */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                    {...register('age')}
                    disabled={isLoading}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm">{errors.age.message}</p>
                  )}
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender *</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                  )}
                </div>

                {/* Country Field */}
                <div className="space-y-2">
                  <Label htmlFor="countryOfResidence" className="text-gray-700 font-medium">Country of Residence *</Label>
                  <Controller
                    name="countryOfResidence"
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country.toLowerCase()}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.countryOfResidence && (
                    <p className="text-red-500 text-sm">{errors.countryOfResidence.message}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-all text-white font-medium shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-vote-blue hover:text-vote-teal transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;