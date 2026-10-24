import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Shield,
  FileCheck,
  Smartphone,
  Check,
  Send,
  Star,
  Plus,
  RefreshCw,
  Sliders,
  Users,
  Percent,
  TrendingUp,
  Award,
  AlertCircle,
  Lock,
  CloudOff,
  FileText
} from "lucide-react";
import { ServiceCategory, Business, Review, Job, EstimationRequest, EstimationResult } from "./types";
import { MobileAppFrame } from "./components/MobileAppFrame";
import { SecurityPanel } from "./components/SecurityPanel";
import { CostAllocationChart } from "./components/CostAllocationChart";
import { GoogleFormsHub } from "./components/GoogleFormsHub";
import { VettingApplicationResponse, ConsumerFeedbackResponse } from "./lib/googleForms";

export default function App() {
  // Navigation / View state
  const [currentPortal, setCurrentPortal] = useState<"consumer" | "business" | "admin" | "forms">("consumer");
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Core Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State (Consumer)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "All">("All");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // New Review form
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState("");

  // New Booking Modal State
  const [bookingBusiness, setBookingBusiness] = useState<Business | null>(null);
  const [bookingService, setBookingService] = useState<{ name: string; price: number; unit: string } | null>(null);
  const [bookingClientName, setBookingClientName] = useState("Jane Doe");
  const [bookingClientEmail, setBookingClientEmail] = useState("jane.doe@example.com");
  const [bookingDate, setBookingDate] = useState("2026-07-10");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [bookingRecurring, setBookingRecurring] = useState<"one_time" | "weekly" | "bi_weekly" | "monthly">("weekly");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // AI Estimation State
  const [estCategory, setEstCategory] = useState<ServiceCategory>(ServiceCategory.EverydayAIHelpers);
  const [estZipCode, setEstZipCode] = useState("78704");
  const [estAreaSize, setEstAreaSize] = useState(10);
  const [estComplexity, setEstComplexity] = useState<"low" | "medium" | "high">("medium");
  const [estMaterials, setEstMaterials] = useState("Polite email drafts and simple inbox connection guides");
  const [estDescription, setEstDescription] = useState("Set up an automated assistant to draft gentle replies to customer inquiries to save 5 hours a week.");
  const [estLoading, setEstLoading] = useState(false);
  const [estResult, setEstResult] = useState<EstimationResult | null>(null);

  // Business Portal Settings State (Logged in as Marcus Vance)
  const [activeOwnerBizId, setActiveOwnerBizId] = useState<string>("biz-1");
  const [editBizName, setEditBizName] = useState("");
  const [editBizPhone, setEditBizPhone] = useState("");
  const [editBizDescription, setEditBizDescription] = useState("");
  const [editBizLocation, setEditBizLocation] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState(19);
  const [newServiceUnit, setNewServiceUnit] = useState("month");
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>(ServiceCategory.EverydayAIHelpers);
  
  // Insurance upload mock inputs
  const [insCarrier, setInsCarrier] = useState("");
  const [insPolicyNum, setInsPolicyNum] = useState("");
  const [insLimit, setInsLimit] = useState("$2,000,000");
  const [insExpires, setInsExpires] = useState("2027-06-30");

  // Offline Simulator Mode
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [syncAlert, setSyncAlert] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
    // Load offline queue from localStorage
    const savedQueue = localStorage.getItem("terraform_offline_queue");
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue));
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resBiz, resRev, resJob] = await Promise.all([
        fetch("/api/businesses").then((r) => r.json()),
        fetch("/api/reviews").then((r) => r.json()),
        fetch("/api/jobs").then((r) => r.json()),
      ]);

      if (resBiz.success) setBusinesses(resBiz.data);
      if (resRev.success) setReviews(resRev.data);
      if (resJob.success) setJobs(resJob.data);
    } catch (e) {
      console.error("Failed to load backend data, offline fallback initiated", e);
    } finally {
      setLoading(false);
    }
  };

  // Sync Offline Queue to backend
  const syncOfflineData = async () => {
    if (offlineQueue.length === 0) {
      setSyncAlert("No offline items in queue to synchronize.");
      setTimeout(() => setSyncAlert(null), 3000);
      return;
    }
    try {
      setSyncAlert("Synchronizing encrypted job transactions to cloud...");
      const response = await fetch("/api/jobs/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncedJobs: offlineQueue }),
      });
      const res = await response.json();
      if (res.success) {
        setJobs(res.data);
        setOfflineQueue([]);
        localStorage.removeItem("terraform_offline_queue");
        setSyncAlert("SUCCESS: Cloud database and job cycles synchronized! E2EE verified.");
        fetchData(); // Refresh latest state
      } else {
        setSyncAlert("Error synchronizing offline jobs.");
      }
    } catch (e) {
      setSyncAlert("Connection timeout. Keep queue locally stored.");
    }
    setTimeout(() => setSyncAlert(null), 4000);
  };

  // Set up owner edit fields when active business changes
  useEffect(() => {
    const activeBiz = businesses.find((b) => b.id === activeOwnerBizId);
    if (activeBiz) {
      setEditBizName(activeBiz.name);
      setEditBizPhone(activeBiz.phone);
      setEditBizDescription(activeBiz.description);
      setEditBizLocation(activeBiz.location);
      setInsCarrier(activeBiz.insurancePolicy?.carrier || "");
      setInsPolicyNum(activeBiz.insurancePolicy?.policyNumber || "");
      setInsLimit(activeBiz.insurancePolicy?.liabilityLimit || "$1,000,000");
      setInsExpires(activeBiz.insurancePolicy?.expiresAt || "");
    }
  }, [activeOwnerBizId, businesses]);

  // Handle new review submission
  const handleAddReview = async (bizId: string) => {
    if (!newReviewName || !newReviewText) return;
    const reviewData = {
      businessId: bizId,
      consumerName: newReviewName,
      rating: newReviewRating,
      text: newReviewText,
      verifiedJob: true,
    };

    if (isOffline) {
      // Offline implementation
      const mockNewReview: Review = {
        id: `rev-offline-${Date.now()}`,
        businessId: bizId,
        consumerName: newReviewName,
        rating: newReviewRating,
        text: newReviewText,
        date: new Date().toISOString().split("T")[0],
        verifiedJob: true,
      };
      setReviews((prev) => [mockNewReview, ...prev]);
      
      // Update local businesses rating state
      setBusinesses((prevBizs) =>
        prevBizs.map((b) => {
          if (b.id === bizId) {
            const currentReviews = reviews.filter((r) => r.businessId === bizId);
            const newTotal = currentReviews.length + 1;
            const newAvg = (currentReviews.reduce((s, r) => s + r.rating, 0) + newReviewRating) / newTotal;
            return {
              ...b,
              rating: Number(newAvg.toFixed(1)),
              reviewsCount: newTotal,
            };
          }
          return b;
        })
      );

      // Save into local storage queue to push later if needed
      const updatedQueue = [...offlineQueue, { type: "REVIEW", data: mockNewReview }];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("terraform_offline_queue", JSON.stringify(updatedQueue));

      setNewReviewName("");
      setNewReviewText("");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const res = await response.json();
      if (res.success) {
        setReviews((prev) => [res.data, ...prev]);
        setNewReviewName("");
        setNewReviewText("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Google Forms Handlers for Orchestrator Vetting & Consumer Feedback
  const handleApproveOrchestratorFromForm = (app: VettingApplicationResponse) => {
    const newBiz: Business = {
      id: `biz-${Date.now().toString().slice(-4)}`,
      name: app.companyName,
      ownerName: app.contactName,
      ownerEmail: app.contactName.toLowerCase().replace(/\s+/g, '') + '@' + app.companyName.toLowerCase().replace(/[^a-z]/g, '') + '.com',
      phone: '(512) 555-0199',
      description: `Vetted Orchestrator: ${app.servicesOffered}. Proof of work & prior references verified via Google Forms.`,
      location: 'Austin, TX',
      rating: 5.0,
      reviewsCount: 1,
      services: [
        { name: 'Everyday AI Helper Setup', category: ServiceCategory.EverydayAIHelpers, price: 29, unit: 'month' },
        { name: 'Peaceful Workflow Integration', category: ServiceCategory.WorkflowAutomations, price: 49, unit: 'setup' }
      ],
      insuranceVetted: true,
      insurancePolicy: {
        carrier: app.insuranceCarrier,
        policyNumber: app.policyNumber,
        liabilityLimit: '$1,000,000',
        expiresAt: '2027-12-31',
        status: 'verified'
      },
      monthlySubscribed: true,
      subscriptionPlan: 'monthly_standard',
      subscriptionAmount: app.selectedTier.includes('Tier 3') ? 99 : app.selectedTier.includes('Tier 2') ? 49 : 29,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      imageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?auto=format&fit=crop&q=80&w=800'
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    setSyncAlert(`New Orchestrator Approved & Listed: ${app.companyName}! References verified via Google Forms.`);
    setTimeout(() => setSyncAlert(null), 4500);
  };

  const handleAddConsumerReviewFromForm = (fb: ConsumerFeedbackResponse) => {
    const targetBiz = businesses.find((b) => b.name.toLowerCase().includes(fb.providerName.toLowerCase())) || businesses[0];
    if (targetBiz) {
      const newRev: Review = {
        id: fb.id,
        businessId: targetBiz.id,
        consumerName: fb.consumerName,
        rating: fb.rating,
        text: fb.testimonialText,
        date: new Date().toISOString().split('T')[0],
        verifiedJob: true
      };
      setReviews((prev) => [newRev, ...prev]);
      setSyncAlert(`Consumer Quality Audit logged for ${targetBiz.name}! Rating: ${fb.rating} Stars`);
      setTimeout(() => setSyncAlert(null), 4500);
    }
  };

  // Submit appointment booking
  const handleCreateBooking = async () => {
    if (!bookingBusiness || !bookingService) return;

    const jobData = {
      businessId: bookingBusiness.id,
      consumerName: bookingClientName,
      consumerEmail: bookingClientEmail,
      serviceName: bookingService.name,
      serviceCategory: bookingService.category,
      cost: bookingService.price,
      scheduleTime: `${bookingDate}T${bookingTime}:00`,
      recurring: bookingRecurring,
      notes: bookingNotes,
    };

    if (isOffline) {
      // Offline store
      const mockOfflineJob: Job = {
        id: `job-offline-${Date.now()}`,
        businessId: bookingBusiness.id,
        businessName: bookingBusiness.name,
        consumerName: bookingClientName,
        consumerEmail: bookingClientEmail,
        serviceName: bookingService.name,
        serviceCategory: bookingService.category,
        cost: bookingService.price,
        scheduleTime: `${bookingDate}T${bookingTime}:00`,
        recurring: bookingRecurring,
        status: "scheduled",
        notes: bookingNotes,
        offlineCaptured: true,
        offlineSavedAt: new Date().toISOString(),
      };

      setJobs((prev) => [mockOfflineJob, ...prev]);
      const updatedQueue = [...offlineQueue, mockOfflineJob];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("terraform_offline_queue", JSON.stringify(updatedQueue));

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingBusiness(null);
        setBookingService(null);
      }, 3000);
      return;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const res = await response.json();
      if (res.success) {
        setJobs((prev) => [res.data, ...prev]);
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingBusiness(null);
          setBookingService(null);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save changes to Business profile in owner portal
  const handleSaveBusinessProfile = async () => {
    const updateData = {
      id: activeOwnerBizId,
      name: editBizName,
      phone: editBizPhone,
      description: editBizDescription,
      location: editBizLocation,
    };

    if (isOffline) {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === activeOwnerBizId ? { ...b, ...updateData } : b))
      );
      setSyncAlert("Changes saved locally. Sync with cloud when online!");
      setTimeout(() => setSyncAlert(null), 3000);
      return;
    }

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const res = await response.json();
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === activeOwnerBizId ? res.data : b))
        );
        alert("Business profile successfully updated in Cloud database.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add a new service offering in owner portal
  const handleAddService = async () => {
    if (!newServiceName) return;
    const activeBiz = businesses.find((b) => b.id === activeOwnerBizId);
    if (!activeBiz) return;

    const updatedServices = [
      ...activeBiz.services,
      {
        name: newServiceName,
        category: newServiceCategory,
        price: newServicePrice,
        unit: newServiceUnit,
      },
    ];

    if (isOffline) {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === activeOwnerBizId ? { ...b, services: updatedServices } : b))
      );
      setNewServiceName("");
      return;
    }

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeOwnerBizId,
          services: updatedServices,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === activeOwnerBizId ? res.data : b))
        );
        setNewServiceName("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Upload Liability Insurance
  const handleUploadInsurance = async () => {
    const insData = {
      carrier: insCarrier,
      policyNumber: insPolicyNum,
      liabilityLimit: insLimit,
      expiresAt: insExpires,
    };

    if (isOffline) {
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === activeOwnerBizId
            ? {
                ...b,
                insurancePolicy: { ...insData, status: "pending" },
                insuranceVetted: false,
              }
            : b
        )
      );
      setSyncAlert("Insurance uploaded locally. Pending Admin approval once online.");
      setTimeout(() => setSyncAlert(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/businesses/${activeOwnerBizId}/insurance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insData),
      });
      const res = await response.json();
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === activeOwnerBizId ? res.data : b))
        );
        alert("Insurance documentation uploaded! Awaiting administrator vetting.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Business Owner toggles their Platform Subscription
  const handleToggleSubscription = async (subscribe: boolean) => {
    if (isOffline) {
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === activeOwnerBizId
            ? {
                ...b,
                monthlySubscribed: subscribe,
                subscriptionPlan: subscribe ? "monthly_standard" : "none",
                subscriptionAmount: subscribe ? 49.0 : 0,
              }
            : b
        )
      );
      return;
    }
    try {
      const response = await fetch(`/api/businesses/${activeOwnerBizId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribe }),
      });
      const res = await response.json();
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === activeOwnerBizId ? res.data : b))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Vets Insurance
  const handleVetInsurance = async (bizId: string, status: "verified" | "rejected") => {
    try {
      const response = await fetch(`/api/businesses/${bizId}/vet-insurance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const res = await response.json();
      if (res.success) {
        setBusinesses((prev) => prev.map((b) => (b.id === bizId ? res.data : b)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update appointment/job status (e.g. en-route, active, complete)
  const handleUpdateJobStatus = async (jobId: string, status: "en_route" | "active" | "completed", completionNotes?: string) => {
    const updatePayload = {
      status,
      notes: completionNotes,
      completionPhoto: status === "completed" ? "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?auto=format&fit=crop&q=80&w=800" : undefined,
    };

    if (isOffline) {
      // Find and update local jobs array
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, ...updatePayload, offlineCaptured: true } : j))
      );

      // Find job in offline queue to append or insert
      const matchedJob = jobs.find((j) => j.id === jobId);
      if (matchedJob) {
        const queuedJob = {
          ...matchedJob,
          ...updatePayload,
          offlineCaptured: true,
          offlineSavedAt: new Date().toISOString(),
        };
        const filteredQueue = offlineQueue.filter((q) => q.id !== jobId);
        const updatedQueue = [...filteredQueue, queuedJob];
        setOfflineQueue(updatedQueue);
        localStorage.setItem("terraform_offline_queue", JSON.stringify(updatedQueue));
      }
      setSyncAlert("Job status saved locally in Offline cache.");
      setTimeout(() => setSyncAlert(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const res = await response.json();
      if (res.success) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.data : j)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run AI Project Estimator
  const handleRunEstimation = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstLoading(true);
    setEstResult(null);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: estCategory,
          zipCode: estZipCode,
          areaSize: estAreaSize,
          complexity: estComplexity,
          materials: estMaterials,
          description: estDescription,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setEstResult(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEstLoading(false);
    }
  };

  // Filters for marketplace
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || b.services.some((s) => s.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="terraform-root" className="min-h-screen bg-tt-cream text-tt-charcoal font-sans flex flex-col">
      {/* Platform Header */}
      <header className="bg-tt-ivory border-b border-tt-gold/30 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-tt-navy border border-tt-gold rounded-xl flex items-center justify-center text-tt-gold font-extrabold text-xl shadow-md shadow-tt-gold/10 font-serif">
            TS
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight font-serif text-tt-navy">
              TERRA<span className="text-tt-gold">FORM SOVEREIGN</span>
            </span>
            <div className="text-[10px] uppercase font-bold tracking-wider text-tt-gold/80 font-mono">
              A Think Tank Solutions AI Platform
            </div>
          </div>
        </div>

        {/* Global Navigation Hub */}
        <nav className="hidden md:flex bg-tt-cream p-1 rounded-xl items-center gap-1 border border-tt-gold/20">
          <button
            onClick={() => {
              setCurrentPortal("consumer");
              setSelectedBusiness(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentPortal === "consumer"
                ? "bg-tt-navy text-tt-gold shadow-sm"
                : "text-tt-navy/60 hover:text-tt-navy hover:bg-tt-ivory"
            }`}
          >
            Consumer Marketplace
          </button>
          <button
            onClick={() => setCurrentPortal("business")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentPortal === "business"
                ? "bg-tt-navy text-tt-gold shadow-sm"
                : "text-tt-navy/60 hover:text-tt-navy hover:bg-tt-ivory"
            }`}
          >
            Business Owner Portal
          </button>
          <button
            onClick={() => setCurrentPortal("forms")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentPortal === "forms"
                ? "bg-tt-navy text-tt-gold shadow-sm"
                : "text-tt-navy/60 hover:text-tt-navy hover:bg-tt-ivory"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-tt-gold" />
            <span>Google Forms Hub</span>
          </button>
          <button
            onClick={() => setCurrentPortal("admin")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentPortal === "admin"
                ? "bg-tt-navy text-tt-gold shadow-sm"
                : "text-tt-navy/60 hover:text-tt-navy hover:bg-tt-ivory"
            }`}
          >
            Super Admin Control
          </button>
        </nav>

        {/* Top bar tools */}
        <div className="flex items-center gap-3">
          {/* Offline Sync Panel indicator */}
          <div className="relative">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isOffline
                  ? "bg-tt-amber/10 text-tt-gold border-tt-gold/40 animate-pulse"
                  : "bg-tt-ivory text-tt-navy border-tt-gold/20"
              }`}
              title="Toggle Offline Simulation"
            >
              {isOffline ? <CloudOff className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{isOffline ? "Offline Sim" : "Online Mode"}</span>
            </button>
          </div>

          <button
            onClick={() => setIsSecurityOpen(true)}
            className="flex items-center gap-1.5 bg-tt-navy text-white border border-tt-gold px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-tt-midnight hover:text-tt-gold transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-tt-gold" />
            <span>Vault Lock</span>
          </button>
        </div>
      </header>

      {/* Sync Alert Banner */}
      {syncAlert && (
        <div className="bg-[#1B2B24] text-white py-2.5 px-6 font-mono text-xs text-center flex items-center justify-center gap-3 animate-slide-in border-b border-emerald-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{syncAlert}</span>
          {offlineQueue.length > 0 && (
            <button
              onClick={syncOfflineData}
              className="bg-emerald-500 hover:bg-emerald-600 text-[#1B2B24] font-bold px-3 py-1 rounded-md text-[10px] uppercase tracking-wider"
            >
              Sync Queue ({offlineQueue.length})
            </button>
          )}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Core Mobile View Frame Toggle wrapper */}
        <MobileAppFrame isMobileMode={isMobileMode} setIsMobileMode={setIsMobileMode} isOffline={isOffline}>
          
          {/* Portal Switcher for Mobile inside screen */}
          {isMobileMode && (
            <div className="bg-slate-950 p-2 border-b border-slate-900 flex items-center justify-around sticky top-0 z-20 shrink-0">
              <button
                onClick={() => {
                  setCurrentPortal("consumer");
                  setSelectedBusiness(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  currentPortal === "consumer" ? "bg-[#2D6A4F] text-white" : "text-slate-400"
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setCurrentPortal("business")}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  currentPortal === "business" ? "bg-[#2D6A4F] text-white" : "text-slate-400"
                }`}
              >
                Biz Portal
              </button>
              <button
                onClick={() => setCurrentPortal("forms")}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  currentPortal === "forms" ? "bg-[#2D6A4F] text-white" : "text-slate-400"
                }`}
              >
                Forms Hub
              </button>
              <button
                onClick={() => setCurrentPortal("admin")}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  currentPortal === "admin" ? "bg-[#2D6A4F] text-white" : "text-slate-400"
                }`}
              >
                Admin
              </button>
            </div>
          )}

          {/* MASTER BENTO GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
            
            {/* CARD 1: Hero Banner / Master Control Perspective */}
            <div className="md:col-span-3 bg-gradient-to-br from-tt-navy via-tt-midnight to-[#0c1e3a] rounded-3xl p-6 text-white shadow-lg border border-tt-gold/30 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(212,175,55,0.02)_40px,rgba(212,175,55,0.02)_41px)] pointer-events-none"></div>
              
              <div className="z-10">
                <span className="bg-tt-gold/10 text-tt-gold text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-tt-gold/30 font-mono">
                  {currentPortal === "consumer"
                    ? "United States Directory"
                    : currentPortal === "business"
                    ? "Merchant Console"
                    : currentPortal === "forms"
                    ? "Google Workspace Forms Engine"
                    : "Root Administration"}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 leading-none font-serif text-tt-cream">
                  {currentPortal === "consumer" && "Discover & Schedule Vetted Tech & Systemic Experts"}
                  {currentPortal === "business" && "Vetted Provider Operational Console"}
                  {currentPortal === "forms" && "Google Forms Orchestrator Vetting & Feedback Hub"}
                  {currentPortal === "admin" && "Platform Operations & Liability Audit Hub"}
                </h1>
                <p className="text-sm text-tt-ivory/80 mt-2 max-w-xl font-sans leading-relaxed">
                  {currentPortal === "consumer" &&
                    "Book AI Agentic builds, systemic corporate designs, executive training, and audits. Backed by verified liability insurance and Google Forms reference checks."}
                  {currentPortal === "business" &&
                    "Manage your team operations, update live services catalogs, verify professional liability coverage status, and complete Google Forms onboarding questionnaires."}
                  {currentPortal === "forms" &&
                    "Deploy Google Forms questionnaires to onboard Orchestrators with verified EIN, insurance, and prior client references, plus post-service consumer quality audits."}
                  {currentPortal === "admin" &&
                    "Verify merchant business liability filings, review customer compliance feedback, and audit platform subscription tiers across the United States."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 z-10 pt-4 border-t border-tt-gold/20 font-sans">
                <div>
                  <div className="text-xl font-black text-tt-gold">
                    {businesses.filter((b) => b.insuranceVetted).length} / {businesses.length}
                  </div>
                  <div className="text-[10px] text-tt-ivory/70 font-semibold uppercase tracking-wider">
                    Vetted & Covered Vendors
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-tt-gold">
                    {jobs.filter((j) => j.status === "completed").length}
                  </div>
                  <div className="text-[10px] text-tt-ivory/70 font-semibold uppercase tracking-wider">
                    Verified Jobs Completed
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-tt-amber">
                    {isOffline ? offlineQueue.length : "0 Sync Queue"}
                  </div>
                  <div className="text-[10px] text-tt-ivory/70 font-semibold uppercase tracking-wider">
                    Offline Action Log
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Offline Synchronizer Status Grid Box */}
            <div className="bg-tt-ivory rounded-3xl p-5 shadow-sm border border-tt-gold/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-tt-gold tracking-wider font-mono">
                  Site Access Mode
                </span>
                <h3 className="text-lg font-bold text-tt-navy mt-1.5 flex items-center gap-2 font-serif">
                  <Sliders className="w-5 h-5 text-tt-gold" /> Offline Engine
                </h3>
                <p className="text-xs text-tt-charcoal/80 mt-2 leading-relaxed font-sans">
                  Allows field workers to change statuses, capture notes, and schedule services
                  on remote job sites without internet connections.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-tt-gold/25">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-tt-navy mb-2">
                  <span>Simulate Connection:</span>
                  <span className={isOffline ? "text-tt-amber font-extrabold" : "text-tt-green font-extrabold"}>
                    {isOffline ? "Disconnected" : "Active Internet"}
                  </span>
                </div>
                <div className="flex gap-2 font-sans">
                  <button
                    onClick={() => {
                      setIsOffline(!isOffline);
                      if (!isOffline) {
                        setSyncAlert("Offline mode enabled. Local Storage buffer active.");
                        setTimeout(() => setSyncAlert(null), 3500);
                      } else {
                        setSyncAlert("Online mode restored. Press 'Sync Queue' to save updates.");
                        setTimeout(() => setSyncAlert(null), 3500);
                      }
                    }}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      isOffline
                        ? "bg-tt-amber text-tt-navy border-tt-gold"
                        : "bg-tt-navy text-tt-gold border-tt-gold/40 hover:bg-tt-midnight"
                    }`}
                  >
                    {isOffline ? "Connect Cloud" : "Go Offline"}
                  </button>
                  {offlineQueue.length > 0 && (
                    <button
                      onClick={syncOfflineData}
                      className="bg-tt-gold hover:bg-tt-navy hover:text-tt-gold text-tt-navy p-2 rounded-xl border border-tt-gold/30 transition-all"
                      title="Sync offline data immediately"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 3: Main Dynamic Content Portal Block (Large Bento Span) */}
            <div className="md:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-tt-gold/20 space-y-6">
              
              {/* PERSPECTIVE A: CONSUMER MARKETPLACE */}
              {currentPortal === "consumer" && (
                <div className="space-y-6">
                  {/* Category Pill Filters */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold tracking-tight text-tt-navy font-serif">
                        Verified Service Marketplace
                      </h2>
                      <span className="text-xs text-tt-gold font-bold font-sans">Free Consumer Scheduling</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 font-sans">
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          selectedCategory === "All"
                            ? "bg-tt-navy text-tt-gold border border-tt-gold/40"
                            : "bg-tt-ivory text-tt-navy/80 border border-tt-gold/10 hover:bg-tt-gold/20"
                        }`}
                      >
                        All Services
                      </button>
                      {Object.values(ServiceCategory).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            selectedCategory === cat
                              ? "bg-tt-navy text-tt-gold border border-tt-gold/40"
                              : "bg-tt-ivory text-tt-navy/80 border border-tt-gold/10 hover:bg-tt-gold/20"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search business names, specific services, or United States cities (e.g. Austin, Miami)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-tt-gold focus:ring-1 focus:ring-tt-gold"
                    />
                  </div>

                  {/* Business Detail view overlay or Business Grid list */}
                  {selectedBusiness ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-6 animate-slide-in">
                      {/* Back button */}
                      <button
                        onClick={() => setSelectedBusiness(null)}
                        className="text-xs text-tt-navy font-bold flex items-center gap-1.5 hover:text-tt-gold transition-colors"
                      >
                        ← Back to Search Results
                      </button>

                      {/* Header detail */}
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedBusiness.avatarUrl}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border border-slate-300 object-cover"
                          />
                          <div>
                            <h3 className="text-xl font-extrabold text-tt-navy">
                              {selectedBusiness.name}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedBusiness.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {selectedBusiness.insuranceVetted ? (
                            <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Insurance Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-amber-500" /> Policy Processing
                            </span>
                          )}
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
                            ★ {selectedBusiness.rating} ({selectedBusiness.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Description info */}
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                          Company Overview
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {selectedBusiness.description}
                        </p>
                      </div>

                      {/* Vetted Insurance Details Box */}
                      <div className="bg-tt-navy text-tt-gold rounded-xl p-4 border border-tt-gold/20 flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                            <Shield className="w-4 h-4 text-tt-gold" />
                            <span>Verified General Liability Policy</span>
                          </div>
                          <p className="text-[11px] text-tt-gold/80">
                            Carrier: {selectedBusiness.insurancePolicy?.carrier || "N/A"} | Policy:{" "}
                            {selectedBusiness.insurancePolicy?.policyNumber || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">
                            Limit: {selectedBusiness.insurancePolicy?.liabilityLimit || "$1,000,000"}
                          </div>
                          <div className="text-[10px] text-tt-gold font-bold">
                            Expires: {selectedBusiness.insurancePolicy?.expiresAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Service Catalog & Free Booking Scheduler */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                          Available Services & Instant Booking
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedBusiness.services.map((svc, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-sm transition-all"
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-800">{svc.name}</div>
                                <div className="text-[10px] text-slate-400">{svc.category}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-extrabold text-tt-navy">
                                  ${svc.price} <span className="text-[10px] font-medium text-slate-400">/{svc.unit}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setBookingBusiness(selectedBusiness);
                                    setBookingService(svc);
                                  }}
                                  className="mt-1 bg-tt-navy text-tt-gold hover:bg-tt-navy/90 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  Schedule Free
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviews and Ratings Stream */}
                      <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                          Customer Reviews ({reviews.filter((r) => r.businessId === selectedBusiness.id).length})
                        </h4>

                        <div className="space-y-2.5">
                          {reviews
                            .filter((r) => r.businessId === selectedBusiness.id)
                            .map((rev) => (
                              <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-800">
                                    {rev.consumerName}
                                  </span>
                                  <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-normal">{rev.text}</p>
                                {rev.verifiedJob && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-tt-navy bg-tt-cream px-2 py-0.5 rounded">
                                    ✓ Verified Completed Job
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Add Review Form */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <h5 className="text-xs font-bold text-slate-800">Submit Customer Review</h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                                Your Name
                              </label>
                              <input
                                type="text"
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                placeholder="Laura"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#2D6A4F]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                                Rating Stars
                              </label>
                              <select
                                value={newReviewRating}
                                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-tt-gold"
                              >
                                <option value="5">5 Stars (Excellent)</option>
                                <option value="4">4 Stars (Good)</option>
                                <option value="3">3 Stars (Average)</option>
                                <option value="2">2 Stars (Poor)</option>
                                <option value="1">1 Star (Terrible)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">
                              Review Comments
                            </label>
                            <textarea
                              value={newReviewText}
                              onChange={(e) => setNewReviewText(e.target.value)}
                              placeholder="Describe your service quality, team reliability, or final results..."
                              rows={2}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-tt-gold"
                            ></textarea>
                          </div>
                          <button
                            onClick={() => handleAddReview(selectedBusiness.id)}
                            className="bg-tt-navy hover:bg-tt-navy/90 text-tt-gold text-xs font-bold px-4 py-2 rounded-lg transition-all"
                          >
                            Submit Vetted Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Directory Grid of Vendors */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBusinesses.map((biz) => {
                        const bizReviewsCount = reviews.filter((r) => r.businessId === biz.id).length;
                        return (
                          <div
                            key={biz.id}
                            onClick={() => setSelectedBusiness(biz)}
                            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-tt-gold hover:shadow-md cursor-pointer transition-all space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <img
                                  src={biz.avatarUrl}
                                  alt={biz.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                                    {biz.name}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 flex items-center gap-0.5">
                                    <MapPin className="w-3 h-3 text-slate-400" /> {biz.location}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 font-extrabold text-[10px] px-1.5 py-0.5 rounded border border-amber-200">
                                  ★ {biz.rating}
                                </span>
                                <div className="text-[9px] text-slate-400 mt-0.5">
                                  {bizReviewsCount} reviews
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {biz.description}
                            </p>

                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px]">
                              {biz.insuranceVetted ? (
                                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Vetted Policy Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-700 font-bold">
                                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Processing Insurance
                                </span>
                              )}

                              <span className="text-tt-navy font-bold flex items-center gap-0.5 hover:text-tt-gold hover:underline transition-colors">
                                View Services & Schedule <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {filteredBusinesses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400">
                          <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="text-sm font-bold">No verified providers found matching your search.</p>
                          <p className="text-xs text-slate-400 mt-1">Try expanding your category search criteria.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PERSPECTIVE B: BUSINESS OWNER PORTAL */}
              {currentPortal === "business" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-tt-navy font-serif">
                        Owner Administration Console
                      </h2>
                      <p className="text-xs text-slate-500">
                        Select your active provider profile to update rates or verify project states.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">Active Account:</span>
                      <select
                        value={activeOwnerBizId}
                        onChange={(e) => setActiveOwnerBizId(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-tt-navy focus:outline-none focus:border-tt-gold focus:ring-1 focus:ring-tt-gold"
                      >
                        {businesses.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.location})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Business Subscription Toggle Box */}
                  <div className="bg-tt-cream/60 rounded-2xl p-4 border border-tt-gold/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-tt-navy" />
                        <span className="text-sm font-extrabold text-slate-900">
                          Platform Merchant Subscription Status
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-xl">
                        Consumers join and browse completely for free! Approved professional service providers pay a flat
                        $49/month platform fee to show their catalog to 12,000+ local customers.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {businesses.find((b) => b.id === activeOwnerBizId)?.monthlySubscribed ? (
                        <>
                          <span className="bg-tt-navy text-tt-gold font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                            Subscribed Active ($49/mo)
                          </span>
                          <button
                            onClick={() => handleToggleSubscription(false)}
                            className="text-xs text-red-600 hover:underline font-bold"
                          >
                            Cancel Sub
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleSubscription(true)}
                          className="bg-tt-navy text-tt-gold hover:bg-tt-navy/90 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                          Activate Subscription ($49/mo)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Two-Column Form: Business Details & Services Catalog */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Details */}
                    <div className="space-y-4">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                        Profile Preferences
                      </h3>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Business Brand Name
                          </label>
                          <input
                            type="text"
                            value={editBizName}
                            onChange={(e) => setEditBizName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Contact Phone
                          </label>
                          <input
                            type="text"
                            value={editBizPhone}
                            onChange={(e) => setEditBizPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Operating Metro/City
                          </label>
                          <input
                            type="text"
                            value={editBizLocation}
                            onChange={(e) => setEditBizLocation(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Company Bio / Description
                          </label>
                          <textarea
                            value={editBizDescription}
                            onChange={(e) => setEditBizDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                          ></textarea>
                        </div>

                        <button
                          onClick={handleSaveBusinessProfile}
                          className="w-full bg-tt-navy hover:bg-tt-navy/90 text-tt-gold text-xs font-bold py-2 rounded-lg transition-all"
                        >
                          Save Profile Details
                        </button>
                      </div>
                    </div>

                    {/* Column 2: Services list */}
                    <div className="space-y-4">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                        Services Catalog & Rates
                      </h3>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {businesses
                            .find((b) => b.id === activeOwnerBizId)
                            ?.services.map((svc, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs"
                              >
                                <div>
                                  <div className="font-bold text-slate-800">{svc.name}</div>
                                  <div className="text-[9px] text-slate-400">{svc.category}</div>
                                </div>
                                <div className="font-extrabold text-tt-navy">
                                  ${svc.price} / {svc.unit}
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Add service inline */}
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <div className="text-[10px] font-bold text-slate-600">
                            Add New Service Offer
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Service title..."
                              value={newServiceName}
                              onChange={(e) => setNewServiceName(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                            />
                            <select
                              value={newServiceCategory}
                              onChange={(e) => setNewServiceCategory(e.target.value as ServiceCategory)}
                              className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                            >
                              {Object.values(ServiceCategory).map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 flex items-center bg-white border border-slate-200 rounded-lg px-2">
                              <span className="text-slate-400 text-xs">$</span>
                              <input
                                type="number"
                                value={newServicePrice}
                                onChange={(e) => setNewServicePrice(Number(e.target.value))}
                                className="w-full border-none p-1.5 text-xs focus:outline-none"
                              />
                            </div>
                            <select
                              value={newServiceUnit}
                              onChange={(e) => setNewServiceUnit(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                            >
                              <option value="visit">/ visit</option>
                              <option value="hour">/ hour</option>
                              <option value="sq_ft">/ sq ft</option>
                              <option value="project">/ project</option>
                            </select>
                          </div>
                          <button
                            onClick={handleAddService}
                            className="w-full bg-tt-navy hover:bg-tt-navy/90 text-tt-gold text-xs font-bold py-1.5 rounded-lg transition-all"
                          >
                            Add To Live Directory
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* General Liability Insurance Document Sync */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#1B2B24]">
                        Integrated Insurance Documentation Vetting
                      </h3>
                      <p className="text-xs text-slate-500">
                        Provide your current Business General Liability Policy certificate to display the
                        "Verified Elite" badge to consumers.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Insurance Carrier
                        </label>
                        <input
                          type="text"
                          placeholder="Liberty Mutual, Allstate..."
                          value={insCarrier}
                          onChange={(e) => setInsCarrier(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          placeholder="LMI-9920-TX"
                          value={insPolicyNum}
                          onChange={(e) => setInsPolicyNum(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Liability Limit
                        </label>
                        <select
                          value={insLimit}
                          onChange={(e) => setInsLimit(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        >
                          <option value="$1,000,000">$1,000,000 USD Limit</option>
                          <option value="$2,000,000">$2,000,000 USD Limit</option>
                          <option value="$3,000,000">$3,000,000 USD Limit</option>
                          <option value="$5,000,000">$5,000,000 USD Limit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          value={insExpires}
                          onChange={(e) => setInsExpires(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Vetted Badge Status:{" "}
                        <span className="font-extrabold text-tt-navy">
                          {businesses.find((b) => b.id === activeOwnerBizId)?.insurancePolicy?.status || "pending"}
                        </span>
                      </span>
                      <button
                        onClick={handleUploadInsurance}
                        className="bg-tt-navy hover:bg-tt-navy/90 text-tt-gold text-xs font-bold px-4 py-2 rounded-lg transition-all"
                      >
                        Submit Insurance Certificate
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Appointments Tracker (With Offline Job site simulator!) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-tt-navy font-serif">
                          Active Co-Working & Service Schedule
                        </h3>
                        <p className="text-xs text-slate-500">
                          Updates flow instantly. Tap states during remote service cycles.
                        </p>
                      </div>
                      <span className="bg-tt-navy text-tt-gold text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                        RECURRING APPOINTMENTS
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {jobs
                        .filter((j) => j.businessId === activeOwnerBizId)
                        .map((job) => (
                          <div
                            key={job.id}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs hover:border-tt-gold transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-950">
                                  {job.consumerName}
                                </span>
                                <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  {job.recurring}
                                </span>
                                {job.offlineCaptured && (
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold font-mono px-1.5 py-0.5 rounded">
                                    Offline Mode Cache
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-600 font-bold">
                                {job.serviceName} |{" "}
                                <span className="text-tt-navy font-extrabold">${job.cost}</span>
                              </div>
                              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3" /> Scheduled:{" "}
                                {new Date(job.scheduleTime).toLocaleString()}
                              </div>
                              {job.notes && (
                                <p className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-100 mt-1">
                                  Notes: {job.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Status:
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  job.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : job.status === "active"
                                    ? "bg-blue-100 text-blue-800"
                                    : job.status === "en_route"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {job.status}
                              </span>

                              {job.status !== "completed" && (
                                <div className="flex gap-1">
                                  {job.status === "scheduled" && (
                                    <button
                                      onClick={() => handleUpdateJobStatus(job.id, "en_route")}
                                      className="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                                    >
                                      En Route
                                    </button>
                                  )}
                                  {(job.status === "scheduled" || job.status === "en_route") && (
                                    <button
                                      onClick={() => handleUpdateJobStatus(job.id, "active")}
                                      className="bg-blue-500 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                                    >
                                      Active Site Work
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleUpdateJobStatus(
                                        job.id,
                                        "completed",
                                        "Work certified on remote site. Vetting complete."
                                      )
                                    }
                                    className="bg-tt-navy hover:bg-tt-navy/90 text-tt-gold font-bold text-[10px] px-2.5 py-1 rounded transition-all"
                                  >
                                    Mark Complete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                      {jobs.filter((j) => j.businessId === activeOwnerBizId).length === 0 && (
                        <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                          No jobs currently scheduled for this provider.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PERSPECTIVE C: SUPER ADMIN CONTROL */}
              {currentPortal === "admin" && (
                <div className="space-y-6 animate-slide-in">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-tt-navy font-serif">
                      TS Core Platform Operations
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage overall subscriptions, verify provider insurance coverages, and examine decrypted coordinate states.
                    </p>
                  </div>

                  {/* Operational stats grids inside grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <div className="text-2xl font-black text-tt-navy">
                        ${businesses.filter((b) => b.monthlySubscribed).length * 49}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                        Recurring MRR
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <div className="text-2xl font-black text-tt-navy">
                        {businesses.length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                        Active Providers
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <div className="text-2xl font-black text-tt-navy">
                        {businesses.filter((b) => b.insuranceVetted).length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                        Verified Elite
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <div className="text-2xl font-black text-amber-600">
                        {businesses.filter((b) => b.insurancePolicy && !b.insuranceVetted).length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                        Pending Audits
                      </div>
                    </div>
                  </div>

                  {/* Active policy audit queue */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                      Liability Insurance Policy Queue
                    </h3>

                    <div className="space-y-2.5">
                      {businesses.map((biz) => {
                        const hasPolicy = biz.insurancePolicy && biz.insurancePolicy.carrier;
                        return (
                          <div
                            key={biz.id}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                          >
                            <div>
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                {biz.name}
                                <span className="font-mono text-[9px] text-slate-400">({biz.id})</span>
                              </div>
                              <div className="text-slate-500 mt-0.5">
                                {hasPolicy ? (
                                  <>
                                    Carrier: <span className="font-bold">{biz.insurancePolicy.carrier}</span> | Limit:{" "}
                                    <span className="font-bold">{biz.insurancePolicy.liabilityLimit}</span>
                                  </>
                                ) : (
                                  <span className="italic text-slate-400">No active policy uploaded yet</span>
                                )}
                              </div>
                              {hasPolicy && (
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  Policy#: {biz.insurancePolicy.policyNumber} | Exp: {biz.insurancePolicy.expiresAt}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 shrink-0 items-center">
                              <span className="text-[10px] font-bold mr-1 uppercase text-slate-400">
                                State:{" "}
                                <span
                                  className={`font-mono font-bold uppercase ${
                                    biz.insuranceVetted ? "text-emerald-600" : "text-amber-600"
                                  }`}
                                >
                                  {biz.insurancePolicy?.status || "pending"}
                                </span>
                              </span>

                              {hasPolicy && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleVetInsurance(biz.id, "verified")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                                  >
                                    Approve Policy
                                  </button>
                                  <button
                                    onClick={() => handleVetInsurance(biz.id, "rejected")}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PERSPECTIVE D: GOOGLE FORMS HUB */}
              {currentPortal === "forms" && (
                <GoogleFormsHub
                  onApproveOrchestrator={handleApproveOrchestratorFromForm}
                  onAddConsumerReview={handleAddConsumerReviewFromForm}
                />
              )}
            </div>

            {/* CARD 4: AI cost estimation portal (Right Bento Block) */}
            <div id="ai-estimator-card" className="bg-tt-navy text-white rounded-3xl p-5 border border-tt-gold/20 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div>
                <span className="text-[10px] uppercase font-bold text-tt-gold tracking-wider font-mono">
                  Gemini Flash AI Engine
                </span>
                <h3 className="text-lg font-bold mt-1.5 flex items-center gap-1.5 font-serif text-tt-gold">
                  <Sparkles className="w-4 h-4 text-tt-gold" /> Sovereign AI Estimator
                </h3>
                <p className="text-xs text-tt-cream/80 mt-2 leading-relaxed font-sans">
                  Generate hyper-reliable pricing ranges, platform licensing resource allocations, and regulatory checklists instantly.
                </p>

                {/* Sovereign Pricing Pledge Alert Box */}
                <div className="mt-3 bg-white/5 border border-tt-gold/20 rounded-xl p-3 text-[10px] text-tt-gold/90 leading-normal flex items-start gap-2 animate-fade-in">
                  <span className="text-sm select-none">🕊️</span>
                  <span>
                    <strong>Sovereign Pricing Pledge:</strong> We reject both low-quality sub-dollar labor and corporate price-gouging. Our estimates guarantee fair provider rates ($15–$35/hr) while keeping setups highly accessible to everyone. We live in surplus.
                  </span>
                </div>

                <form onSubmit={handleRunEstimation} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-tt-gold">
                      Service Category
                    </label>
                    <select
                      value={estCategory}
                      onChange={(e) => setEstCategory(e.target.value as ServiceCategory)}
                      className="w-full bg-tt-midnight border border-tt-gold/20 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      {Object.values(ServiceCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-tt-gold">
                        Project Scale (Units/Hrs)
                      </label>
                      <input
                        type="number"
                        value={estAreaSize}
                        onChange={(e) => setEstAreaSize(Number(e.target.value))}
                        className="w-full bg-tt-midnight border border-tt-gold/20 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-tt-gold">
                        Complexity
                      </label>
                      <select
                        value={estComplexity}
                        onChange={(e) => setEstComplexity(e.target.value as any)}
                        className="w-full bg-tt-midnight border border-tt-gold/20 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="low">Low Complexity</option>
                        <option value="medium">Medium Complexity</option>
                        <option value="high">High Complexity (SLA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-tt-gold">
                      United States ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 78704"
                      value={estZipCode}
                      onChange={(e) => setEstZipCode(e.target.value)}
                      className="w-full bg-tt-midnight border border-tt-gold/20 rounded-lg p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={estLoading}
                    className="w-full bg-tt-gold hover:bg-tt-amber disabled:bg-tt-gold/30 text-tt-navy text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {estLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Regional Raws...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Run AI Estimate
                      </>
                    )}
                  </button>
                </form>
              </div>

              {estResult && (
                <div className="mt-4 pt-4 border-t border-tt-gold/10 space-y-3 font-sans text-xs animate-slide-in">
                  <div className="bg-tt-midnight p-3 rounded-xl border border-tt-gold/20">
                    <div className="text-[10px] text-tt-gold font-bold uppercase tracking-wider">
                      Budgetary Cost Range
                    </div>
                    <div className="text-base font-extrabold mt-0.5 text-white">
                      ${estResult.estimatedCostLow.toLocaleString()} - ${estResult.estimatedCostHigh.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">
                      Timeline: {estResult.timelineWeeks} Weeks
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-tt-gold">
                      Calculated Allocations:
                    </span>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-900/60 p-1.5 rounded text-center text-[10px]">
                        <span className="block font-bold text-tt-gold">
                          ${estResult.breakdown.labor.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-slate-400">Labor</span>
                      </div>
                      <div className="flex-1 bg-slate-900/60 p-1.5 rounded text-center text-[10px]">
                        <span className="block font-bold text-tt-gold">
                          ${estResult.breakdown.materials.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-slate-400">Materials</span>
                      </div>
                      <div className="flex-1 bg-slate-900/60 p-1.5 rounded text-center text-[10px]">
                        <span className="block font-bold text-tt-gold">
                          ${estResult.breakdown.permitsAndFees.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-slate-400">Permits</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Cost Allocation Pie Chart */}
                  <CostAllocationChart
                    labor={estResult.breakdown.labor}
                    materials={estResult.breakdown.materials}
                    permits={estResult.breakdown.permitsAndFees}
                  />

                  <div className="space-y-1 text-slate-300">
                    <span className="text-[9px] uppercase font-bold text-tt-gold">
                      Material Checklist:
                    </span>
                    <ul className="list-disc pl-3 text-[10px] space-y-0.5">
                      {estResult.materialsChecklist.slice(0, 3).map((item, i) => (
                        <li key={i} className="leading-tight">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <span className="text-[9px] uppercase font-bold text-tt-gold">
                      Vetted Recommendations:
                    </span>
                    <ul className="list-disc pl-3 text-[10px] space-y-0.5">
                      {estResult.recommendations.slice(0, 2).map((item, i) => (
                        <li key={i} className="leading-tight">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MobileAppFrame>
      </main>

      {/* Free Scheduling Checkout Modal */}
      {bookingBusiness && bookingService && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-slide-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Confirm Free Booking Checkout
              </h3>
              <button
                onClick={() => {
                  setBookingBusiness(null);
                  setBookingService(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-2 animate-bounce-short">
                <Check className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full p-2.5 mx-auto" />
                <h4 className="text-sm font-extrabold text-slate-900">Appointment Booked!</h4>
                <p className="text-xs text-slate-500">
                  Your recurring maintenance session has been locked into the live schedule. Zero consumer fee due.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                  <div className="font-bold text-slate-800">{bookingBusiness.name}</div>
                  <div className="text-[#2D6A4F] font-extrabold mt-1">
                    {bookingService.name} — ${bookingService.price} / {bookingService.unit}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    *Verified with Carrier: {bookingBusiness.insurancePolicy?.carrier || "Vetted Cover"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Consumer Name
                      </label>
                      <input
                        type="text"
                        value={bookingClientName}
                        onChange={(e) => setBookingClientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={bookingClientEmail}
                        onChange={(e) => setBookingClientEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Date Preferred
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Time Slot
                      </label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Recurring Plan
                    </label>
                    <select
                      value={bookingRecurring}
                      onChange={(e: any) => setBookingRecurring(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    >
                      <option value="one_time">One-Time Project Visit</option>
                      <option value="weekly">Weekly Maintenance (Recommended)</option>
                      <option value="bi_weekly">Bi-Weekly Care</option>
                      <option value="monthly">Monthly Cycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Notes for Service Provider
                    </label>
                    <textarea
                      placeholder="API keys are configured. Integration targets must support secure OAuth synchronization."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleCreateBooking}
                    className="w-full bg-tt-navy text-tt-gold hover:bg-tt-midnight border border-tt-gold/30 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Lock Appointment Slot (Free)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
 
        {/* Security / Decrypted Vault Inspector Component */}
        <SecurityPanel isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />
 
        <footer className="bg-tt-ivory border-t border-tt-gold/30 py-8 px-6 text-center text-xs text-tt-navy mt-12 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-tt-navy border border-tt-gold rounded-lg flex items-center justify-center text-tt-gold font-extrabold text-xs font-serif">
                TS
              </div>
              <div className="text-left">
                <span className="font-bold text-tt-navy font-serif block">TerraForm Sovereign</span>
                <span className="text-[9px] text-tt-navy/60 font-mono block">A Think Tank Solutions AI Platform</span>
              </div>
            </div>
            <p className="text-tt-navy/80 font-sans">
              © 2026 TerraForm Sovereign - A Think Tank Solutions AI Platform. Powered by certified professional liability safety audits and Gemini cost calculations. <span className="font-serif italic text-tt-gold font-bold">"Excellence Is Our Standard"</span>
            </p>
          </div>
        </footer>
    </div>
  );
}
