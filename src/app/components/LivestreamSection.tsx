'use client';

import { Livestream } from '../lib/livestreamsApi';
import LivestreamCard from './LivestreamCard';

interface LivestreamSectionProps {
  title: string;
  livestreams: Livestream[];
  onLivestreamView?: (livestream: Livestream) => void;
  emptyMessage?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function LivestreamSection({ 
  title, 
  livestreams, 
  onLivestreamView, 
  emptyMessage = "No livestreams available",
  showViewAll = false,
  onViewAll
}: LivestreamSectionProps) {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {showViewAll && onViewAll && livestreams.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
          >
            View All →
          </button>
        )}
      </div>

      {/* Content */}
      {livestreams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-gray-400 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {livestreams.map((livestream) => (
            <LivestreamCard
              key={livestream.id}
              livestream={livestream}
              onView={onLivestreamView}
            />
          ))}
        </div>
      )}
    </section>
  );
} 