export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  contact: string;
  action: string;
}

export interface HelpResource {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export const mockFaqs: FAQItem[] = [
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

export const mockContactMethods: ContactMethod[] = [
  {
    icon: "Mail",
    title: "Email Support",
    description: "Get help via email",
    contact: "support@livestakes.fun",
    action: "Send Email",
  },
  {
    icon: "MessageCircle",
    title: "Live Chat",
    description: "Chat with our team",
    contact: "Available 24/7",
    action: "Start Chat",
  },
  {
    icon: "Phone",
    title: "Phone Support",
    description: "Call us directly",
    contact: "+1 (555) 123-4567",
    action: "Call Now",
  },
];

export const mockHelpResources: HelpResource[] = [
  {
    icon: "BookOpen",
    title: "User Guide",
    description: "Complete platform guide",
    link: "/guide",
  },
  {
    icon: "Video",
    title: "Video Tutorials",
    description: "Learn with videos",
    link: "/tutorials",
  },
  {
    icon: "Users",
    title: "Community",
    description: "Join our Discord",
    link: "https://discord.gg/livestakes",
  },
  {
    icon: "Globe",
    title: "Blog",
    description: "Latest updates & tips",
    link: "/blog",
  },
]; 