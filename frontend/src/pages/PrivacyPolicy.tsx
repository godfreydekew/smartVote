import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Shield } from 'lucide-react';
import PolicyNavbar from '@/components/PolicyNavbar';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PolicyNavbar />
      
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FileText className="h-8 w-8 text-vote-blue mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <Card className="max-w-4xl mx-auto p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">1. Information Collection</h2>
              <p className="text-gray-600 leading-relaxed">
                We collect information necessary to provide our voting services, including but not limited to name, email address, and voting records. All data collection complies with relevant data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">2. Use of Information</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information is used to maintain your account, process votes, ensure voting integrity, and improve our services. We never sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">3. Data Protection</h2>
              <p className="text-gray-600 leading-relaxed">
                We employ industry-standard security measures to protect your data. Your voting information is encrypted and stored securely on our blockchain infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">4. User Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                You have the right to access, correct, or delete your personal information. Contact our support team to exercise these rights or for any privacy-related concerns.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">5. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to improve user experience and analyze platform usage. You can control cookie preferences through your browser settings.
              </p>
            </section>
          </Card>
        </div>

        <div className="container mx-auto px-4 mt-12">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-8 w-8 text-vote-blue mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>

          <Card className="max-w-4xl mx-auto p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using Şeffaf Katılım's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                Şeffaf Katılım provides a blockchain-based voting platform that enables secure, transparent, and accessible voting for various purposes including entertainment, corporate governance, and institutional elections.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">3. User Obligations</h2>
              <p className="text-gray-600 leading-relaxed">
                Users must provide accurate information when registering and using the service. Any fraudulent activity or attempt to manipulate voting results will result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">4. Service Modifications</h2>
              <p className="text-gray-600 leading-relaxed">
                Şeffaf Katılım reserves the right to modify or discontinue any aspect of the service at any time. We will provide reasonable notice of any significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement robust security measures to protect your data and voting information. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
