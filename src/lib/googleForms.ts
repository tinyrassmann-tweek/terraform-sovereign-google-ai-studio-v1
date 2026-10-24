import { getAccessToken } from './auth';

export interface VettingApplicationResponse {
  id: string;
  submittedAt: string;
  contactName: string;
  companyName: string;
  einNumber: string;
  insuranceCarrier: string;
  policyNumber: string;
  websiteUrl: string;
  socialHandles: string;
  servicesOffered: string;
  proofOfWorkUrl: string;
  references: string[];
  selectedTier: 'Tier 1 ($29/mo)' | 'Tier 2 ($49/mo)' | 'Tier 3 ($99/mo)';
  status: 'pending_review' | 'approved' | 'action_required';
  referencesVerified: boolean;
  complianceAgreed: boolean;
}

export interface ConsumerFeedbackResponse {
  id: string;
  submittedAt: string;
  consumerName: string;
  providerName: string;
  rating: number; // 1-5
  timelinessScore: 'Exceeded Expectations' | 'Satisfactory' | 'Needs Improvement';
  referenceTrustVerified: boolean;
  testimonialText: string;
}

export interface GoogleFormsHubStats {
  totalApplicants: number;
  approvedOrchestrators: number;
  pendingVerifications: number;
  referenceVerificationRate: number; // e.g. 96%
  consumerSatisfactionAvg: number; // e.g. 4.9
  insuranceAuditCount: number;
}

// Initial default stats for TerraForm Sovereign Platform
export const initialFormStats: GoogleFormsHubStats = {
  totalApplicants: 48,
  approvedOrchestrators: 38,
  pendingVerifications: 10,
  referenceVerificationRate: 98,
  consumerSatisfactionAvg: 4.88,
  insuranceAuditCount: 38,
};

// Default sample applications submitted via Forms
export const initialFormApplications: VettingApplicationResponse[] = [
  {
    id: 'app-101',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    contactName: 'Marcus Vance',
    companyName: 'Co-Pilot Companions LLC',
    einNumber: 'XX-XXX9281',
    insuranceCarrier: 'Mutual Peace & Liability Cover',
    policyNumber: 'MPC-992031-TX',
    websiteUrl: 'https://copilotcompanions.com',
    socialHandles: '@copilot_helpers (IG) / FB: CopilotCompanions',
    servicesOffered: 'Everyday Email & Call Screeners, Co-Working Assistance',
    proofOfWorkUrl: 'https://copilotcompanions.com/case-studies',
    references: [
      'Sarah Jenkins (Austin Tech Guild) - (512) 555-0199 - Verified client of 2 years',
      'David Miller (Green Bakery) - david@greenbakery.org - Call screening partner',
      'Elena Rostova (Solo Freelancer) - elena@rostovadesign.co - Inbox management'
    ],
    selectedTier: 'Tier 2 ($49/mo)',
    status: 'approved',
    referencesVerified: true,
    complianceAgreed: true,
  },
  {
    id: 'app-102',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    contactName: 'Sarah Jenkins',
    companyName: 'Friendly Neighbor Automations',
    einNumber: 'XX-XXX4109',
    insuranceCarrier: 'Neighborly Cyber & Error Insurance',
    policyNumber: 'NCE-88371-FL',
    websiteUrl: 'https://friendlyneighbor.net',
    socialHandles: 'FB: FriendlyNeighborAuto',
    servicesOffered: 'Peaceful Workflow & Calendar Connections',
    proofOfWorkUrl: 'https://friendlyneighbor.net/demo',
    references: [
      'Dr. Robert Chen (Miami Dental) - rchen@miamidental.com - Calendar automation client',
      'Anita Gomez (Local Florist) - anita@gomezflowers.com - Order SMS reminders'
    ],
    selectedTier: 'Tier 2 ($49/mo)',
    status: 'approved',
    referencesVerified: true,
    complianceAgreed: true,
  },
  {
    id: 'app-103',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    contactName: 'Jonathan Hayes',
    companyName: 'Apex AI Agency',
    einNumber: 'XX-XXX1182',
    insuranceCarrier: 'State Farm Commercial',
    policyNumber: 'SF-102938-GA',
    websiteUrl: 'https://apexagency.io',
    socialHandles: 'LinkedIn: /in/jonathan-hayes-ai',
    servicesOffered: 'High-end B2B Automation Solutions',
    proofOfWorkUrl: 'https://apexagency.io/portfolio',
    references: [
      'Hiring Manager Reference #1 - Pending Call Audit',
      'Client Reference #2 - Pending Email Response'
    ],
    selectedTier: 'Tier 1 ($29/mo)',
    status: 'pending_review',
    referencesVerified: false,
    complianceAgreed: true,
  }
];

