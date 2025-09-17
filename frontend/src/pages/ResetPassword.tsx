import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginNavbar from '@/components/LoginNavbar';
import { useTranslation } from 'react-i18next';

const createFormSchema = (t: any) =>
  z
    .object({
      password: z
        .string()
        .min(8, { message: t('forms.resetPassword.errors.passwordRequired') })
        .regex(/[A-Z]/, { message: t('forms.resetPassword.errors.passwordUppercase') })
        .regex(/[a-z]/, { message: t('forms.resetPassword.errors.passwordLowercase') })
        .regex(/[0-9]/, { message: t('forms.resetPassword.errors.passwordNumber') })
        .regex(/[^A-Za-z0-9]/, { message: t('forms.resetPassword.errors.passwordSpecial') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('forms.resetPassword.errors.passwordsMatch'),
      path: ['confirmPassword'],
    });

type ResetPasswordFormData = z.infer<ReturnType<typeof createFormSchema>>;

const ResetPassword = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const formSchema = createFormSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast({
        title: t('forms.resetPassword.errorTitle'),
        description: t('forms.resetPassword.invalidToken'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
      toast({
        title: t('forms.resetPassword.successTitle'),
        description: t('forms.resetPassword.successDescription'),
        variant: 'success',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: t('forms.resetPassword.errorTitle'),
        description: t('forms.resetPassword.resetFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <LoginNavbar />

      <div className="container mx-auto flex flex-1 justify-center items-center px-2">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">
                {t('forms.resetPassword.title')}
              </h2>
              <p className="m-5 text-sm text-gray-600">{t('forms.resetPassword.subtitle')}</p>
              {isSuccess ? (
                <div className="text-center text-green-600">
                  <p>{t('forms.resetPassword.successMessage')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('forms.resetPassword.newPassword')}</Label>
                    <Input
                      id="password"
                      type="password"
                      className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('forms.resetPassword.confirmPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                      {...register('confirmPassword')}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-all text-white font-medium shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? t('forms.resetPassword.submitButtonLoading') : t('forms.resetPassword.submitButton')}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
