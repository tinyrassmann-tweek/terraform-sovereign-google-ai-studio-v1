import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initialBusinesses, initialReviews, initialJobs } from "./src/mockDb.js";
import { ServiceCategory } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));

// In-memory data store referencing initial mock data
let businesses = [...initialBusinesses];
let reviews = [...initialReviews];
let jobs = [...initialJobs];

// Initialize Gemini Client safely with telemetry User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST API Endpoints
app.get("/api/businesses", (req, res) => {
  res.json({ success: true, data: businesses });
});

// Create/Update Business Profile
app.post("/api/businesses", (req, res) => {
  const { id, name, ownerName, ownerEmail, phone, description, location, services, insurancePolicy } = req.body;
  
  if (id) {
    // Update
    const idx = businesses.findIndex(b => b.id === id);
    if (idx !== -1) {
      businesses[idx] = {
        ...businesses[idx],
        name: name || businesses[idx].name,
        ownerName: ownerName || businesses[idx].ownerName,
        phone: phone || businesses[idx].phone,
        description: description || businesses[idx].description,
        location: location || businesses[idx].location,
        services: services || businesses[idx].services,
        insurancePolicy: insurancePolicy ? { ...businesses[idx].insurancePolicy, ...insurancePolicy } : businesses[idx].insurancePolicy,
        insuranceVetted: insurancePolicy?.status === "verified" ? true : (insurancePolicy ? false : businesses[idx].insuranceVetted)
      };
      return res.json({ success: true, data: businesses[idx] });
    }
  }

  // Create
  const newBiz = {
    id: `biz-${Date.now()}`,
    name,
    ownerName,
    ownerEmail,
    phone,
    description,
    location,
    rating: 5.0,
    reviewsCount: 0,
    services: services || [],
    insuranceVetted: false,
    insurancePolicy: insurancePolicy || {
      carrier: "",
      policyNumber: "",
      liabilityLimit: "",
      expiresAt: "",
      status: "pending"
    },
    monthlySubscribed: false,
    subscriptionPlan: "none",
    subscriptionAmount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800"
  };
  businesses.push(newBiz as any);
  res.json({ success: true, data: newBiz });
});

// Subscribe to monthly platform subscription (Simulation)
app.post("/api/businesses/:id/subscribe", (req, res) => {
  const { id } = req.params;
  const { subscribe } = req.body; // boolean
  
  const idx = businesses.findIndex(b => b.id === id);
  if (idx !== -1) {
    businesses[idx].monthlySubscribed = subscribe;
    businesses[idx].subscriptionPlan = subscribe ? "monthly_standard" : "none";
    businesses[idx].subscriptionAmount = subscribe ? 49.00 : 0;
    return res.json({ success: true, data: businesses[idx] });
  }
  res.status(404).json({ success: false, error: "Business not found" });
});

// Update insurance policy (Client triggers or mock PDF upload)
app.post("/api/businesses/:id/insurance", (req, res) => {
  const { id } = req.params;
  const { carrier, policyNumber, liabilityLimit, expiresAt } = req.body;

  const idx = businesses.findIndex(b => b.id === id);
  if (idx !== -1) {
    businesses[idx].insurancePolicy = {
      carrier,
      policyNumber,
      liabilityLimit,
      expiresAt,
      status: "pending" // Needs Admin vetting
    };
    businesses[idx].insuranceVetted = false;
    return res.json({ success: true, data: businesses[idx] });
  }
  res.status(404).json({ success: false, error: "Business not found" });
});

// Admin endpoint to vet insurance policy
app.post("/api/businesses/:id/vet-insurance", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "verified" | "rejected" | "pending"

  const idx = businesses.findIndex(b => b.id === id);
  if (idx !== -1) {
    businesses[idx].insurancePolicy.status = status;
    businesses[idx].insuranceVetted = status === "verified";
    return res.json({ success: true, data: businesses[idx] });
  }
  res.status(404).json({ success: false, error: "Business not found" });
});

// Reviews Endpoints
app.get("/api/reviews", (req, res) => {
  res.json({ success: true, data: reviews });
});

