export interface Step {
  icon: string;
  title: string;
  description: string;
}

export const mockSteps: Step[] = [
  {
    icon: "📝",
    title: "1. Create a Market",
    description: "Spin up a new prediction market for your project or event."
  },
  {
    icon: "💸",
    title: "2. Place Your Bets",
    description: "Bet on outcomes using your custom coin or FLOW."
  },
  {
    icon: "🎉",
    title: "3. Watch Live Results",
    description: "See odds and results update in real time as bets come in."
  },
  {
    icon: "🏆",
    title: "4. Claim Rewards",
    description: "Winners claim instant payouts and climb the leaderboard!"
  },
]; 