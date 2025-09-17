export const electionCreation = {
  title: 'Create New Election',
  subtitle: 'Set up a new election for your organization',
  steps: {
    basicInfo: 'Basic Info',
    candidates: 'Candidates',
    advancedSettings: 'Advanced Settings',
  },

  buttons: {
    next: 'Next',
    previous: 'Previous',
    createElection: 'Create Election',
    saveDraft: 'Save Draft',
    cancel: 'Cancel',
  },

  success: {
    title: 'Election Created',
    description: 'Your election has been created successfully and published to the blockchain.',
    viewElection: 'View Election',
    createAnother: 'Create Another Election',
  },
  errors: {
    title: 'Creation Failed',
    description: 'There was an error creating your election. Please try again.',
    retry: 'Retry',
  },

  basicInfo: {
    title: 'Basic Information',
    subtitle: 'Set up the fundamental details of your election',
    importantInfo: {
      title: 'Important Information',
      description: 'Please review the following requirements before proceeding:',
      requirements: [
        'Election title must be between 5-100 characters',
        'Description must be at least 20 characters long',
        'At least one rule is required',
        'Start time must be at least 2 minutes ahead of current time',
        'End time must be after start time',
      ],
    },
    fields: {
      title: {
        label: 'Election Title*',
        placeholder: 'Enter election title',
        description: 'A clear title helps voters identify the election.',
        validation: {
          required: 'Election title is required',
          minLength: 'Title must be at least 5 characters',
          maxLength: 'Title cannot exceed 100 characters',
        },
      },
      description: {
        title: 'Election Description',
        placeholder: 'Enter a detailed description of the election...',
        description: "Provide voters with information about this election's purpose and importance.",
        validation: {
          required: 'Description is required',
          minLength: 'Description must be at least 20 characters',
          maxLength: 'Description cannot exceed 1000 characters',
        },
      },
      rules: {
        title: 'Election Rules',
        placeholder: 'Rule {index}',
        description: 'Define the rules and guidelines for this election.',
        defaultRules: [
          'Each voter can vote only once',
          'Voting is anonymous',
          'Results will be published after election ends',
        ],
        validation: {
          required: 'At least one rule is required',
          empty: 'Rules cannot be empty',
          maxLength: 'Rules cannot exceed 200 characters',
        },
      },
      organization: {
        label: 'Organization*',
        placeholder: 'Select an organization',
        options: [
          'Corporate/Business',
          'Non-Profit',
          'Educational Institution',
          'Union/Association',
          'Community Organization',
          'Government/Public Sector',
          'DAO/Blockchain Project',
          'Cooperative',
          'Other',
        ],
        validation: {
          required: 'Organization is required',
        },
      },
      dates: {
        startDate: 'Start Date & Time*',
        endDate: 'End Date & Time*',
        validation: {
          startTime: 'Start time must be at least 2 minutes ahead',
          endTime: 'End time must be after start time',
        },
      },
      visibility: {
        public: {
          title: 'Public Election',
          description: 'Anyone can participate (with optional restrictions)',
        },
        private: {
          title: 'Private Election',
          description: 'Only invited voters can participate (voter list required)',
        },
      },
    },
    validation: {
      title: 'Validation Error',
      description: 'Please fill in all required fields correctly.',
      dateError: 'Date Validation Error',
    },
    buttons: {
      next: 'Next: Candidates',
    },
  },
  candidates: {
    title: 'Add Candidates',
    subtitle: 'Add all candidates participating in this election. Include their photos and details.',
    noCandidates: {
      title: 'You need to add at least one candidate to proceed.',
      description: 'An election must have at least one candidate.',
    },
    candidate: {
      badge: 'Candidate {index}',
      photo: {
        label: 'Photo',
        upload: 'Upload Photo',
        change: 'Change Photo',
        placeholder: 'No photo uploaded',
      },
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Full name',
          validation: {
            required: 'Name is required',
          },
        },
        party: {
          label: 'Party/Affiliation',
          placeholder: 'Enter party or affiliation',
          validation: {
            required: 'Party/Affiliation is required',
          },
        },
        position: {
          label: 'Position',
          placeholder: 'Enter position title',
          validation: {
            required: 'Position is required',
          },
        },
        bio: {
          label: 'Biography',
          placeholder: 'Enter candidate biography',
          validation: {
            required: 'Biography is required',
            minLength: 'Biography must be at least 20 characters',
          },
        },
        twitter: {
          label: 'Twitter Handle',
          placeholder: '@username',
        },
        website: {
          label: 'Website',
          placeholder: 'https://example.com',
          validation: {
            url: 'Must be a valid URL',
          },
        },
      },
    },
    actions: {
      add: 'Add Candidate',
      remove: 'Remove Candidate',
      removed: {
        title: 'Candidate removed',
        description: 'The candidate has been successfully removed.',
      },
      cannotRemove: {
        title: 'Cannot Remove',
        description: 'An election must have at least one candidate.',
      },
    },
    validation: {
      title: 'Validation Error',
      description: 'Please fill in all required fields for each candidate.',
    },
    buttons: {
      previous: 'Back to Basic Info',
      next: 'Next: Advanced Settings',
    },
  },
  advancedSettings: {
    title: 'Advanced Settings',
    subtitle: 'Customize the appearance and behavior of your election.',
    customizableUI: {
      title: 'Customizable Voting UI',
      bannerImage: {
        label: 'Banner Image',
        description: 'Upload a banner image to customize the election page header. Recommended size: 1200x400 pixels.',
        upload: 'Upload Banner',
        change: 'Change Banner',
        placeholder: {
          title: 'No banner image uploaded',
          description: 'Upload a banner image to customize your election page',
        },
        alert:
          'The banner image will be displayed at the top of your election page. Choose an image that represents your election well.',
      },
    },
    buttons: {
      previous: 'Back to Candidates',
      create: 'Create Election',
    },
  },
  loading: {
    steps: [
      {
        title: 'Creating Election',
        description: 'Setting up election details and configuration',
      },
      {
        title: 'Publishing to Blockchain',
        description: 'Deploying smart contract and recording election data',
      },
      {
        title: 'Finalizing',
        description: 'Completing setup and preparing for voting',
      },
    ],
    success: {
      title: 'Election Created!',
      description: 'Your election has been successfully created and deployed to the blockchain',
      contractAddress: 'Contract Address',
      transactionHash: 'Transaction Hash',
      viewOnExplorer: 'View on Explorer',
      copyToClipboard: 'Copied to clipboard',
      actions: {
        viewElection: 'View Election',
        createAnother: 'Create Another Election',
      },
    },
    error: {
      title: 'Election Creation Failed',
      description: 'There was an error creating your election. Please try again.',
      retry: 'Try Again',
      return: 'Return to Form',
    },
  },
  form: {
    stepIndicator: 'Step {current} of {total}',
    tabs: {
      basicInfo: 'Basic Info',
      candidates: 'Candidates',
      advancedSettings: 'Advanced Settings',
    },
  },
};