app.post("/api/reviews", (req, res) => {
  const { businessId, consumerName, rating, text, verifiedJob } = req.body;
  const newReview = {
    id: `rev-${Date.now()}`,
    businessId,
    consumerName,
    rating: Number(rating) || 5,
    text,
    date: new Date().toISOString().split('T')[0],
    verifiedJob: !!verifiedJob
  };
  reviews.push(newReview);
  
  // Recalculate rating
  const bizIdx = businesses.findIndex(b => b.id === businessId);
  if (bizIdx !== -1) {
    const bizReviews = reviews.filter(r => r.businessId === businessId);
    const avgRating = bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length;
    businesses[bizIdx].rating = Number(avgRating.toFixed(1));
    businesses[bizIdx].reviewsCount = bizReviews.length;
  }
  
  res.json({ success: true, data: newReview });
});

// Jobs/Appointments Endpoints
app.get("/api/jobs", (req, res) => {
  res.json({ success: true, data: jobs });
});

app.post("/api/jobs", (req, res) => {
  const { businessId, consumerName, consumerEmail, serviceName, serviceCategory, cost, scheduleTime, recurring, notes } = req.body;
  
  const biz = businesses.find(b => b.id === businessId);
  const newJob = {
    id: `job-${Date.now()}`,
    businessId,
    businessName: biz ? biz.name : "Unknown Vendor",
    consumerName,
    consumerEmail,
    serviceName,
    serviceCategory,
    cost: Number(cost) || 0,
    scheduleTime,
    recurring: recurring || "one_time",
    status: "scheduled",
    notes
  };
  jobs.push(newJob as any);
  res.json({ success: true, data: newJob });
});

// Update Job Status (supports offline/sync uploads!)
app.post("/api/jobs/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, notes, completionPhoto, offlineCaptured, offlineSavedAt } = req.body;

  const idx = jobs.findIndex(j => j.id === id);
  if (idx !== -1) {
    jobs[idx] = {
      ...jobs[idx],
      status: status || jobs[idx].status,
      notes: notes || jobs[idx].notes,
      completionPhoto: completionPhoto || jobs[idx].completionPhoto,
      offlineCaptured: offlineCaptured !== undefined ? offlineCaptured : jobs[idx].offlineCaptured,
      offlineSavedAt: offlineSavedAt || jobs[idx].offlineSavedAt
    };
    return res.json({ success: true, data: jobs[idx] });
  }
  
  // If job doesn't exist but came from offline capture, allow creating it on sync
  if (offlineCaptured) {
    const newOfflineJob = {
      id,
      businessId: req.body.businessId || "biz-1",
      businessName: req.body.businessName || "Apex Green Landscaping",
      consumerName: req.body.consumerName || "Offline Client",
      consumerEmail: req.body.consumerEmail || "offline@client.com",
      serviceName: req.body.serviceName || "General Care",
      serviceCategory: req.body.serviceCategory || ServiceCategory.EverydayAIHelpers,
      cost: Number(req.body.cost) || 0,
      scheduleTime: req.body.scheduleTime || new Date().toISOString(),
      recurring: req.body.recurring || "one_time",
      status: status || "completed",
      notes: notes || "",
      completionPhoto: completionPhoto || "",
      offlineCaptured: true,
      offlineSavedAt: offlineSavedAt || new Date().toISOString()
    };
    jobs.push(newOfflineJob as any);
    return res.json({ success: true, data: newOfflineJob });
  }
  
  res.status(404).json({ success: false, error: "Job not found" });
});

// Batch Sync offline jobs
app.post("/api/jobs/sync", (req, res) => {
  const { syncedJobs } = req.body; // Array of Jobs completed offline
  if (!Array.isArray(syncedJobs)) {
    return res.status(400).json({ success: false, error: "Invalid sync package" });
  }

  for (const offlineJob of syncedJobs) {
    const idx = jobs.findIndex(j => j.id === offlineJob.id);
    if (idx !== -1) {
      jobs[idx] = {
        ...jobs[idx],
        status: offlineJob.status,
        notes: offlineJob.notes || jobs[idx].notes,
        completionPhoto: offlineJob.completionPhoto || jobs[idx].completionPhoto,
        offlineCaptured: true,
        offlineSavedAt: offlineJob.offlineSavedAt || new Date().toISOString()
      };
    } else {
      jobs.push({
        ...offlineJob,
        offlineCaptured: true
      });
    }
  }
  res.json({ success: true, data: jobs });
});

