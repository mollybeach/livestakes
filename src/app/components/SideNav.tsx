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
import Button from "./ui/button";
import NavItem from "./NavItem";

const SideNav = () => (
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
);

export default SideNav; 