"use client";
import React, { useEffect, useState } from "react";
import { getAllLivestreams, getActiveLivestreams, Livestream } from '../lib/livestreamsApi';
import Image from 'next/image';
import { FaHeart, FaCommentDots, FaBullseye, FaWallet } from 'react-icons/fa';

const randomNames = [
  "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"
];
const randomComments = [
  "This is awesome!",
  "Love this stream!",
  "So cool!",
  "Great content!",
  "Amazing work!",
  "Keep it up!",
  "Super interesting.",
  "Can't wait for more!",
  "🔥🔥🔥",
  "Legendary!"
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomComments() {
  const count = getRandomInt(2, 4);
  return Array.from({ length: count }).map(() => ({
    name: randomNames[getRandomInt(0, randomNames.length - 1)],
    text: randomComments[getRandomInt(0, randomComments.length - 1)]
  }));
}

function TitleDescriptionOverlay({ title, description }: { title: string; description?: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const isLong = description && description.length > maxLength;
  const displayText = expanded || !isLong ? description : description?.slice(0, maxLength) + '...';
  return (
    <div className="absolute bottom-8 left-0 w-full z-30 px-4 flex flex-col items-start pointer-events-none">
      <div className="max-w-[70%] w-fit flex flex-col items-start">
        <span className="font-bold text-base md:text-lg text-white mb-1 pointer-events-auto" style={{textShadow: '0 2px 8px #000, 0 1px 1px #000'}}>{title}</span>
        {description && (
          <span className="text-white text-sm w-full break-words pointer-events-auto" style={{textShadow: '0 1px 4px #000a'}}>
            {displayText}
            {isLong && !expanded && (
              <button
                className="ml-2 text-fuchsia underline text-xs"
                onClick={() => setExpanded(true)}
              >
                More
              </button>
            )}
            {isLong && expanded && (
              <button
                className="ml-2 text-fuchsia underline text-xs"
                onClick={() => setExpanded(false)}
              >
                Less
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

const FeedPage = () => {
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<{ [id: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [id: number]: number }>({});
  const [liked, setLiked] = useState<{ [id: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: number]: string }>({});
  const [allComments, setAllComments] = useState<{ [id: number]: { name: string; text: string }[] }>({});

  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        setError(null);
        const allResponse = await getAllLivestreams({ limit: 50 });
        if (allResponse.success && allResponse.data) {
          setLivestreams(allResponse.data);
          // Initialize like counts
          const initialLikes: { [id: number]: number } = {};
          const initialComments: { [id: number]: { name: string; text: string }[] } = {};
          allResponse.data.forEach((stream) => {
            initialLikes[stream.id] = Math.floor(Math.random() * 500) + 10;
            initialComments[stream.id] = [
              { name: 'Alice', text: 'This is awesome!' },
              { name: 'Bob', text: 'Love this stream!' },
              { name: 'Charlie', text: 'So cool!' },
            ];
          });
          setLikeCounts(initialLikes);
          setAllComments(initialComments);
        }
      } catch (err) {
        setError('Failed to load livestreams');
      } finally {
        setLoading(false);
      }
    };
    fetchLivestreams();
  }, []);

  const handleToggleComments = (id: number) => {
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = (id: number) => {
    setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + (liked[id] ? -1 : 1) }));
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentInput = (id: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendComment = (id: number) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    setAllComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { name: 'You', text }],
    }));
    setCommentInputs((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="min-h-screen bg-pink-200">
      {loading ? (
        <div className="text-center py-8 text-purple-800">
          <div className="text-4xl mb-4">🔄</div>
          <p>Loading livestreams...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-purple-800">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          {livestreams.length > 0 ? (
            livestreams.map((stream) => {
              const comments = [
                { name: 'Alice', text: 'This is awesome!' },
                { name: 'Bob', text: 'Love this stream!' },
                { name: 'Charlie', text: 'So cool!' },
              ];
              const isCommentsOpen = openComments[stream.id];
              return (
                <div
                  key={stream.id}
                  className="relative w-full max-w-md h-[80vh] mb-8 flex flex-col justify-end border-4 border-black shadow-window-pixel bg-black overflow-hidden"
                  style={{ minHeight: 400 }}
                >
                  {/* Video/Thumbnail or Video */}
                  {stream.stream_url ? (
                    <video
                      src={stream.stream_url}
                      className="object-cover w-full h-full absolute inset-0"
                      controls
                      muted
                      loop
                      playsInline
                      style={{ minHeight: 400 }}
                    />
                  ) : (
                    <Image
                      src={stream.thumbnail_url || "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png"}
                      alt={stream.title}
                      fill
                      className="object-cover w-full h-full opacity-80"
                    />
                  )}
                  {/* TikTok-style title + description overlay, both pushed down */}
                  <TitleDescriptionOverlay title={stream.title} description={stream.description} />
                  {/* Action Sidebar */}
                  <div className="absolute right-2 bottom-28 z-50 flex flex-col items-center gap-8 pointer-events-auto">
                    {/* Creator address icon */}
                    <div className="flex flex-col items-center text-xl opacity-90 pointer-events-auto">
                      <FaWallet style={{ color: '#fff', filter: 'drop-shadow(0 1px 4px #000a)' }} />
                      <span className="text-[10px] mt-1 max-w-[60px] truncate text-white/80" title={stream.creator_wallet_address}>
                        {stream.creator_wallet_address.slice(0, 6)}...{stream.creator_wallet_address.slice(-4)}
                      </span>
                    </div>
                    {/* Like */}
                    <button
                      onClick={() => handleLike(stream.id)}
                      className={`flex flex-col items-center text-xl transition-all pointer-events-auto ${liked[stream.id] ? 'text-fuchsia scale-110' : 'text-white hover:text-fuchsia'}`}
                      style={{ textShadow: '0 1px 4px #000a' }}
                    >
                      <FaHeart />
                      <span className="text-[11px] mt-1 text-white/80" style={{ textShadow: '0 1px 4px #000a' }}>{likeCounts[stream.id] || 0}</span>
                    </button>
                    {/* Bet */}
                    <button
                      className="flex flex-col items-center text-xl text-white hover:text-yellow-400 transition-all pointer-events-auto"
                      style={{ textShadow: '0 1px 4px #000a' }}
                      // onClick={...} // Add modal or action here
                    >
                      <FaBullseye />
                      <span className="text-[11px] mt-1 text-white/80" style={{ textShadow: '0 1px 4px #000a' }}>Bet</span>
                    </button>
                    {/* Comment */}
                    <button
                      onClick={() => handleToggleComments(stream.id)}
                      className="flex flex-col items-center text-xl text-white hover:text-blue-400 transition-all pointer-events-auto"
                      style={{ textShadow: '0 1px 4px #000a' }}
                    >
                      <FaCommentDots />
                      <span className="text-[11px] mt-1 text-white/80" style={{ textShadow: '0 1px 4px #000a' }}>{comments.length}</span>
                    </button>
                  </div>
                  {/* Overlay UI */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2">
                    {/* Comments Dropdown */}
                    <div className="relative">
                      {isCommentsOpen && (
                        <div
                          id={`comments-${stream.id}`}
                          className="absolute right-0 bottom-10 w-72 max-w-[90vw] z-50 bg-cream/95 border-4 border-black rounded-lg p-4 shadow-window-pixel max-h-64 overflow-y-auto mt-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 flex flex-col"
                          style={{ minWidth: 260 }}
                        >
                          {/* Close (X) button */}
                          <button
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-fuchsia text-white font-bold border-2 border-black shadow hover:bg-yellow-400 hover:text-fuchsia transition-colors z-10"
                            onClick={() => handleToggleComments(stream.id)}
                            aria-label="Close comments"
                          >
                            ×
                          </button>
                          <div className="font-bold text-plum text-xs mb-3 sticky top-0 bg-cream/95 pb-2 border-b-2 border-black">Comments</div>
                          <ul className="flex flex-col gap-3 flex-1 mb-2">
                            {(allComments[stream.id] || []).map((c, cidx) => (
                              <li
                                key={cidx}
                                className={`flex ${cidx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`px-3 py-2 rounded-2xl border-2 border-black max-w-[80%] text-xs break-words shadow-window-pixel ${
                                    cidx % 2 === 0
                                      ? 'bg-periwinkle text-navy rounded-bl-none'
                                      : 'bg-yellow-100 text-fuchsia rounded-br-none'
                                  }`}
                                >
                                  <span className="font-bold text-fuchsia mr-1">{c.name}:</span> {c.text}
                                </div>
                              </li>
                            ))}
                          </ul>
                          {/* Comment form */}
                          <form
                            className="flex gap-2 mt-2"
                            onSubmit={e => { e.preventDefault(); handleSendComment(stream.id); }}
                          >
                            <input
                              type="text"
                              value={commentInputs[stream.id] || ''}
                              onChange={e => handleCommentInput(stream.id, e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 px-2 py-1 rounded-lg border-2 border-black text-xs bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia"
                              maxLength={120}
                            />
                            <button
                              type="submit"
                              className="px-3 py-1 rounded-2xl border-2 border-black bg-fuchsia text-white text-xs shadow-window-pixel hover:bg-yellow-400 hover:text-fuchsia transition-colors"
                            >
                              Send
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-purple-800">
              <div className="text-4xl mb-4">📺</div>
              <p>No livestreams found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedPage; 