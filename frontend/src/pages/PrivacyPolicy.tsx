import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Shield } from 'lucide-react';
import PolicyNavbar from '@/components/PolicyNavbar';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PolicyNavbar />

      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FileText className="h-8 w-8 text-vote-blue mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">{t('policy.privacyPolicy.title')}</h1>
          </div>

          <Card className="max-w-4xl mx-auto p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.privacyPolicy.sections.informationCollection.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.privacyPolicy.sections.informationCollection.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.privacyPolicy.sections.useOfInformation.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.privacyPolicy.sections.useOfInformation.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.privacyPolicy.sections.dataProtection.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.privacyPolicy.sections.dataProtection.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.privacyPolicy.sections.userRights.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">{t('policy.privacyPolicy.sections.userRights.content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.privacyPolicy.sections.cookiesAndTracking.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.privacyPolicy.sections.cookiesAndTracking.content')}
              </p>
            </section>
          </Card>
        </div>

        <div className="container mx-auto px-4 mt-12">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-8 w-8 text-vote-blue mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">{t('policy.termsOfService.title')}</h1>
          </div>

          <Card className="max-w-4xl mx-auto p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.termsOfService.sections.acceptanceOfTerms.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.termsOfService.sections.acceptanceOfTerms.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.termsOfService.sections.descriptionOfService.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.termsOfService.sections.descriptionOfService.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.termsOfService.sections.userObligations.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.termsOfService.sections.userObligations.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.termsOfService.sections.serviceModifications.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.termsOfService.sections.serviceModifications.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-vote-blue">
                {t('policy.termsOfService.sections.dataSecurity.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('policy.termsOfService.sections.dataSecurity.content')}
              </p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
