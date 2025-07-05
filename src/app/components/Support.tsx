"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Video,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import Button from "./ui/button";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface SupportProps {
  faqs?: FAQItem[];
}

const Support: React.FC<SupportProps> = ({ faqs = [] }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const mockFaqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I place a bet on a prediction market?",
      answer: "To place a bet, navigate to any active prediction market, click 'Place Bet', enter your amount, and confirm the transaction. Make sure you have sufficient funds in your connected wallet.",
      category: "Betting",
    },
    {
      id: 2,
      question: "What happens if I win a prediction?",
      answer: "When you win a prediction, your winnings are automatically calculated based on the odds and added to your wallet. You can withdraw your winnings at any time.",
      category: "Winnings",
    },
    {
      id: 3,
      question: "How do I create my own prediction market?",
      answer: "Click 'Create Market' in the sidebar, fill in the market details including prediction, end date, and odds. Submit for review and your market will go live once approved.",
      category: "Creating Markets",
    },
    {
      id: 4,
      question: "What are the fees for using LiveStakes?",
      answer: "LiveStakes charges a 2% platform fee on all bets. Gas fees for blockchain transactions are additional and vary based on network congestion.",
      category: "Fees",
    },
    {
      id: 5,
      question: "How do I connect my wallet?",
      answer: "Click 'Connect Wallet' in the header, select your preferred wallet (MetaMask, WalletConnect, etc.), and approve the connection. Your wallet address will then be linked to your account.",
      category: "Wallet",
    },
    {
      id: 6,
      question: "Can I cancel a bet after placing it?",
      answer: "No, bets cannot be cancelled once placed. Make sure to review all details carefully before confirming your bet.",
      category: "Betting",
    },
    {
      id: 7,
      question: "How are prediction outcomes determined?",
      answer: "Outcomes are determined by real-world events and verified through multiple data sources. For crypto predictions, we use price feeds from major exchanges.",
      category: "Outcomes",
    },
    {
      id: 8,
      question: "What happens if a market is cancelled?",
      answer: "If a market is cancelled, all bets are refunded in full. You'll receive your original bet amount back in your wallet.",
      category: "Refunds",
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : mockFaqs;

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@livestakes.fun",
      action: "Send Email",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 24/7",
      action: "Start Chat",
    },
    {
      icon: <Phone size={24} />,
      title: "Phone Support",
      description: "Call us directly",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
    },
  ];

  const helpResources = [
    {
      icon: <BookOpen size={24} />,
      title: "User Guide",
      description: "Complete platform guide",
      link: "/guide",
    },
    {
      icon: <Video size={24} />,
      title: "Video Tutorials",
      description: "Learn with videos",
      link: "/tutorials",
    },
    {
      icon: <Users size={24} />,
      title: "Community",
      description: "Join our Discord",
      link: "https://discord.gg/livestakes",
    },
    {
      icon: <Globe size={24} />,
      title: "Blog",
      description: "Latest updates & tips",
      link: "/blog",
    },
  ];

  return (
    <div className="min-h-screen bg-mauve font-pixel p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-plum border-4 border-black p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle size={32} className="text-gold" />
              <div>
                <h1 className="text-3xl font-bold text-cream">Support Center</h1>
                <p className="text-butter font-pixel">Get help with LiveStakes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gold text-2xl font-bold">24/7</div>
              <div className="text-cream text-sm font-pixel">Support Available</div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-periwinkle border-4 border-black p-6 text-center">
              <div className="text-gold mb-4 flex justify-center">
                {method.icon}
              </div>
              <h3 className="text-cream font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-butter text-sm mb-3">{method.description}</p>
              <div className="text-gold font-pixel text-sm mb-4">{method.contact}</div>
              <Button className="bg-gold hover:bg-butter text-black border-2 border-black font-pixel uppercase tracking-wider">
                {method.action}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-periwinkle border-4 border-black p-6">
            <h2 className="text-2xl font-bold text-cream mb-6 flex items-center gap-2">
              <HelpCircle size={24} />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {displayFaqs.map((faq) => (
                <div key={faq.id} className="bg-lavender border-2 border-black">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-mauve transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-plum text-sm">{faq.question}</h3>
                      <span className="text-xs text-purple-600 bg-mauve px-2 py-1 border border-purple-300">
                        {faq.category}
                      </span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={16} className="text-purple-600" />
                    ) : (
                      <ChevronDown size={16} className="text-purple-600" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-700 text-sm">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Help Resources */}
          <div className="bg-periwinkle border-4 border-black p-6">
            <h2 className="text-2xl font-bold text-cream mb-6 flex items-center gap-2">
              <BookOpen size={24} />
              Help Resources
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {helpResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  target={resource.link.startsWith('http') ? '_blank' : undefined}
                  rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="bg-lavender border-2 border-black p-4 hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-purple-600">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-plum">{resource.title}</h3>
                      <p className="text-purple-700 text-sm">{resource.description}</p>
                    </div>
                    <ExternalLink size={16} className="text-purple-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-periwinkle border-4 border-black p-6 mt-8">
          <h2 className="text-2xl font-bold text-cream mb-6 flex items-center gap-2">
            <Award size={24} />
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-lavender border-2 border-black p-4 text-center">
              <div className="text-purple-600 mb-3 flex justify-center">
                <Shield size={32} />
              </div>
              <h3 className="font-bold text-plum mb-2">Secure Betting</h3>
              <p className="text-purple-700 text-sm">All transactions are secured by blockchain technology with transparent smart contracts.</p>
            </div>
            <div className="bg-lavender border-2 border-black p-4 text-center">
              <div className="text-purple-600 mb-3 flex justify-center">
                <Zap size={32} />
              </div>
              <h3 className="font-bold text-plum mb-2">Instant Payouts</h3>
              <p className="text-purple-700 text-sm">Receive your winnings instantly when predictions are resolved.</p>
            </div>
            <div className="bg-lavender border-2 border-black p-4 text-center">
              <div className="text-purple-600 mb-3 flex justify-center">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-plum mb-2">Community Driven</h3>
              <p className="text-purple-700 text-sm">Join a community of traders and creators building the future of prediction markets.</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-periwinkle border-4 border-black p-6 mt-8">
          <h2 className="text-2xl font-bold text-cream mb-6 flex items-center gap-2">
            <HelpCircle size={24} />
            Quick Troubleshooting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-lavender border-2 border-black p-4">
              <h3 className="font-bold text-plum mb-2">Can't connect wallet?</h3>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Make sure your wallet extension is installed</li>
                <li>• Try refreshing the page</li>
                <li>• Check if your wallet is unlocked</li>
                <li>• Ensure you're on the correct network</li>
              </ul>
            </div>
            <div className="bg-lavender border-2 border-black p-4">
              <h3 className="font-bold text-plum mb-2">Transaction failed?</h3>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Check your wallet has enough funds</li>
                <li>• Ensure sufficient gas fees</li>
                <li>• Try increasing gas limit</li>
                <li>• Wait for network congestion to clear</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 