// AI Project Estimation Tool Endpoint using Gemini API
app.post("/api/estimate", async (req, res) => {
  const { category, areaSize, complexity, materials, description, zipCode } = req.body;
  
  if (!category || !areaSize) {
    return res.status(400).json({ success: false, error: "Missing required parameters: category and areaSize." });
  }

  if (!aiClient) {
    // Fallback Mock Estimation if API Key is not set up yet
    let estLow = 0;
    let estHigh = 0;
    let laborCost = 0;
    let materialsCost = 0;
    let permitsCost = 0;
    let timelineWeeks = 1;

    const size = Number(areaSize) || 1000;
    const isHighComplexity = complexity === "high";
    const isMediumComplexity = complexity === "medium";
    const compMultiplier = isHighComplexity ? 1.4 : isMediumComplexity ? 1.15 : 0.95;

    if (category === ServiceCategory.EverydayAIHelpers) {
      // Everyday AI Helpers: virtual receptionist or call screening
      const base = Math.max(25, size * 18); 
      estLow = Math.round(base * compMultiplier * 0.85);
      estHigh = Math.round(base * compMultiplier * 1.15);
      
      laborCost = Math.round(estLow * 0.70);
      materialsCost = Math.round(estLow * 0.30); // Software subscriptions, simple setup costs
      permitsCost = 0;
      timelineWeeks = isHighComplexity ? 3 : isMediumComplexity ? 2 : 1;
    } else if (category === ServiceCategory.FriendlyCoWorking) {
      // Friendly Co-working and coaching
      const base = Math.max(20, size * 15);
      estLow = Math.round(base * compMultiplier * 0.9);
      estHigh = Math.round(base * compMultiplier * 1.1);

      laborCost = Math.round(estLow * 0.90);
      materialsCost = Math.round(estLow * 0.10);
      permitsCost = 0;
      timelineWeeks = isHighComplexity ? 4 : isMediumComplexity ? 2 : 1;
    } else if (category === ServiceCategory.WorkflowAutomations) {
      // Peaceful calendar or spreadsheet connections
      const base = Math.max(35, size * 25);
      estLow = Math.round(base * compMultiplier * 0.85);
      estHigh = Math.round(base * compMultiplier * 1.15);
      
      laborCost = Math.round(estLow * 0.80);
      materialsCost = Math.round(estLow * 0.20);
      permitsCost = 0;
      timelineWeeks = isHighComplexity ? 4 : isMediumComplexity ? 2 : 1;
    } else if (category === ServiceCategory.CreativeSystems || category === ServiceCategory.PersonalWellness) {
      // Creative drafting and cozy self-care setups
      const base = Math.max(25, size * 20);
      estLow = Math.round(base * compMultiplier * 0.9);
      estHigh = Math.round(base * compMultiplier * 1.1);
      
      laborCost = Math.round(estLow * 0.85);
      materialsCost = Math.round(estLow * 0.15);
      permitsCost = 0;
      timelineWeeks = isHighComplexity ? 3 : isMediumComplexity ? 2 : 1;
    } else {
      // Generic fallback
      const base = Math.max(25, size * 20);
      estLow = Math.round(base * compMultiplier * 0.9);
      estHigh = Math.round(base * compMultiplier * 1.1);
      laborCost = Math.round(estLow * 0.80);
      materialsCost = Math.round(estLow * 0.20);
      permitsCost = 0;
      timelineWeeks = 2;
    }
    
    return res.json({
      success: true,
      isMock: true,
      data: {
        estimatedCostLow: estLow,
        estimatedCostHigh: estHigh,
        breakdown: {
          labor: laborCost,
          materials: materialsCost,
          permitsAndFees: permitsCost
        },
        materialsChecklist: [
          category === ServiceCategory.EverydayAIHelpers 
            ? "Friendly AI answering machine templates & message routing configurations"
            : category === ServiceCategory.FriendlyCoWorking 
            ? "Cozy ChatGPT guides & neighborly co-working resources"
            : `Primary components suited for ${category}`,
          "Cooperative shared workspace keys & neighborhood access files",
          "Encrypted offline buffers for transactional peace of mind"
        ],
        timelineWeeks: timelineWeeks,
        recommendations: [
          category === ServiceCategory.EverydayAIHelpers 
            ? "Keep the digital helper warm, simple, and polite. It is a reflection of your cooperative intent."
            : "Keep tutoring sessions collaborative. Focus on giving genuine value and listening carefully.",
          "Check standard safety compliance guidelines to keep data secure and trusted.",
          "Ensure your monthly setup costs remain well under standard utility bills (like your telephone or internet) so you keep your peace."
        ],
        suggestedVendors: businesses
          .filter(b => b.services.some(s => s.category === category))
          .map(b => ({
            id: b.id,
            name: b.name,
            costEstimate: Math.round((estLow + estHigh) / 2)
          }))
      }
    });
  }

  try {
    const prompt = `Perform a detailed, friendly, and budget-conscious technical service job estimation based on:
Category: ${category}
ZIP/Location context: ${zipCode || "United States general cost index"}
Project Size/Scale Context: ${areaSize} units/hours/seats
Complexity Level: ${complexity}
Infrastructure/Materials preferred: ${materials || "Standard tech choice"}
Detailed description: ${description || "Cooperative creation & digital assistance"}

Generate a highly accessible, budget-conscious but sustainable cost-range breakdown based on real-world average helper and coach rates (ranging between $15 and $35 per hour/unit), timeline in weeks/days, recommended friendly co-working steps, checklist of simple resources, and ensure the format perfectly matches the requested JSON schema. Maintain a mindset of surplus and mutual respect—not corporate overcharging, but also not devaluing the service provider's care and labor.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are TerraForm Sovereign's Senior Friendly Co-Working & AI Assistant Estimator (A Think Tank Solutions AI Platform). You provide meticulously accurate, warm, community-centered, and budget-friendly estimates for everyday helpers, virtual receptionists, call screeners, drafting partners, and coaches.

CRITICAL BALANCED PRICING MANDATES:
You MUST follow these pricing boundaries to align with realistic, community-focused, and respectful service provider rates (reflecting human care combined with AI productivity):

1. Everyday AI Helpers & Admins:
   - Base hourly/unit rate: $15 to $25 per hour/unit.
   - Small scale (e.g., 1 setup or 1 hour/session): $19 to $35 total.
   - Medium scale (e.g., 10 to 40 hours/units): $150 to $900 total.
   - Large scale (e.g., 100 hours/units): $1,500 to $2,500 total (incredibly affordable compared to high-end corporate B2B packages of $5,000+, but highly respectful of the provider's care and effort).

2. Friendly Co-Working & Coaching / Personal Wellness:
   - Base hourly/unit rate: $15 to $20 per hour/unit.
   - Small scale (1 hour/session): $15 to $30 total.
   - Medium scale (10 to 40 hours/sessions): $150 to $800 total.

3. Peaceful Workflows & Automations / Creative Systems:
   - Base hourly/unit rate: $20 to $35 per hour/unit.
   - Small scale (e.g., 1 setup/month): $29 to $49 total.
   - Medium/Large scale (40 to 100 hours/setups): $800 to $3,000 total (safely under high-end corporate consulting to protect the average Joe, while supporting our provider community).

General Rules:
- Permits and fees should be $0.
- Timeline should range from 1 to 3 weeks depending on complexity.
- Always output clean, raw, valid JSON matching the exact schema specified, with no markdown code blocks.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedCostLow: { type: Type.NUMBER, description: "Lower boundary of estimated cost in USD" },
            estimatedCostHigh: { type: Type.NUMBER, description: "Upper boundary of estimated cost in USD" },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                labor: { type: Type.NUMBER, description: "Estimated labor cost in USD" },
                materials: { type: Type.NUMBER, description: "Estimated infrastructure, software licenses or raw technical materials cost in USD" },
                permitsAndFees: { type: Type.NUMBER, description: "Estimated compliance filings, audits or regulatory safety verification fees in USD" }
              },
              required: ["labor", "materials", "permitsAndFees"]
            },
            materialsChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific materials or software licenses needed"
            },
            timelineWeeks: { type: Type.NUMBER, description: "Estimated time to complete in weeks" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific pre-construction, security, or regulatory compliance recommendations"
            }
          },
          required: ["estimatedCostLow", "estimatedCostHigh", "breakdown", "materialsChecklist", "timelineWeeks", "recommendations"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText.trim());
    
    // Inject suggested vendors in post-processing
    parsedData.suggestedVendors = businesses
      .filter(b => b.services.some(s => s.category === category))
      .map(b => ({
        id: b.id,
        name: b.name,
        costEstimate: Math.round((parsedData.estimatedCostLow + parsedData.estimatedCostHigh) / 2)
      }));

    res.json({ success: true, isMock: false, data: parsedData });
  } catch (err: any) {
    console.error("Gemini API Error: ", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate AI estimate." });
  }
});

// Configure Vite integration or build asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TerraForm Sovereign server running on http://localhost:${PORT}`);
  });
}

startServer();
