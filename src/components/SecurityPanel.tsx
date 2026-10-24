import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, Server, Key, CheckCircle } from "lucide-react";

interface SecurityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityPanel({ isOpen, onClose }: SecurityPanelProps) {
  const [encryptActive, setEncryptActive] = useState(true);

  if (!isOpen) return null;

  const mockRawData = {
    transactionId: "TXN-9982410-B",
    consumer: "tiny.rassmann@gmail.com",
    routingNumber: "*****6789",
    accountNumber: "**********4421",
    subscriptionPlan: "TerraForm Sovereign Business Tier",
    billingCycle: "Monthly Recur ($49.00)",
    jobSiteGPS: "30.2672° N, 97.7431° W",
    vettedInsuranceHash: "sha256-4b1a8f6d2e9c..."
  };

  const mockEncryptedData = `U2FsdGVkX1+vP4S1wN1O/o6bZ6zG8iXbO+WqZmL3yW7tG/kZ7v9D6FpY2gX6zT7
YhK8X6P1gN4B6FpZ6zH8iXbO+WqZmL3yW7tG/kZ7v9D6FpY2gX6zT7YhK8X6P1g
N4B6FpZ6zH8iXbO+WqZmL3yW7tG/kZ7v9D6FpY2gX6zT7YhK8X6P1gN4B6FpZ6z
H8iXbO+WqZmL3yW7tG/kZ7v9D6FpY2gX6zT7YhK8X6P1gN4B6FpZ6zH8iXbO+Wq
ZmL3yW7tG/kZ7v9D6FpY2gX6zT7YhK8X6P1gN4B6FpZ6zH8iXbO+WqZmL3yW7tG`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl h-full bg-gradient-to-b from-tt-navy to-tt-midnight text-tt-cream p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-tt-gold/30 relative">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(212,175,55,0.01)_40px,rgba(212,175,55,0.01)_41px)] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-tt-gold/20 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-tt-gold" />
              <h2 className="text-xl font-bold tracking-tight font-serif text-tt-cream">
                TerraForm Sovereign Vault Security
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-tt-cream hover:text-tt-gold text-xs font-bold bg-tt-midnight/50 border border-tt-gold/30 px-3 py-1 rounded-md transition-colors"
            >
              Close
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-tt-navy/40 rounded-xl p-4 border border-tt-gold/20">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-tt-gold" />
                <h3 className="font-bold text-tt-cream font-serif text-sm">
                  Dual-Layer Transaction Encryption
                </h3>
              </div>
              <p className="text-xs text-tt-ivory/80 leading-relaxed">
                All business subscriptions, consumer routing values, and account information
                are processed utilizing AES-256 hardware-accelerated encryption. Jobsite records,
                vetted insurance PDF payloads, and recurring customer details remain ciphered
                at rest and in transit.
              </p>
            </div>

            {/* Interactive Live View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-tt-gold/80 tracking-widest">
                  Live Database State Visualizer
                </span>
                <button
                  onClick={() => setEncryptActive(!encryptActive)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    encryptActive
                      ? "bg-tt-gold/10 text-tt-gold border border-tt-gold/30"
                      : "bg-tt-red/10 text-tt-gold border border-tt-gold/30"
                  }`}
                >
                  {encryptActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      SECURE: CYPHERTEXT
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      UNENCRYPTED RAWS
                    </>
                  )}
                </button>
              </div>

              <div className="relative bg-black/85 rounded-xl p-4 border border-tt-gold/20 font-mono text-xs overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-tt-gold/60">
                  <Server className="w-3 h-3" />
                  <span>US-CENTRAL-1 DB</span>
                </div>

                {encryptActive ? (
                  <div className="space-y-2 text-tt-gold animate-pulse">
                    <div className="text-[10px] text-tt-gold/60 border-b border-tt-gold/15 pb-1 mb-1 font-mono">
                      AES-256 STORAGE OUTPUT (REST)
                    </div>
                    <pre className="whitespace-pre-wrap break-all leading-normal text-tt-cream/70 font-mono">
                      {mockEncryptedData}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2 text-tt-cream">
                    <div className="text-[10px] text-tt-amber border-b border-tt-gold/15 pb-1 mb-1 font-mono">
                      DECRYPTED CLIENT VIEW (SSL/TLS SESSION)
                    </div>
                    <pre className="whitespace-pre-wrap leading-normal text-tt-ivory">
                      {JSON.stringify(mockRawData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* High Security Protocols Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-tt-gold/80 uppercase tracking-wider">
                Vetted Safety Frameworks
              </h4>
              <div className="space-y-2">
                {[
                  "PCI-DSS Level 1 Compliant platform subscription vault",
                  "Automated daily audit matching of business general liability policies",
                  "Zero-Knowledge client architecture keeping credentials private",
                  "SHA-256 cryptographically signed customer review trails"
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-tt-ivory/90">
                    <CheckCircle className="w-4 h-4 text-tt-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-tt-gold/20 pt-4 mt-6 text-[10px] text-tt-gold/60 flex justify-between items-center font-mono relative z-10">
          <span>COORDINATE SYNC: ACTIVE</span>
          <span className="flex items-center gap-1 text-tt-gold font-bold">
            <Key className="w-3 h-3" /> E2EE VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
}
