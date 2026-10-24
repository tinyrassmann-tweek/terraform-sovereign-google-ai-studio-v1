import { Business, Review, Job, ServiceCategory } from "./types.js";

export const initialBusinesses: Business[] = [
  {
    id: "biz-1",
    name: "Co-Pilot Companions",
    ownerName: "Marcus Vance",
    ownerEmail: "marcus@copilotcompanions.com",
    phone: "(512) 555-0192",
    description: "A friendly cooperative of human coaches and certified AI answering agents. We handle your incoming client messages, screen calls, and sort your messy digital inbox so you can have a peaceful dinner with your family.",
    location: "Austin, TX",
    rating: 4.8,
    reviewsCount: 34,
    services: [
      { name: "Everyday Email Companion Setup", category: ServiceCategory.EverydayAIHelpers, price: 19, unit: "month" },
      { name: "Friendly Phone Call Screener Setup", category: ServiceCategory.EverydayAIHelpers, price: 29, unit: "month" },
      { name: "Human-in-the-Loop Message Sync", category: ServiceCategory.FriendlyCoWorking, price: 15, unit: "hour" },
      { name: "Peace of Mind Inbox Clearing", category: ServiceCategory.EverydayAIHelpers, price: 25, unit: "session" }
    ],
    insuranceVetted: true,
    insurancePolicy: {
      carrier: "Mutual Peace & Liability Cover",
      policyNumber: "MPC-992031-TX",
      liabilityLimit: "$1,000,000",
      expiresAt: "2027-05-15",
      status: "verified"
    },
    monthlySubscribed: true,
    subscriptionPlan: "monthly_standard",
    subscriptionAmount: 49.00,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "biz-2",
    name: "Friendly Neighbor Automations",
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah@friendlyneighbor.net",
    phone: "(305) 555-0348",
    description: "We design simple, stress-free workflow connections that link your phone, spreadsheet, and calendar together. No high-tech jargon or intimidating code—just helpful, reliable setups that handle repetitive typing tasks on your behalf.",
    location: "Miami, FL",
    rating: 4.9,
    reviewsCount: 42,
    services: [
      { name: "Simple Smartphone Sync Tutorial", category: ServiceCategory.FriendlyCoWorking, price: 15, unit: "hour" },
      { name: "Peaceful Calendar-Spreadsheet Link", category: ServiceCategory.WorkflowAutomations, price: 39, unit: "setup" },
      { name: "Auto-Drafting Newsletter Assistant", category: ServiceCategory.CreativeSystems, price: 24, unit: "month" },
      { name: "Routine Digital Cleanup Coaching", category: ServiceCategory.FriendlyCoWorking, price: 20, unit: "hour" }
    ],
    insuranceVetted: true,
    insurancePolicy: {
      carrier: "Neighborly Cyber & Error Insurance",
      policyNumber: "NCE-88371-FL",
      liabilityLimit: "$500,000",
      expiresAt: "2026-11-01",
      status: "verified"
    },
    monthlySubscribed: true,
    subscriptionPlan: "monthly_standard",
    subscriptionAmount: 49.00,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "biz-3",
    name: "Calm & Creative Co-Workers",
    ownerName: "Daniel Wu",
    ownerEmail: "daniel@calmcreative.co",
    phone: "(206) 555-0143",
    description: "Affordable AI coaching and content help designed with good intentions. Learn how to use ChatGPT to draft social media posts, plan healthy meals, design family chore charts, or organize your local volunteer schedule.",
    location: "Seattle, WA",
    rating: 4.7,
    reviewsCount: 19,
    services: [
      { name: "Social Media Drafting Teamwork", category: ServiceCategory.CreativeSystems, price: 25, unit: "month" },
      { name: "ChatGPT 101 Creative Coaching", category: ServiceCategory.FriendlyCoWorking, price: 15, unit: "hour" },
      { name: "Peaceful Household Planner setup", category: ServiceCategory.PersonalWellness, price: 29, unit: "setup" },
      { name: "1-on-1 Empathy-Focused Tutoring", category: ServiceCategory.FriendlyCoWorking, price: 18, unit: "hour" }
    ],
    insuranceVetted: true,
    insurancePolicy: {
      carrier: "Indemnity Partners of America",
      policyNumber: "IPA-611029-WA",
      liabilityLimit: "$1,000,000",
      expiresAt: "2027-02-28",
      status: "verified"
    },
    monthlySubscribed: true,
    subscriptionPlan: "monthly_standard",
    subscriptionAmount: 49.00,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "biz-4",
    name: "Mindful Tech Partners",
    ownerName: "Caleb Vance",
    ownerEmail: "caleb@mindfultech.com",
    phone: "(303) 555-0185",
    description: "We help local bakery owners, therapists, artisans, and gig workers set up custom voice and message reminders. Find peace of mind knowing your clients are getting gentle, warm reminders automatically.",
    location: "Denver, CO",
    rating: 4.6,
    reviewsCount: 28,
    services: [
      { name: "Gentle Appointment SMS Automator", category: ServiceCategory.WorkflowAutomations, price: 19, unit: "month" },
      { name: "Answering Machine Voice Setup", category: ServiceCategory.EverydayAIHelpers, price: 35, unit: "setup" },
      { name: "Small Shop Chatbot Consultation", category: ServiceCategory.FriendlyCoWorking, price: 20, unit: "hour" },
      { name: "Sane Digital Boundary Planning", category: ServiceCategory.PersonalWellness, price: 25, unit: "session" }
    ],
    insuranceVetted: false,
    insurancePolicy: {
      carrier: "Geico Small Business General Cover",
      policyNumber: "GCO-344910-CO",
      liabilityLimit: "$500,000",
      expiresAt: "2026-09-12",
      status: "pending"
    },
    monthlySubscribed: true,
    subscriptionPlan: "monthly_standard",
    subscriptionAmount: 49.00,
    avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "biz-5",
    name: "Peace of Mind Assistants",
    ownerName: "Timothy Green",
    ownerEmail: "tim@peaceofmind.net",
    phone: "(615) 555-0133",
    description: "Everyday typing support, newsletter editing, document polishing, and friendly check-in automations designed specifically to give you back your peaceful hours.",
    location: "Nashville, TN",
    rating: 4.5,
    reviewsCount: 15,
    services: [
      { name: "Friendly Newsletter Polish", category: ServiceCategory.CreativeSystems, price: 15, unit: "session" },
      { name: "Document Cleanliness Assistant", category: ServiceCategory.EverydayAIHelpers, price: 12, unit: "hour" },
      { name: "Warm Routine Morning Checker", category: ServiceCategory.PersonalWellness, price: 10, unit: "month" }
    ],
    insuranceVetted: true,
    insurancePolicy: {
      carrier: "Allstate Caring Business Solutions",
      policyNumber: "ACS-550921-TN",
      liabilityLimit: "$500,000",
      expiresAt: "2026-12-15",
      status: "verified"
    },
    monthlySubscribed: false,
    subscriptionPlan: "none",
    subscriptionAmount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800"
  }
];

