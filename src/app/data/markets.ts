import type { MarketDataType } from '../../types/types';

export const mockMarkets: MarketDataType[] = [
  {
    id: 1,
    title: "Eth Global Cannes - Winner",
    description: "Predict whether the winning project of the Eth Global Cannes Hackathon will be recognised as the best overall project.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Interoperability",
    totalVolume: 12500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Eth Global",
    website: "https://ethglobal.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Project",
        total: 12500,
        breakdown: [
          { place: "1st", amount: 6500 },
          { place: "2nd", amount: 4500 },
          { place: "3rd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "LayerZero - Best Omnichain Interaction",
    description: "Predict whether a build will win the LayerZero Best Omnichain Interaction prize.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Interoperability",
    totalVolume: 12500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "LayerZero",
    website: "https://layerzero.network",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Omnichain Interaction",
        total: 12500,
        breakdown: [
          { place: "1st", amount: 6500 },
          { place: "2nd", amount: 4500 },
          { place: "3rd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "1inch - Non‑EVM Extensions for Fusion+",
    description: "Predict the winner of the 1inch Fusion+ Non‑EVM extension challenge.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "DeFi",
    totalVolume: 12000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "1inch",
    website: "https://1inch.io",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Non‑EVM Extensions for 1inch Cross‑Chain Swap (Fusion+)",
        total: 12000,
        breakdown: [
          { place: "1st", amount: 6000 },
          { place: "2nd", amount: 4000 },
          { place: "3rd", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Worldcoin - Best Mini App",
    description: "Predict the winner of Worldcoin's Best Mini App bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Consumer Apps",
    totalVolume: 17000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Worldcoin",
    website: "https://world.org",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Mini App",
        total: 17000,
        breakdown: [
          { place: "1st", amount: 6500 },
          { place: "2nd", amount: 4500 },
          { place: "3rd", amount: 2000 },
          { place: "Honorable Mention", amount: 4000 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Oasis Protocol - Build on Oasis Stack",
    description: "Predict the winner of Oasis Protocol's Build on Oasis Stack bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Privacy",
    totalVolume: 10000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Oasis Protocol",
    website: "https://oasis.net",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Build on Oasis Stack",
        total: 10000,
        breakdown: [
          { place: "1st", amount: 5000 },
          { place: "2nd", amount: 3000 },
          { place: "3rd", amount: 1500 },
          { place: "DevEx feedback", amount: 500 }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Zircuit - Best Project Deployed on Zircuit",
    description: "Predict the best project deployed on the Zircuit AI‑powered blockchain.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Security",
    totalVolume: 3500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Zircuit",
    website: "https://zircuit.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Project Deployed on Zircuit",
        total: 3500,
        breakdown: [
          { place: "Winner", amount: 3500 }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Chainlink - Best Usage of CCIP/CCT",
    description: "Predict the winner for the best usage of Chainlink CCIP or CCT.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Oracle",
    totalVolume: 6000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Chainlink",
    website: "https://chain.link",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best usage of Chainlink CCIP and/or CCT",
        total: 6000,
        breakdown: [
          { place: "Winner", amount: 6000 }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Flare - Main Track",
    description: "Predict the winner of Flare's main track bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Infrastructure",
    totalVolume: 8000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Flare",
    website: "https://flare.network",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Main Track",
        total: 8000,
        breakdown: [
          { place: "1st", amount: 4000 },
          { place: "2nd", amount: 2500 },
          { place: "3rd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Hedera - AI on Hedera",
    description: "Predict the winner of the AI on Hedera challenge.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "AI",
    totalVolume: 3500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Hedera",
    website: "https://hedera.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "AI on Hedera",
        total: 3500,
        breakdown: [
          { place: "1st", amount: 2000 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Ledger - Clear Signing (ERC‑7730)",
    description: "Predict the project that will win Ledger's Clear Signing bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Hardware",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Ledger",
    website: "https://ledger.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Clear Signing (ERC‑7730)",
        total: 4000,
        breakdown: [
          { place: "1st", amount: 2500 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Ledger - Hardware Integrations",
    description: "Predict the winner of Ledger's Hardware Integrations bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Hardware",
    totalVolume: 5000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Ledger",
    website: "https://ledger.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Hardware Integrations",
        total: 5000,
        breakdown: [
          { place: "1st", amount: 3000 },
          { place: "2nd", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Avail - Best use of Avail Nexus SDK",
    description: "Predict the project that best uses the Avail Nexus SDK.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Cross‑Chain",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Avail",
    website: "https://availproject.org",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best use of Avail Nexus SDK for Gaming, DeFi, RWAs, Stablecoins",
        total: 4000,
        breakdown: [
          { place: "Winner", amount: 4000 }
        ]
      }
    ]
  },
  {
    id: 13,
    title: "Flow - Best Killer App",
    description: "Predict the winner of Flow's Best Killer App challenge.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Consumer",
    totalVolume: 6000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Flow",
    website: "https://flow.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Killer App on Flow",
        total: 6000,
        breakdown: [
          { place: "1st", amount: 3500 },
          { place: "2nd", amount: 1500 },
          { place: "3rd", amount: 1000 }
        ]
      }
    ]
  },
  {
    id: 14,
    title: "Circle - Multichain USDC Payment System",
    description: "Predict the winner of Circle's multichain USDC payment bounty.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Payments",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Circle",
    website: "https://circle.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Build a Multichain USDC Payment System",
        total: 4000,
        breakdown: [
          { place: "1st", amount: 2500 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 15,
    title: "ENS - Most Creative Use Case",
    description: "Predict the most creative ENS use case.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Identity",
    totalVolume: 2000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "ENS",
    website: "https://ens.domains",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Most Creative Use Case",
        total: 2000,
        breakdown: [
          { place: "Winner", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 16,
    title: "Walrus - Best App Using Walrus",
    description: "Predict the best app using Walrus decentralized storage.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Storage",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Walrus",
    website: "https://walrus.xyz",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best app using Walrus for storage",
        total: 4000,
        breakdown: [
          { place: "Winner", amount: 4000 }
        ]
      }
    ]
  },
  {
    id: 17,
    title: "The Graph - Best Use of GRC‑20‑ts Library",
    description: "Predict the winner for best use of the GRC‑20‑ts library in a dApp.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Indexing",
    totalVolume: 1000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "The Graph",
    website: "https://thegraph.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Use of GRC‑20‑ts Library in a Dapp",
        total: 1000,
        breakdown: [
          { place: "1st", amount: 1000 }
        ]
      }
    ]
  },
  {
    id: 18,
    title: "Self Protocol - Best Self On‑chain SDK Integration",
    description: "Predict the winner for best integration of the Self.xyz SDK.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Compliance",
    totalVolume: 9000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Self Protocol",
    website: "https://self.xyz",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Self onchain SDK Integration",
        total: 9000,
        breakdown: [
          { place: "1st", amount: 5000 },
          { place: "2nd", amount: 2500 },
          { place: "3rd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 19,
    title: "ASI Alliance - Innovator's Edge",
    description: "Predict the most impactful AI agent built on the ASI stack.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "AI",
    totalVolume: 10000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Artificial Superintelligence Alliance",
    website: "https://superintelligence.io",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Innovator's Edge: most impactful AI Agent",
        total: 10000,
        breakdown: [
          { place: "1st", amount: 5000 },
          { place: "2nd", amount: 3000 },
          { place: "3rd", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 20,
    title: "Privy - Best Consumer App",
    description: "Predict the best consumer‑facing app built on Privy.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Wallet Infra",
    totalVolume: 1700,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Privy",
    website: "https://privy.io",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Consumer App Built on Privy",
        total: 1700,
        breakdown: [
          { place: "Winner", amount: 1700 }
        ]
      }
    ]
  },
  {
    id: 21,
    title: "Fluence - Best Use of Fluence Virtual Servers in AI",
    description: "Predict the best AI build using Fluence Virtual Servers.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "DePIN",
    totalVolume: 2000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Fluence",
    website: "https://fluence.network",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Use of Fluence Virtual Servers in AI",
        total: 2000,
        breakdown: [
          { place: "Winner", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 22,
    title: "Saga - Best dApp built on Saga Chain",
    description: "Predict the best dApp built on a Saga Chain.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "L1",
    totalVolume: 5000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Saga",
    website: "https://saga.xyz",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best dApp built on Saga Chain",
        total: 5000,
        breakdown: [
          { place: "1st", amount: 3000 },
          { place: "2nd", amount: 1500 },
          { place: "3rd", amount: 500 }
        ]
      }
    ]
  },
  {
    id: 23,
    title: "Hardhat - Best Hardhat Plugin",
    description: "Predict the best Hardhat plugin created during the hackathon.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Developer Tools",
    totalVolume: 2000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Hardhat",
    website: "https://hardhat.org",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Hardhat Plugin",
        total: 2000,
        breakdown: [
          { place: "Winner", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 24,
    title: "INTMAX - Best ZK App",
    description: "Predict the best zero-knowledge application built on INTMAX.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "ZK",
    totalVolume: 3000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "INTMAX",
    website: "https://intmax.io",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best ZK App on INTMAX",
        total: 3000,
        breakdown: [
          { place: "1st", amount: 2000 },
          { place: "2nd", amount: 1000 }
        ]
      }
    ]
  },
  {
    id: 25,
    title: "Euler Labs - Best DeFi Integration",
    description: "Predict the best DeFi integration using Euler Labs protocols.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "DeFi",
    totalVolume: 2500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Euler Labs",
    website: "https://euler.finance",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best DeFi Integration",
        total: 2500,
        breakdown: [
          { place: "Winner", amount: 2500 }
        ]
      }
    ]
  },
  {
    id: 26,
    title: "Mantle - Best L2 App",
    description: "Predict the best application built on Mantle L2.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "L2",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Mantle",
    website: "https://mantle.xyz",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best L2 App on Mantle",
        total: 4000,
        breakdown: [
          { place: "1st", amount: 2500 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 27,
    title: "Mantle - Best Gaming App",
    description: "Predict the best gaming application built on Mantle.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Gaming",
    totalVolume: 3500,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Mantle",
    website: "https://mantle.xyz",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Gaming App on Mantle",
        total: 3500,
        breakdown: [
          { place: "1st", amount: 2000 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 28,
    title: "Ronin - Best Gaming Integration",
    description: "Predict the best gaming integration using Ronin blockchain.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Gaming",
    totalVolume: 3000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Ronin",
    website: "https://roninchain.com",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Gaming Integration",
        total: 3000,
        breakdown: [
          { place: "Winner", amount: 3000 }
        ]
      }
    ]
  },
  {
    id: 29,
    title: "Ethereum Foundation - ZK Mo Pro",
    description: "Predict the best zero-knowledge proof application.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "ZK",
    totalVolume: 5000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Ethereum Foundation",
    website: "https://zkmopro.org",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "ZK Mo Pro Challenge",
        total: 5000,
        breakdown: [
          { place: "1st", amount: 3000 },
          { place: "2nd", amount: 2000 }
        ]
      }
    ]
  },
  {
    id: 30,
    title: "0G - Best AI x Web3 App",
    description: "Predict the best AI-powered Web3 application built on 0G.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "AI",
    totalVolume: 4000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "0G",
    website: "https://0g.network",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best AI x Web3 App on 0G",
        total: 4000,
        breakdown: [
          { place: "1st", amount: 2500 },
          { place: "2nd", amount: 1500 }
        ]
      }
    ]
  },
  {
    id: 31,
    title: "Katana - Best Cross-Chain App",
    description: "Predict the best cross-chain application built on Katana.",
    creator_wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    status: "scheduled",
    start_time: "2025-07-12T09:00:00Z",
    end_time: "2025-07-14T18:00:00Z",
    view_count: 0,
    category: "Cross-Chain",
    totalVolume: 3000,
    participants: 0,
    odds: "",
    prediction: "",
    sponsor: "Katana",
    website: "https://katana.network",
    contract_address: "0x1234567890123456789012345678901234567890",
    prizes: [
      {
        title: "Best Cross-Chain App on Katana",
        total: 3000,
        breakdown: [
          { place: "Winner", amount: 3000 }
        ]
      }
    ]
  }
];

export type { MarketDataType };
