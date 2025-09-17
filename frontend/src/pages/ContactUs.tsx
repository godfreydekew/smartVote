import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PolicyNavbar from '@/components/PolicyNavbar';
import { useTranslation } from 'react-i18next';

const createFormSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t('contact.form.errors.nameRequired')),
    email: z.string().email(t('contact.form.errors.emailRequired')),
    subject: z.string().min(5, t('contact.form.errors.subjectRequired')),
    message: z.string().min(10, t('contact.form.errors.messageRequired')),
  });

const ContactUs = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = createFormSchema(t);

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: z.infer<ReturnType<typeof createFormSchema>>) => {
    toast({
      title: t('contact.form.successTitle'),
      description: t('contact.form.successDescription'),
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PolicyNavbar />

      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information Cards */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <Mail className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">{t('contact.contactInfo.email.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('contact.contactInfo.email.value')}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <Phone className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">{t('contact.contactInfo.phone.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('contact.contactInfo.phone.value')}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <MapPin className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">{t('contact.contactInfo.office.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('contact.contactInfo.office.value')}
                <br />
                {t('contact.contactInfo.office.address')}
              </p>
            </Card>

            {/* Contact Form */}
            <Card className="p-8 md:col-span-3 mt-8 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-vote-blue">{t('contact.form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.form.namePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-vote-blue">{t('contact.form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('contact.form.emailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-vote-blue">{t('contact.form.subject')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.form.subjectPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-vote-blue">{t('contact.form.message')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('contact.form.messagePlaceholder')}
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('contact.form.submitButton')}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
