import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { useAuth } from '@/auth/AuthProvider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Connect } from '@/components/thirdweb/Connect';
import { useActiveAccount } from 'thirdweb/react';
import { useProfiles } from 'thirdweb/react';
import { client } from '@/utils/thirdweb-client';
import LoginNavbar from '@/components/LoginNavbar';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import InfoNotification from '@/components/InfoNotification';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LoginError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const account = useActiveAccount();
  const { data: profiles, isLoading: profilesLoading } = useProfiles({ client });
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailHelp, setShowEmailHelp] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate]);

  // Auto-fill email if verified through Connect component
  useEffect(() => {
    if (account?.address && profiles?.[0]?.details?.email) {
      setValue('email', profiles[0].details.email);
      // Auto-focus and highlight password field after email verification
      const passwordInput = document.getElementById('password');
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }, [account, profiles, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      toast({
        title: `${data?.email}`,
        description: 'Please wait while we log you in.',
        variant: 'default',
      });

      await login(data.email, data.password);

      toast({
        title: 'Login successful',
        description: 'You are now logged in.',
        variant: 'success',
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const loginError = error as LoginError;
      toast({
        title: 'Login failed',
        description: loginError?.response?.data?.message || loginError?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (isInitializing || profilesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <LoginNavbar />

      <InfoNotification
        title="Important Notice"
        message="After successful login, you will be required to complete KYC verification to access all features of the platform."
        storageKey="login-kyc-notice"
      />

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-700 text-xl">Sign in to continue your journey</p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className={`flex items-center ${account?.address ? 'text-green-600' : 'text-vote-blue'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${account?.address ? 'bg-green-600' : 'bg-vote-blue'} text-white font-bold text-sm`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Verify Email</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${account?.address ? 'text-vote-blue' : 'text-gray-400'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${account?.address ? 'bg-vote-blue' : 'bg-gray-300'} text-white font-bold text-sm`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Sign In</span>
              </div>
            </div>
          </div>

          {/* Email Verification Section */}
          {!account?.address ? (
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Connect />
              <p className="mt-2 text-sm text-gray-600">Step 1: Verify your email to proceed to sign in</p>
            </div>
          ) : (
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center text-green-700">
                <CheckCircle2 className="h-6 w-6 mr-2" />
                <p className="font-semibold">Email Verified Successfully</p>
              </div>
              <p className="mt-1 text-sm text-green-600">{profiles?.[0]?.details?.email}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              {!account?.address ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Label htmlFor="email" className="text-gray-900 font-semibold text-base">
                          Email
                        </Label>
                        <div className="w-full cursor-not-allowed" onClick={() => setShowEmailHelp(true)}>
                          <Input
                            id="email"
                            type="email"
                            required
                            className="mt-1 h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all w-full"
                            placeholder="Complete Step 1 to auto-fill"
                            {...register('email')}
                            disabled
                            style={{ pointerEvents: 'none' }} // Make the input itself unclickable
                          />
                        </div>
                        {showEmailHelp && (
                          <p className="mt-2 text-sm text-vote-blue">
                            Please complete Step 1 (Verify Email) above. Your email address will be automatically filled
                            in here after you connect.
                          </p>
                        )}
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Please connect your account first</p>
                    </TooltipContent>
                  </Tooltip>
              ) : (
                <div>
                  <Label htmlFor="email" className="text-gray-900 font-semibold text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="mt-1 h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all w-full"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              )}
              {!account?.address ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Label htmlFor="password" className="text-gray-900 font-semibold text-base">
                          Password
                        </Label>
                        <div className="relative" onClick={() => setShowPasswordHelp(true)}>
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="mt-1 h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all pr-12"
                            placeholder="Enter your password"
                            {...register('password')}
                            disabled
                            style={{ pointerEvents: 'none' }} // Make the input itself unclickable
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-vote-blue transition-colors"
                            disabled
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {showPasswordHelp && (
                          <p className="mt-2 text-sm text-vote-blue">
                            Please complete Step 1 (Verify Email) before entering your password.
                          </p>
                        )}
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Please connect your account first</p>
                    </TooltipContent>
                  </Tooltip>
              ) : (
                <div>
                  <Label htmlFor="password" className="text-gray-900 font-semibold text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="mt-1 h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all pr-12"
                      placeholder="Enter your password"
                      {...register('password')}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-vote-blue transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-all text-white font-medium shadow-lg hover:shadow-xl"
                disabled={isSubmitting || !account?.address}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-vote-blue hover:text-vote-teal transition-colors underline-offset-4 hover:underline"
                >
                  Create one now
                </Link>
              </p>
              <p className="text-gray-600">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-vote-blue hover:text-vote-teal transition-colors underline-offset-4 hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
