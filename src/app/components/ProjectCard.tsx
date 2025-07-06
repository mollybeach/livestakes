import React, { useState } from 'react';
import { mockMarkets } from '../data/markets';

interface ProjectCardProps {
  livestream: any;
  onSave: (updated: any) => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ended', label: 'Ended' },
];

const categoryOptions = [
  { value: 'hackathon', label: '🏆 Hackathon' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'technology', label: '💻 Technology' },
  { value: 'education', label: '📚 Education' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'music', label: '🎵 Music' },
  { value: 'lifestyle', label: '🌟 Lifestyle' },
  { value: 'news', label: '📰 News' },
  { value: 'art', label: '🎨 Art' },
  { value: 'cooking', label: '👨‍🍳 Cooking' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'business', label: '💼 Business' },
  { value: 'comedy', label: '😂 Comedy' },
  { value: 'science', label: '🔬 Science' },
  { value: 'other', label: '📦 Other' },
  { value: 'general', label: '📦 General' },
];

const ProjectCard: React.FC<ProjectCardProps> = ({ livestream, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...livestream });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...livestream });
    setEditing(false);
  };

  return (
    <div className="bg-periwinkle border-4 border-black rounded-lg p-6 flex flex-col items-center gap-3 shadow-window-pixel hover:-translate-y-1 transition-transform">
      <img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-full border-2 border-black mb-2 shadow-window-pixel" />
      {editing ? (
        <>
          <input
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="Avatar URL"
          />
          <input
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <select
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="market_address"
            value={form.market_address || ''}
            onChange={handleChange}
          >
            <option value="">Select Market</option>
            {mockMarkets.map(market => (
              <option key={market.contract_address} value={market.contract_address}>
                {market.title} ({market.contract_address.slice(0, 6)}...{market.contract_address.slice(-4)})
              </option>
            ))}
          </select>
          <input
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="github_url"
            value={form.github_url || 'https://github.com'}
            onChange={handleChange}
            placeholder="GitHub Link"
          />
          <select
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="border-2 border-black px-2 py-1 mb-1 w-full bg-white text-black font-pixel"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded shadow-window-pixel font-pixel" onClick={handleSave}>Save</button>
            <button className="bg-gray-300 px-3 py-1 rounded shadow-window-pixel font-pixel" onClick={handleCancel}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-bold text-lg mb-1 text-cream font-pixel text-center">{form.title}</h3>
          {form.market_address && (
            <div className="text-xs mb-1">
              <span className="bg-yellow-200 text-purple-900 px-2 py-1 rounded font-mono border border-black" title={form.market_address}>
                {form.market_address.slice(0, 6)}...{form.market_address.slice(-4)}
              </span>
            </div>
          )}
          <div className="flex gap-2 mb-1">
            <span className="bg-sky text-navy px-2 py-1 text-xs font-pixel border border-black rounded">{form.category}</span>
            <span className={`px-2 py-1 text-xs font-pixel border-2 border-black rounded ${form.status === 'active' ? 'bg-sage text-forest' : form.status === 'ended' ? 'bg-sky text-navy' : 'bg-butter text-yellow-900'}`}>{form.status}</span>
          </div>
          <div className="text-xs text-butter mb-1 font-pixel">
            GitHub: <a href={form.github_url || 'https://github.com'} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{form.github_url || 'https://github.com'}</a>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mt-2 shadow-window-pixel font-pixel" onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default ProjectCard; 