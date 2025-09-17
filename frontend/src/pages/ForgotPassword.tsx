import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/api';
import LoginNavbar from '@/components/LoginNavbar';
import { useTranslation } from 'react-i18next';

const createFormSchema = (t: any) =>
  z.object({
    email: z.string().email({
      message: t('forms.forgotPassword.errors.emailRequired'),
    }),
  });

type ForgotPasswordFormData = z.infer<ReturnType<typeof createFormSchema>>;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formSchema = createFormSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(data.email);
      setIsSuccess(true);
      toast({
        title: t('forms.forgotPassword.successTitle'),
        description: t('forms.forgotPassword.successDescription'),
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: t('forms.forgotPassword.errorTitle'),
        description: t('forms.forgotPassword.resetFailed'),
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
                {t('forms.forgotPassword.title')}
              </h2>
              <p className="m-5 text-sm text-gray-600">{t('forms.forgotPassword.subtitle')}</p>
              {isSuccess ? (
                <div className="text-center text-green-600">
                  <p>{t('forms.forgotPassword.successMessage')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('forms.forgotPassword.emailPlaceholder')}
                      className="h-12 rounded-xl border-gray-200 focus:border-vote-blue focus:ring-vote-blue/20 transition-all"
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-all text-white font-medium shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t('forms.forgotPassword.submitButtonLoading')
                        : t('forms.forgotPassword.submitButton')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
