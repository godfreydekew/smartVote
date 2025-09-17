export interface Candidate {
    id: string;
    name: string;
    party: string;
    position: string;
    bio: string;
    photo: string | null;
    twitter: string;
    website: string;
  }
  
  export interface ElectionFormData {
    title: string;
    organization: string;
    description: string;
    rules: string[];
    startDate: Date;
    endDate: Date;
    type: 'public' | 'private' | 'invite-only';
    kycRequired?: boolean;
    invitedEmails?: string[];
    accessControl?: 'csv' | 'manual' | 'invite' | 'public';
    ageRestriction: [number, number];
    regions: string[];
    useCaptcha: boolean;
    candidates: Candidate[];
    isDraft: boolean;
    bannerImage: string | null;
    primaryColor: string;
  }
  
  export interface ElectionCreationFormProps {
    onChange?: () => void;
    initialData?: Partial<ElectionFormData>;
  }

  