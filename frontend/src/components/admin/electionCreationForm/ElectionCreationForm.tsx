import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidatesStep } from './CandidatesStep';

import { electionService } from '@/api';
import { ElectionRequest } from '@/api/services/electionService';
import { useAuth } from '@/auth/AuthProvider';
import { BasicInfoStep } from './BasicInfoStep';
import { ElectionFormData } from './types';
import { AdvancedSettingsStep } from './AdvancedSettingsStep';
import { VoterEligibilityStep } from './VoterEligibilityStep';
import { useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, getRpcClient, waitForReceipt } from 'thirdweb';
import { electionFactoryContract, singleElectionContract } from '@/utils/thirdweb-client';
import { ElectionCreationLoading } from './ElectionCreationLoading';
import { determineElectionStatus } from '@/utils/determineElectionStatus';
import { useTranslation } from 'react-i18next';

interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  bio: string;
  photo: string | null;
  twitter: string;
  website: string;
}

interface ElectionCreationFormProps {
  onChange?: () => void;
  initialData?: Partial<ElectionFormData>;
}

export const ElectionCreationForm = ({ onChange, initialData }: ElectionCreationFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: sendTransaction, isPending: isTransactionPending } = useSendTransaction();
  const { user } = useAuth();
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [creationStatus, setCreationStatus] = useState<'creating' | 'publishing' | 'ready' | 'error'>('creating');
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  console.log(user);

  const publishToBlockchain = async (data: ElectionFormData, electionId: number) => {
    if (isTransactionPending) return;

    return new Promise((resolve, reject) => {
      const transaction = prepareContractCall({
        contract: electionFactoryContract,
        method:
          'function createElectionWithCandidates(uint256 _id, string _title, uint256 _startTime, uint256 _endTime, bool _isPublic, (uint256 id, string name)[] _candidates) returns (address)',
        params: [
          BigInt(electionId),
          data.title as string,
          BigInt(Math.floor(data.startDate.getTime() / 1000)),
          BigInt(Math.floor(data.endDate.getTime() / 1000)),
          data.isPublic,
          data.candidates.map((candidate) => ({
            id: BigInt(candidate.id),
            name: candidate.name,
          })),
        ],
      });

      sendTransaction(transaction, {
        onSuccess: async (receipt) => {
          console.log('Transaction sent:', receipt);
          setTransactionHash(receipt.transactionHash);

          try {
            // Wait for the transaction to be mined
            const txReceipt = await waitForReceipt({
              client: electionFactoryContract.client,
              chain: electionFactoryContract.chain,
              transactionHash: receipt.transactionHash,
            });

            if (txReceipt.logs.length > 0) {
              const newContractAddress = txReceipt.logs[0].address;
              console.log('New Election Contract Address:', newContractAddress);

              setContractAddress(newContractAddress);
              resolve({ contractAddress: newContractAddress, transactionHash: receipt.transactionHash });
            } else {
              reject(new Error('No contract address found in transaction logs'));
            }
          } catch (error) {
            console.error('Error waiting for transaction:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Transaction error:', error);
          reject(error);
        },
      });
    });
  };

  const form = useForm<ElectionFormData>({
    defaultValues: {
      title: initialData?.title || '',
      organization: initialData?.organization || '',
      description: initialData?.description || '',
      rules: initialData?.rules || [''],
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      isPublic: initialData?.isPublic ?? true,
      accessControl: initialData?.accessControl || 'public',
      ageRestriction: initialData?.ageRestriction || [18],
      regions: initialData?.regions || [],
      useCaptcha: initialData?.useCaptcha ?? true,
      candidates: initialData?.candidates || [
        {
          id: '1',
          name: '',
          party: '',
          position: '',
          bio: '',
          photo: null,
          twitter: '',
          website: '',
        },
      ],
      isDraft: initialData?.isDraft ?? true,
      bannerImage: initialData?.bannerImage || null,
      primaryColor: initialData?.primaryColor || '#3b82f6',
    },
  });

  const nextStep = () => setFormStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setFormStep((prev) => Math.max(prev - 1, 1));

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (onChange) {
        onChange();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);

      setTimeout(() => {
        setCsvPreview(['user1@example.com', 'user2@example.com', 'invalid-email']);
        setCsvErrors(['invalid-email']);
      }, 500);
    }
  };

  const onSubmit = async (data: ElectionFormData) => {
    setIsSubmitting(true);
    setCreationStatus('creating');
    setCurrentStep(1);
    setError('');
    setShowError(false);
    setContractAddress('');
    setTransactionHash('');

    let electionId;
    try {
      console.log(data.description);

      const electionStatus = determineElectionStatus(data.startDate, data.endDate);
      const electionRequest: ElectionRequest = {
        title: data.title,
        description: data.description,
        rules: data.rules,
        startDate: data.startDate,
        endDate: data.endDate,
        status: electionStatus,
        imageURL: bannerImageUrl,
        organization: data.organization,
        isPublic: data.isPublic,
        accessControl: data.accessControl,
        ownerAddress: import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS,
        ownerUserId: user.id,
      };

      const electionResponse = await electionService.createElection(electionRequest);
      electionId = electionResponse?.election?.id;

      if (typeof electionId !== 'number' || isNaN(electionId)) {
        throw new Error('Invalid election ID received. Expected a number.');
      }

      setCurrentStep(2);
      setCreationStatus('publishing');

      try {
        const candidatesResponse = await electionService.createCandidates(electionId, data.candidates);
        console.log('Candidates:', candidatesResponse.candidates);

        await publishToBlockchain({ ...data, candidates: candidatesResponse.candidates }, electionId);

        setCurrentStep(3);
        setCreationStatus('ready');

        //update election addresss here
        toast({
          title: data.isDraft ? 'Draft Saved' : 'Election Published',
          description: `The election "${data.title}" has been ${data.isDraft ? 'saved as a draft' : 'published'}.`,
        });

        if (onChange) onChange();
      } catch (innerError) {
        console.error('Candidate or Blockchain error:', innerError);
        throw innerError;
      }
    } catch (error) {
      setCreationStatus('error');
      setError(error instanceof Error ? error.message : 'An error occurred while creating the election');
      setShowError(true);

      if (typeof electionId === 'number') {
        try {
          await electionService.deleteElection(electionId);
          console.log(`Deleted election ${electionId} due to failure.`);
        } catch (deleteErr) {
          console.error(`Failed to delete election ${electionId}:`, deleteErr);
        }
      }

      toast({
        title: 'Error',
        description: 'An error occurred while creating the election. Please try again',
        variant: 'destructive',
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setShowError(false);
      }, 5000);

      return;
    }
  };

  if (isSubmitting || showError) {
    return (
      <ElectionCreationLoading
        currentStep={currentStep}
        totalSteps={3}
        status={creationStatus}
        error={error}
        contractAddress={contractAddress}
        transactionHash={transactionHash}
        onReturn={() => {
          setIsSubmitting(false);
          setShowError(false);
          if (onChange) onChange();
        }}
      />
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="block md:hidden">
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">
                  {t('electionCreation.form.stepIndicator', { current: formStep, total: 3 })}
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-10 rounded-full ${step === formStep ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger
                  value="basic"
                  onClick={() => setFormStep(1)}
                  className={formStep === 1 ? 'border-b-2 border-primary' : ''}
                >
                  {t('electionCreation.form.tabs.basicInfo')}
                </TabsTrigger>
                {/* <TabsTrigger
                  value="voters"
                  onClick={() => setFormStep(2)}
                  className={formStep === 2 ? 'border-b-2 border-primary' : ''}
                >
                  Voter Eligibility
                </TabsTrigger> */}
                <TabsTrigger
                  value="candidates"
                  onClick={() => setFormStep(2)}
                  className={formStep === 2 ? 'border-b-2 border-primary' : ''}
                >
                  {t('electionCreation.form.tabs.candidates')}
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  onClick={() => setFormStep(3)}
                  className={formStep === 3 ? 'border-b-2 border-primary' : ''}
                >
                  {t('electionCreation.form.tabs.advancedSettings')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Step 1: Basic Info */}
          {formStep === 1 && <BasicInfoStep form={form} nextStep={nextStep} />}

          {/* Step 3: Candidate Management */}
          {formStep === 2 && <CandidatesStep prevStep={prevStep} nextStep={nextStep} />}

          {/* Step 4: Advanced Settings */}
          {formStep === 3 && (
            <>
              <AdvancedSettingsStep
                form={form}
                prevStep={prevStep}
                bannerImageUrl={bannerImageUrl}
                setBannerImageUrl={setBannerImageUrl}
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
};