export const initialReviews: Review[] = [
  {
    id: "rev-1",
    businessId: "biz-1",
    consumerName: "Laura Henderson",
    rating: 5,
    text: "Co-Pilot Companions set up an email assistant for my local nursery business. Now my customers get warm, polite responses within ten minutes, and I get my weekends back. Extremely affordable and helpful!",
    date: "2026-06-20",
    verifiedJob: true
  },
  {
    id: "rev-2",
    businessId: "biz-1",
    consumerName: "Gregory Miller",
    rating: 4,
    text: "The phone screener takes messages beautifully. Highly recommend this to any therapist or self-employed worker who needs simple call answering.",
    date: "2026-06-12",
    verifiedJob: true
  },
  {
    id: "rev-3",
    businessId: "biz-2",
    consumerName: "Annette Alvarez",
    rating: 5,
    text: "Friendly Neighbor Automations built a peaceful spreadsheet link for my craft shop. No complicated software, just a beautiful, clean automated list of order dates. Sarah explained everything with absolute care.",
    date: "2026-06-25",
    verifiedJob: true
  },
  {
    id: "rev-4",
    businessId: "biz-3",
    consumerName: "Thomas Wright",
    rating: 5,
    text: "Daniel is a wonderful teacher. He spent an hour tutoring me on how to draft local club newsletters using ChatGPT. I feel so empowered and relieved!",
    date: "2026-05-18",
    verifiedJob: true
  }
];

export const initialJobs: Job[] = [
  {
    id: "job-101",
    businessId: "biz-1",
    businessName: "Co-Pilot Companions",
    consumerName: "Alice Peterson",
    consumerEmail: "alice.peterson@gmail.com",
    serviceName: "Human-in-the-Loop Message Sync",
    serviceCategory: ServiceCategory.FriendlyCoWorking,
    cost: 15,
    scheduleTime: "2026-07-05T09:30:00",
    recurring: "weekly",
    status: "scheduled"
  },
  {
    id: "job-102",
    businessId: "biz-1",
    businessName: "Co-Pilot Companions",
    consumerName: "Robert Dow",
    consumerEmail: "robert.dow@gmail.com",
    serviceName: "Friendly Phone Call Screener Setup",
    serviceCategory: ServiceCategory.EverydayAIHelpers,
    cost: 29,
    scheduleTime: "2026-07-06T13:00:00",
    recurring: "one_time",
    status: "active"
  },
  {
    id: "job-103",
    businessId: "biz-2",
    businessName: "Friendly Neighbor Automations",
    consumerName: "Annette Alvarez",
    consumerEmail: "annette.alvarez@yahoo.com",
    serviceName: "Simple Smartphone Sync Tutorial",
    serviceCategory: ServiceCategory.FriendlyCoWorking,
    cost: 15,
    scheduleTime: "2026-07-04T10:00:00",
    recurring: "weekly",
    status: "scheduled"
  },
  {
    id: "job-104",
    businessId: "biz-3",
    businessName: "Calm & Creative Co-Workers",
    consumerName: "David Sterling",
    consumerEmail: "sterling.david@outlook.com",
    serviceName: "ChatGPT 101 Creative Coaching",
    serviceCategory: ServiceCategory.FriendlyCoWorking,
    cost: 15,
    scheduleTime: "2026-07-01T08:00:00",
    recurring: "one_time",
    status: "completed",
    completionPhoto: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?auto=format&fit=crop&q=80&w=800",
    notes: "Completed our hour training session. David can now craft and format community schedules on his own."
  }
];