export const initialConsumerFeedbacks: ConsumerFeedbackResponse[] = [
  {
    id: 'fb-201',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    consumerName: 'Dr. Evelyn Reed',
    providerName: 'Co-Pilot Companions',
    rating: 5,
    timelinessScore: 'Exceeded Expectations',
    referenceTrustVerified: true,
    testimonialText: 'Knowing Marcus was vetted with checked references gave me total peace of mind. The call screener setup saved me 10 hours this week!'
  },
  {
    id: 'fb-202',
    submittedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    consumerName: 'Carlos Mendez',
    providerName: 'Friendly Neighbor Automations',
    rating: 5,
    timelinessScore: 'Exceeded Expectations',
    referenceTrustVerified: true,
    testimonialText: 'Very transparent platform. Verified EIN and real client references are so reassuring compared to random internet listings.'
  }
];

/**
 * Creates an official Google Form for Orchestrator Vetting in Google Drive
 */
export async function createGoogleFormForVetting(): Promise<{ formId: string; responderUri: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google Sign-In required to deploy forms directly to your Google Drive.');
  }

  const formPayload = {
    info: {
      title: 'TerraForm Sovereign - Orchestrator Vetting & Tier Onboarding Application',
      documentTitle: 'Orchestrator Vetting Form - TerraForm Sovereign',
    }
  };

  const response = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create Google Form');
  }

  const formData = await response.json();
  const formId = formData.formId;

  // Now populate batch update with items
  const updatePayload = {
    requests: [
      {
        createItem: {
          item: {
            title: 'Primary Contact / Owner Full Name',
            textItem: {},
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Official Legal Company Name & EIN Tax ID Number',
            description: 'Enter registered entity name and EIN status for verified listing status.',
            textItem: {},
          },
          location: { index: 1 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Business Insurance Carrier & Policy Details',
            description: 'Enter insurance carrier, policy number, and coverage limit (e.g. Mutual Peace & Liability, $1,000,000).',
            textItem: {},
          },
          location: { index: 2 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Official Website & Social Media Pages',
            description: 'Provide website URL and Instagram / Facebook / LinkedIn handles.',
            textItem: {},
          },
          location: { index: 3 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Services & AI Capabilities Rendered',
            description: 'List the everyday AI helper, co-working, or workflow automation services you offer.',
            textItem: { paragraph: true },
          },
          location: { index: 4 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Proof of Work / Portfolio / Demonstration Link',
            textItem: {},
          },
          location: { index: 5 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Client Reference #1 (Name, Email/Phone, Project Details)',
            description: 'Verifiable prior customer reference to ensure quality standards.',
            textItem: { paragraph: true },
          },
          location: { index: 6 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Client Reference #2 (Name, Email/Phone, Project Details)',
            textItem: { paragraph: true },
          },
          location: { index: 7 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Client Reference #3 (Name, Email/Phone, Project Details)',
            textItem: { paragraph: true },
          },
          location: { index: 8 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Desired Directory Subscription Tier',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Tier 1: Sponsored - $29/mo' },
                    { value: 'Tier 2: Direct Reviews & Verified Badge - $49/mo' },
                    { value: 'Tier 3: Sovereign Preferred Enterprise - $99/mo' },
                  ],
                },
              },
            },
          },
          location: { index: 9 },
        },
      },
    ],
  };

  await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePayload),
  });

  return {
    formId,
    responderUri: formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`,
  };
}

/**
 * Creates an official Google Form for Consumer Post-Service Quality Audit
 */
export async function createGoogleFormForConsumerFeedback(): Promise<{ formId: string; responderUri: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google Sign-In required to deploy forms directly to your Google Drive.');
  }

  const formPayload = {
    info: {
      title: 'TerraForm Sovereign - Consumer Service Quality & Satisfaction Audit',
      documentTitle: 'Consumer Feedback Form - TerraForm Sovereign',
    }
  };

  const response = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create Google Form');
  }

  const formData = await response.json();
  const formId = formData.formId;

  const updatePayload = {
    requests: [
      {
        createItem: {
          item: {
            title: 'Consumer Full Name & Service Order ID',
            textItem: {},
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Orchestrator / Provider Name',
            textItem: {},
          },
          location: { index: 1 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Overall Service Rating',
            questionItem: {
              question: {
                required: true,
                scaleQuestion: {
                  low: 1,
                  high: 5,
                  lowLabel: 'Poor',
                  highLabel: 'Exceeded Expectations',
                },
              },
            },
          },
          location: { index: 2 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Service Quality & Timeliness Standard',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Exceeded Expectations' },
                    { value: 'Satisfactory' },
                    { value: 'Needs Improvement' },
                  ],
                },
              },
            },
          },
          location: { index: 3 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Detailed Experience Notes & Directory Testimonial',
            textItem: { paragraph: true },
          },
          location: { index: 4 },
        },
      },
    ],
  };

  await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePayload),
  });

  return {
    formId,
    responderUri: formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`,
  };
}

/**
 * Fetches submitted responses for a given Google Form ID
 */
export async function fetchFormResponses(formId: string): Promise<any[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google Sign-In required to fetch live Google Form responses.');
  }

  const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch form responses');
  }

  const data = await response.json();
  return data.responses || [];
}
