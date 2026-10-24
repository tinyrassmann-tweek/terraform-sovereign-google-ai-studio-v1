export enum ServiceCategory {
  EverydayAIHelpers = "Everyday AI Helpers & Admins",
  FriendlyCoWorking = "Human-AI Co-Working & Coaching",
  WorkflowAutomations = "Peaceful Workflows & Automation",
  CreativeSystems = "Creative Content & Media Teamwork",
  PersonalWellness = "AI Wellness & Mindset Companions"
}

export interface ServicePrice {
  name: string;
  category: ServiceCategory;
  price: number;
  unit: string; // "hour", "sq_ft", "visit", etc.
}

export interface InsurancePolicy {
  carrier: string;
  policyNumber: string;
  liabilityLimit: string; // e.g. "$2,000,000"
  expiresAt: string;
  status: "pending" | "verified" | "rejected";
}

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  description: string;
  location: string; // e.g., "Austin, TX"
  rating: number;
  reviewsCount: number;
  services: ServicePrice[];
  insuranceVetted: boolean;
  insurancePolicy: InsurancePolicy;
  monthlySubscribed: boolean;
  subscriptionPlan: "monthly_standard" | "none";
  subscriptionAmount: number;
  avatarUrl: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  businessId: string;
  consumerName: string;
  rating: number;
  text: string;
  date: string;
  verifiedJob: boolean; // Flag if review is attached to a verified booking
}

export type JobStatus = "scheduled" | "en_route" | "active" | "completed";

export interface Job {
  id: string;
  businessId: string;
  businessName: string;
  consumerName: string;
  consumerEmail: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  cost: number;
  scheduleTime: string;
  recurring: "one_time" | "weekly" | "bi_weekly" | "monthly";
  status: JobStatus;
  notes?: string;
  completionPhoto?: string;
  offlineCaptured?: boolean; // Flag indicating if action was done offline
  offlineSavedAt?: string;
}

export interface EstimationRequest {
  category: ServiceCategory;
  zipCode: string;
  areaSize: number; // e.g. 500 sq ft
  complexity: "low" | "medium" | "high";
  materials: string; // Description or selection
  description: string;
}

export interface EstimationResult {
  estimatedCostLow: number;
  estimatedCostHigh: number;
  breakdown: {
    labor: number;
    materials: number;
    permitsAndFees: number;
  };
  materialsChecklist: string[];
  timelineWeeks: number;
  recommendations: string[];
  suggestedVendors: { id: string; name: string; costEstimate: number }[];
}
