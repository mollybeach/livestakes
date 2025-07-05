// path: src/app/livestakes/page.tsx
import React from "react";
import {
  MonitorPlay,
  Home,
  PieChart,
  MessageCircle,
  UserCircle2,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";
import Card from "../components/ui/card";
import Button from "../components/ui/button";
import { getMarkets } from "../data/markets";
import PageLayout from "../components/PageLayout";
import Marquee from "../components/Marquee";
import LivestakesHeader from "../components/LivestakesHeader";
import LivestakesNav from "../components/LivestakesNav";

// CardContent as a styled div
const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-3 text-sm text-black font-pixel">{children}</div>
);

// --- Helper components -------------------------------------------------------------
const PixelWindow = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-pink-500/90 border-4 border-black rounded-none shadow-window-pixel">
    <div className="flex items-center justify-between px-3 py-1 bg-pink-600 text-yellow-50 font-pixel">
      <span>{title}</span>
      <button className="bg-yellow-400 hover:bg-yellow-300 px-1 leading-none text-black border border-black">✕</button>
    </div>
    <div className="bg-yellow-50 p-4 text-black font-pixel text-sm">{children}</div>
  </div>
);

const LiveBadge = () => (
  <span className="absolute top-1 left-1 bg-green-500 text-black text-[10px] font-bold px-1 border border-black font-pixel">
    LIVE
  </span>
);

// --- Page component -----------------------------------------------------------------
export default async function LiveStakesPage() {
  const markets = await getMarkets();
  const liveMarkets = markets.filter(market => market.isLive).length;

  return (
    <PageLayout showNavigation={false}>
      <div className="min-h-screen flex font-pixel bg-purple-200">
        {/* Side Nav */}
        <aside className="w-52 bg-pink-600 text-yellow-50 flex flex-col gap-2 py-6 border-r-4 border-black">
          <nav className="flex flex-col gap-3 px-3">
            <NavItem icon={<Home size={16} />} label="Home" active={false} />
            <NavItem icon={<MonitorPlay size={16} />} label="Livestreams" active={true} />
            <NavItem icon={<PieChart size={16} />} label="Markets" active={false} />
            <NavItem icon={<MessageCircle size={16} />} label="Chat" active={false} />
            <NavItem icon={<UserCircle2 size={16} />} label="Profile" active={false} />
            <NavItem icon={<HelpCircle size={16} />} label="Support" active={false} />
            <NavItem icon={<MoreHorizontal size={16} />} label="More" active={false} />
          </nav>
          <Button className="mx-3 mt-6 bg-yellow-400 hover:bg-yellow-300 text-black border border-black font-pixel uppercase tracking-wider">
            Create Market
          </Button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top navigation */}
          <LivestakesNav />
          
          <div className="p-6">
            {/* Top marquee bar */}
            <Marquee />

            {/* Header */}
            <LivestakesHeader 
              title="LiveStakes"
              totalMarkets={markets.length}
              liveMarkets={liveMarkets}
            />

            {/* Grid of streams */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {markets.map((market) => (
                <StreamCard key={market.id} {...market} />
              ))}
            </section>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// --- Components ---------------------------------------------------------------------
const NavItem = ({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) => (
  <div
    className={`flex items-center gap-2 px-2 py-1 cursor-pointer border border-black hover:bg-pink-700 ${
      active ? "bg-pink-800" : "bg-pink-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const StreamCard = ({ thumbnail, title, team, odds, isLive, avatar, mcap, ath, viewers }: { 
  thumbnail: string; 
  title: string; 
  team: string; 
  odds: string; 
  isLive?: boolean; 
  avatar: string;
  mcap: string;
  ath: string;
  viewers?: number;
}) => (
  <Card className="relative border-4 border-black rounded-none shadow-window-pixel bg-purple-50 hover:-translate-y-1 transition-transform">
    {isLive && <LiveBadge />}
    <img
      src={thumbnail}
      alt="thumbnail"
      className="w-full h-48 object-cover border-b-4 border-black"
    />
    <CardContent>
      <div className="flex items-center gap-3 mb-2">
        <img src={avatar} alt={team} className="w-8 h-8 rounded-full border border-gray-700" />
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-xs text-gray-500">Team: {team}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs bg-green-200 text-green-900 font-bold px-2 py-0.5 rounded">mcap {mcap}</span>
        <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">ATH {ath}</span>
        {typeof viewers === 'number' && <span className="text-xs bg-yellow-200 text-yellow-900 font-bold px-2 py-0.5 rounded">👁️ {viewers}</span>}
      </div>
      <span className="text-xs bg-green-200 text-purple-900 font-bold px-2 py-0.5 rounded">Odds: {odds}</span>
      <Button className="mt-2 w-full bg-pink-600 hover:bg-pink-700 text-yellow-50 border border-black rounded-none font-pixel uppercase">
        Bet Now
      </Button>
    </CardContent>
  </Card>
);

// --- Tailwind extras (add to your global stylesheet) --------------------------------
// @layer utilities {
//   .font-pixel { @apply font-["Press_Start_2P","system-ui",monospace]; }
//   .shadow-window-pixel { box-shadow: 4px 4px 0 0 #000; }
// }
