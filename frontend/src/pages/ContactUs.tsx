import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PolicyNavbar from '@/components/PolicyNavbar';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactUs = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PolicyNavbar />
      
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information Cards */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <Mail className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">Email</h3>
              <p className="text-gray-600 leading-relaxed">dekewgodfrey@gmail.com</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <Phone className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">Phone</h3>
              <p className="text-gray-600 leading-relaxed">+90 548865 8336</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
              <MapPin className="w-8 h-8 text-vote-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-vote-blue">Office</h3>
              <p className="text-gray-600 leading-relaxed">Northern Cyprus<br />European University of Lefke</p>
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
                          <FormLabel className="text-vote-blue">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
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
                          <FormLabel className="text-vote-blue">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
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
                        <FormLabel className="text-vote-blue">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help you?" {...field} />
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
                        <FormLabel className="text-vote-blue">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message..." 
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
                    Send Message
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
