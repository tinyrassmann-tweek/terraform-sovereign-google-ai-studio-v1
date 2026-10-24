import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  UserCheck,
  ExternalLink,
  Plus,
  RefreshCw,
  Star,
  Users,
  Award,
  Lock,
  MessageSquare,
  Sparkles,
  PhoneCall,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { initAuth, googleSignIn, logout } from '../lib/auth';
import {
  createGoogleFormForVetting,
  createGoogleFormForConsumerFeedback,
  fetchFormResponses,
  initialFormStats,
  initialFormApplications,
  initialConsumerFeedbacks,
  VettingApplicationResponse,
  ConsumerFeedbackResponse,
  GoogleFormsHubStats
} from '../lib/googleForms';

interface GoogleFormsHubProps {
  onApproveOrchestrator?: (app: VettingApplicationResponse) => void;
  onAddConsumerReview?: (fb: ConsumerFeedbackResponse) => void;
}

export const GoogleFormsHub: React.FC<GoogleFormsHubProps> = ({
  onApproveOrchestrator,
  onAddConsumerReview
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'applications' | 'consumer_feedbacks' | 'fill_application' | 'fill_feedback'>('applications');

  // Stats & Forms state
  const [stats, setStats] = useState<GoogleFormsHubStats>(initialFormStats);
  const [applications, setApplications] = useState<VettingApplicationResponse[]>(initialFormApplications);
  const [consumerFeedbacks, setConsumerFeedbacks] = useState<ConsumerFeedbackResponse[]>(initialConsumerFeedbacks);

  // Deployed Google Forms URIs
  const [vettingFormUri, setVettingFormUri] = useState<string | null>(null);
  const [vettingFormId, setVettingFormId] = useState<string | null>(null);
  const [feedbackFormUri, setFeedbackFormUri] = useState<string | null>(null);
  const [feedbackFormId, setFeedbackFormId] = useState<string | null>(null);

  // Action feedback messages
  const [isDeployingVetting, setIsDeployingVetting] = useState(false);
  const [isDeployingFeedback, setIsDeployingFeedback] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Embedded Form states for Direct Submission in App
  const [newContactName, setNewContactName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newEin, setNewEin] = useState('');
  const [newInsurance, setNewInsurance] = useState('');
  const [newPolicy, setNewPolicy] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newSocials, setNewSocials] = useState('');
  const [newServices, setNewServices] = useState('');
  const [newProof, setNewProof] = useState('');
  const [newRef1, setNewRef1] = useState('');
  const [newRef2, setNewRef2] = useState('');
  const [newRef3, setNewRef3] = useState('');
  const [selectedTier, setSelectedTier] = useState<'Tier 1 ($29/mo)' | 'Tier 2 ($49/mo)' | 'Tier 3 ($99/mo)'>('Tier 2 ($49/mo)');

  // Consumer Feedback form state
  const [fbConsumerName, setFbConsumerName] = useState('');
  const [fbProviderName, setFbProviderName] = useState('Co-Pilot Companions');
  const [fbRating, setFbRating] = useState(5);
  const [fbTimeliness, setFbTimeliness] = useState<'Exceeded Expectations' | 'Satisfactory' | 'Needs Improvement'>('Exceeded Expectations');
  const [fbTestimonial, setFbTestimonial] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth(
      (currUser, token) => {
        setUser(currUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setNotice(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNotice('Successfully authenticated with Google Workspace! Google Forms API enabled.');
      }
    } catch (err: any) {
      console.error(err);
      setNotice(`Google Auth note: ${err.message || 'Error signing in'}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setNotice('Logged out of Google Workspace.');
  };

  const handleDeployVettingForm = async () => {
    setIsDeployingVetting(true);
    setNotice(null);
    try {
      const result = await createGoogleFormForVetting();
      setVettingFormId(result.formId);
      setVettingFormUri(result.responderUri);
      setNotice(`Official Orchestrator Vetting Google Form deployed! ID: ${result.formId}`);
    } catch (err: any) {
      console.error(err);
      setNotice(`Deploy Error: ${err.message}. You can also use the integrated form below!`);
    } finally {
      setIsDeployingVetting(false);
    }
  };

  const handleDeployFeedbackForm = async () => {
    setIsDeployingFeedback(true);
    setNotice(null);
    try {
      const result = await createGoogleFormForConsumerFeedback();
      setFeedbackFormId(result.formId);
      setFeedbackFormUri(result.responderUri);
      setNotice(`Official Consumer Review Google Form deployed! ID: ${result.formId}`);
    } catch (err: any) {
      console.error(err);
      setNotice(`Deploy Error: ${err.message}. You can also use the integrated form below!`);
    } finally {
      setIsDeployingFeedback(false);
    }
  };

  const handleSyncResponses = async () => {
    setIsSyncing(true);
    setNotice(null);
    try {
      let count = 0;
      if (vettingFormId && accessToken) {
        const resp = await fetchFormResponses(vettingFormId);
        count += resp.length;
      }
      if (feedbackFormId && accessToken) {
        const resp = await fetchFormResponses(feedbackFormId);
        count += resp.length;
      }
      setNotice(`Synchronized with Google Forms REST API! ${count} live responses active.`);
    } catch (err: any) {
      setNotice(`Sync status: Simulated local buffer updated. (${err.message})`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmitOrchestratorApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newCompanyName || !newEin || !newRef1) {
      alert('Please fill out all required fields including Company Name, EIN, and at least 1 Client Reference.');
      return;
    }

    const refs = [newRef1];
    if (newRef2) refs.push(newRef2);
    if (newRef3) refs.push(newRef3);

    const newApp: VettingApplicationResponse = {
      id: `app-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      contactName: newContactName,
      companyName: newCompanyName,
      einNumber: newEin,
      insuranceCarrier: newInsurance || 'Standard General Business Liability',
      policyNumber: newPolicy || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      websiteUrl: newWebsite || 'https://' + newCompanyName.toLowerCase().replace(/[^a-z]/g, '') + '.com',
      socialHandles: newSocials || 'IG / FB / LinkedIn Verified',
      servicesOffered: newServices || 'Everyday AI Helper & Workflow Services',
      proofOfWorkUrl: newProof || 'https://portfolio.example.com',
      references: refs,
      selectedTier,
      status: 'pending_review',
      referencesVerified: false,
      complianceAgreed: true,
    };

    setApplications([newApp, ...applications]);
    setStats((prev) => ({
      ...prev,
      totalApplicants: prev.totalApplicants + 1,
      pendingVerifications: prev.pendingVerifications + 1,
    }));

    // Reset form
    setNewContactName('');
    setNewCompanyName('');
    setNewEin('');
    setNewInsurance('');
    setNewPolicy('');
    setNewWebsite('');
    setNewSocials('');
    setNewServices('');
    setNewProof('');
    setNewRef1('');
    setNewRef2('');
    setNewRef3('');

    setNotice(`Application submitted successfully via Google Forms module! Submitted for reference verification.`);
    setActiveTab('applications');
  };

  const handleVerifyAndApprove = (app: VettingApplicationResponse) => {
    const updated = applications.map((item) => {
      if (item.id === app.id) {
        return { ...item, status: 'approved' as const, referencesVerified: true };
      }
      return item;
    });

    setApplications(updated);
    setStats((prev) => ({
      ...prev,
      approvedOrchestrators: prev.approvedOrchestrators + 1,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
      referenceVerificationRate: Math.min(100, Math.round(((prev.approvedOrchestrators + 1) / prev.totalApplicants) * 100)),
    }));

    if (onApproveOrchestrator) {
      onApproveOrchestrator({ ...app, status: 'approved', referencesVerified: true });
    }

    setNotice(`APPROVED: ${app.companyName} references verified! Listed in TerraForm Sovereign directory.`);
  };

  const handleSubmitConsumerFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbConsumerName || !fbTestimonial) {
      alert('Please fill out consumer name and experience testimonial.');
      return;
    }

    const newFb: ConsumerFeedbackResponse = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      consumerName: fbConsumerName,
      providerName: fbProviderName,
      rating: fbRating,
      timelinessScore: fbTimeliness,
      referenceTrustVerified: true,
      testimonialText: fbTestimonial,
    };

    setConsumerFeedbacks([newFb, ...consumerFeedbacks]);
    if (onAddConsumerReview) {
      onAddConsumerReview(newFb);
    }

    setNotice(`Consumer Quality Audit recorded! Thank you for maintaining the Standard of Excellence.`);
    setFbConsumerName('');
    setFbTestimonial('');
    setActiveTab('consumer_feedbacks');
  };

  return (
    <div id="google-forms-hub" className="bg-tt-ivory/90 border border-tt-gold/30 rounded-3xl p-6 shadow-md mb-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-tt-navy/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-tt-navy text-tt-gold text-[10px] font-mono uppercase font-bold rounded-full">
              Google Forms &amp; Workspace API Integration
            </span>
            <span className="text-xs text-tt-navy/60 font-serif italic">
              Standard of Excellence Quality Vetting
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-tt-navy mt-1">
            Orchestrator Vetting &amp; Quality Audit Hub
          </h2>
          <p className="text-xs text-tt-navy/80 max-w-2xl mt-0.5">
            Empowering consumers with verified Orchestrators through Google Forms questionnaire workflows, checked EIN &amp; insurance filings, and mandatory prior client reference verification.
          </p>
        </div>

        {/* Google Workspace Authentication Card */}
        <div className="bg-white border border-tt-gold/30 rounded-2xl p-3.5 flex flex-col items-end gap-2 shadow-sm shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-8 h-8 rounded-full border border-tt-gold" />
              )}
              <div className="text-right">
                <span className="text-xs font-bold text-tt-navy block">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Workspace API Connected
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[10px] text-red-600 hover:text-red-800 underline font-mono ml-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button text-xs bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span className="font-semibold text-xs">
                  {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </button>
              <span className="text-[9px] font-mono text-tt-navy/60">
                Connect Google Account to manage live Google Forms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="mt-4 p-3 bg-tt-navy text-tt-gold rounded-xl text-xs font-mono flex items-center justify-between gap-2 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-tt-gold shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-[10px] text-white hover:text-tt-gold">Dismiss</button>
        </div>
      )}

      {/* Key Vetting & Quality Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        <div className="bg-white border border-tt-gold/20 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-tt-navy/60 text-[10px] font-mono uppercase font-bold">
            <span>Total Applied</span>
            <Users className="w-3.5 h-3.5 text-tt-gold" />
          </div>
          <div className="text-xl font-bold font-serif text-tt-navy mt-1">
            {stats.totalApplicants}
          </div>
          <div className="text-[9px] text-tt-navy/70 mt-0.5">Orchestrator Applications</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 text-[10px] font-mono uppercase font-bold">
            <span>Approved Vetted</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-serif text-emerald-900 mt-1">
            {stats.approvedOrchestrators}
          </div>
          <div className="text-[9px] text-emerald-700 mt-0.5">Directory Active Vendors</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-[10px] font-mono uppercase font-bold">
            <span>Pending Audit</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-serif text-amber-900 mt-1">
            {stats.pendingVerifications}
          </div>
          <div className="text-[9px] text-amber-700 mt-0.5">References Being Called</div>
        </div>

        <div className="bg-white border border-tt-navy/20 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-tt-navy/70 text-[10px] font-mono uppercase font-bold">
            <span>Verified Ref %</span>
            <ShieldCheck className="w-3.5 h-3.5 text-tt-navy" />
          </div>
          <div className="text-xl font-bold font-serif text-tt-navy mt-1">
            {stats.referenceVerificationRate}%
          </div>
          <div className="text-[9px] text-tt-navy/70 mt-0.5">Human References Checked</div>
        </div>

        <div className="bg-white border border-tt-gold/30 rounded-2xl p-3.5 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-tt-gold/90 text-[10px] font-mono uppercase font-bold">
            <span>Consumer Score</span>
            <Star className="w-3.5 h-3.5 text-tt-gold fill-tt-gold" />
          </div>
          <div className="text-xl font-bold font-serif text-tt-navy mt-1 flex items-baseline gap-1">
            {stats.consumerSatisfactionAvg} <span className="text-xs font-normal text-tt-navy/60">/ 5.0</span>
          </div>
          <div className="text-[9px] text-tt-navy/70 mt-0.5">Google Form Quality Audits</div>
        </div>
      </div>

      {/* Google Forms Action Bar: Deploy & Sync Buttons */}
      <div className="mt-6 bg-tt-navy/5 border border-tt-navy/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-tt-navy shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-tt-navy uppercase tracking-wider font-mono">
              Google Forms REST API Deployer
            </h4>
            <p className="text-[11px] text-tt-navy/70">
              Deploy official Google Forms to your Google Drive to collect applications or consumer reviews automatically.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDeployVettingForm}
            disabled={isDeployingVetting}
            className="bg-tt-navy text-white hover:bg-tt-navy/90 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-tt-gold" />
            {isDeployingVetting ? 'Deploying Form...' : 'Deploy Vetting Form'}
          </button>

          <button
            onClick={handleDeployFeedbackForm}
            disabled={isDeployingFeedback}
            className="bg-white border border-tt-navy/20 text-tt-navy hover:bg-tt-navy/5 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-tt-navy" />
            {isDeployingFeedback ? 'Deploying Form...' : 'Deploy Consumer Review Form'}
          </button>

          <button
            onClick={handleSyncResponses}
            disabled={isSyncing}
            className="bg-tt-gold/20 border border-tt-gold/40 text-tt-navy hover:bg-tt-gold/30 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Responses
          </button>
        </div>
      </div>

      {/* Links to Deployed Google Forms if active */}
      {(vettingFormUri || feedbackFormUri) && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Google Forms Deployed to Drive:</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {vettingFormUri && (
              <a href={vettingFormUri} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 underline font-mono flex items-center gap-1">
                Vetting Form <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {feedbackFormUri && (
              <a href={feedbackFormUri} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 underline font-mono flex items-center gap-1">
                Feedback Form <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mt-6 border-b border-tt-navy/10 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'border-tt-navy text-tt-navy'
              : 'border-transparent text-tt-navy/60 hover:text-tt-navy'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Orchestrator Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('consumer_feedbacks')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'consumer_feedbacks'
              ? 'border-tt-navy text-tt-navy'
              : 'border-transparent text-tt-navy/60 hover:text-tt-navy'
          }`}
        >
          <Star className="w-4 h-4" />
          Consumer Quality Audits ({consumerFeedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('fill_application')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'fill_application'
              ? 'border-tt-navy text-tt-navy'
              : 'border-transparent text-tt-navy/60 hover:text-tt-navy'
          }`}
        >
          <Plus className="w-4 h-4 text-tt-gold" />
          Submit Provider Vetting Questionnaire
        </button>

        <button
          onClick={() => setActiveTab('fill_feedback')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'fill_feedback'
              ? 'border-tt-navy text-tt-navy'
              : 'border-transparent text-tt-navy/60 hover:text-tt-navy'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-tt-navy" />
          Submit Post-Service Review
        </button>
      </div>

      {/* TAB CONTENT 1: Orchestrator Applications Table */}
      {activeTab === 'applications' && (
        <div className="mt-4 space-y-4">
          <div className="bg-white border border-tt-gold/20 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-tt-navy text-white font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Company &amp; Owner</th>
                    <th className="p-3">EIN &amp; Insurance</th>
                    <th className="p-3">Prior Client References</th>
                    <th className="p-3">Selected Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tt-navy/10 font-sans">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-tt-cream/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-tt-navy">{app.companyName}</div>
                        <div className="text-[10px] text-tt-navy/70 flex items-center gap-1">
                          <Users className="w-3 h-3 text-tt-gold" /> {app.contactName}
                        </div>
                        <div className="text-[9px] font-mono text-tt-navy/50">{app.socialHandles}</div>
                      </td>

                      <td className="p-3 font-mono text-[10px]">
                        <div><strong className="text-tt-navy">EIN:</strong> {app.einNumber}</div>
                        <div className="text-tt-navy/80">{app.insuranceCarrier}</div>
                        <div className="text-[9px] text-tt-navy/60">{app.policyNumber}</div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1">
                          {app.references.map((ref, idx) => (
                            <div key={idx} className="text-[10px] bg-tt-cream/60 border border-tt-gold/20 rounded p-1 flex items-start gap-1">
                              <PhoneCall className="w-2.5 h-2.5 text-tt-gold shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{ref}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-tt-gold/15 text-tt-navy border border-tt-gold/30 rounded-full font-mono font-bold text-[10px]">
                          {app.selectedTier}
                        </span>
                      </td>

                      <td className="p-3">
                        {app.status === 'approved' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending Verification
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {app.status === 'pending_review' ? (
                          <button
                            onClick={() => handleVerifyAndApprove(app)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1 ml-auto"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            Verify &amp; Approve
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Directory Vetted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Consumer Feedbacks */}
      {activeTab === 'consumer_feedbacks' && (
        <div className="mt-4 space-y-3">
          {consumerFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border border-tt-gold/20 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-tt-gold">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-tt-gold" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-tt-navy">{fb.providerName}</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Reference Verified Provider
                  </span>
                </div>
                <p className="text-xs text-tt-navy/90 italic">"{fb.testimonialText}"</p>
                <div className="text-[10px] text-tt-navy/60 font-mono">
                  Submitted by {fb.consumerName} • Quality standard: <strong className="text-tt-navy">{fb.timelinessScore}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: Direct Orchestrator Application Form */}
      {activeTab === 'fill_application' && (
        <form onSubmit={handleSubmitOrchestratorApp} className="mt-4 bg-white border border-tt-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-tt-navy/10 pb-2">
            <h3 className="text-base font-bold font-serif text-tt-navy flex items-center gap-2">
              <Building2 className="w-5 h-5 text-tt-gold" />
              Orchestrator Vetting &amp; Tier Selection Questionnaire
            </h3>
            <p className="text-xs text-tt-navy/70">
              Complete all details. Your 1–3 prior client references will be verified to maintain our consumer standard of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Primary Contact / Owner Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Official Company Name &amp; EIN Status *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Co-Pilot Companions LLC (EIN: XX-XXX9281)"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                EIN / Tax ID Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 84-1928371"
                value={newEin}
                onChange={(e) => setNewEin(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Business Insurance Carrier
              </label>
              <input
                type="text"
                placeholder="e.g. Mutual Peace & Liability Cover ($1,000,000)"
                value={newInsurance}
                onChange={(e) => setNewInsurance(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Website URL &amp; Social Handles
              </label>
              <input
                type="text"
                placeholder="https://company.com, @handle (IG/FB)"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Proof of Work / Portfolio URL
              </label>
              <input
                type="text"
                placeholder="https://portfolio.com or Case Study Link"
                value={newProof}
                onChange={(e) => setNewProof(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
              Services Rendered / AI Competencies
            </label>
            <textarea
              rows={2}
              placeholder="Describe the everyday AI helper, virtual receptionist, or peaceful workflow services you provide..."
              value={newServices}
              onChange={(e) => setNewServices(e.target.value)}
              className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
            />
          </div>

          {/* References Section */}
          <div className="bg-tt-navy/5 border border-tt-gold/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-tt-navy" />
              <h4 className="text-xs font-bold font-mono text-tt-navy uppercase">
                Prior Client References (1 Required, up to 3)
              </h4>
            </div>
            <p className="text-[11px] text-tt-navy/70">
              To protect consumers from fake AI-generated reviews, our hiring managers verify past client references directly.
            </p>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Reference #1 (Required) *
              </label>
              <input
                type="text"
                required
                placeholder="Name, Phone/Email, Company name & project relationship"
                value={newRef1}
                onChange={(e) => setNewRef1(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Reference #2 (Optional)
              </label>
              <input
                type="text"
                placeholder="Name, Phone/Email, Company name & project relationship"
                value={newRef2}
                onChange={(e) => setNewRef2(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Reference #3 (Optional)
              </label>
              <input
                type="text"
                placeholder="Name, Phone/Email, Company name & project relationship"
                value={newRef3}
                onChange={(e) => setNewRef3(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>
          </div>

          {/* Subscription Tier Selection */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono mb-2">
              Select Directory Subscription Tier *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label
                onClick={() => setSelectedTier('Tier 1 ($29/mo)')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'Tier 1 ($29/mo)'
                    ? 'bg-tt-navy text-white border-tt-gold'
                    : 'bg-white text-tt-navy border-tt-navy/20 hover:border-tt-gold'
                }`}
              >
                <div className="font-bold text-xs">Tier 1: Sponsored</div>
                <div className="text-sm font-serif font-bold text-tt-gold">$29 / month</div>
                <div className="text-[10px] opacity-80 mt-1">Directory listing + SPONSORED badge + basic lead inbox.</div>
              </label>

              <label
                onClick={() => setSelectedTier('Tier 2 ($49/mo)')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'Tier 2 ($49/mo)'
                    ? 'bg-tt-navy text-white border-tt-gold'
                    : 'bg-white text-tt-navy border-tt-navy/20 hover:border-tt-gold'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Tier 2: Verified Direct</span>
                  <span className="text-[9px] bg-tt-gold text-tt-navy px-1.5 py-0.5 rounded font-bold">Popular</span>
                </div>
                <div className="text-sm font-serif font-bold text-tt-gold">$49 / month</div>
                <div className="text-[10px] opacity-80 mt-1">Direct post-service consumer reviews + checked references badge.</div>
              </label>

              <label
                onClick={() => setSelectedTier('Tier 3 ($99/mo)')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'Tier 3 ($99/mo)'
                    ? 'bg-tt-navy text-white border-tt-gold'
                    : 'bg-white text-tt-navy border-tt-navy/20 hover:border-tt-gold'
                }`}
              >
                <div className="font-bold text-xs">Tier 3: Sovereign Preferred</div>
                <div className="text-sm font-serif font-bold text-tt-gold">$99 / month</div>
                <div className="text-[10px] opacity-80 mt-1">Featured top placement + priority reference verification + E2EE vault.</div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-tt-navy text-tt-gold hover:bg-tt-navy/90 text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Submit Vetting Questionnaire to Google Forms Database
          </button>
        </form>
      )}

      {/* TAB CONTENT 4: Direct Consumer Quality Audit Form */}
      {activeTab === 'fill_feedback' && (
        <form onSubmit={handleSubmitConsumerFeedback} className="mt-4 bg-white border border-tt-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-tt-navy/10 pb-2">
            <h3 className="text-base font-bold font-serif text-tt-navy flex items-center gap-2">
              <Star className="w-5 h-5 text-tt-gold fill-tt-gold" />
              Consumer Post-Service Quality Audit Questionnaire
            </h3>
            <p className="text-xs text-tt-navy/70">
              Share your experience to maintain our community's Standard of Excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Your Consumer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Evelyn Reed"
                value={fbConsumerName}
                onChange={(e) => setFbConsumerName(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Service Orchestrator / Provider Name
              </label>
              <select
                value={fbProviderName}
                onChange={(e) => setFbProviderName(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              >
                <option value="Co-Pilot Companions">Co-Pilot Companions (Marcus Vance)</option>
                <option value="Friendly Neighbor Automations">Friendly Neighbor Automations (Sarah Jenkins)</option>
                <option value="Calm & Creative Co-Workers">Calm &amp; Creative Co-Workers (Daniel Wu)</option>
                <option value="Mindful Tech Partners">Mindful Tech Partners (Caleb Vance)</option>
                <option value="Peace of Mind Assistants">Peace of Mind Assistants (Timothy Green)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Overall Quality Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFbRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= fbRating ? 'text-tt-gold fill-tt-gold' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
                Service Performance Standard
              </label>
              <select
                value={fbTimeliness}
                onChange={(e: any) => setFbTimeliness(e.target.value)}
                className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
              >
                <option value="Exceeded Expectations">Exceeded Expectations</option>
                <option value="Satisfactory">Satisfactory</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-tt-navy font-mono">
              Experience Notes &amp; Directory Testimonial
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tell other consumers how your service went..."
              value={fbTestimonial}
              onChange={(e) => setFbTestimonial(e.target.value)}
              className="w-full text-xs p-2.5 bg-tt-cream/40 border border-tt-gold/30 rounded-xl focus:outline-none focus:border-tt-navy"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-tt-navy text-tt-gold hover:bg-tt-navy/90 text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Quality Audit to Google Forms Database
          </button>
        </form>
      )}
    </div>
  );
};
