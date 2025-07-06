'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Heart, MessageCircle, Send, X } from 'lucide-react';

interface Comment {
  id: number;
  user_id: number;
  livestream_id: number;
  content: string;
  parent_comment_id?: number;
  likes_count: number;
  created_at: string;
  username: string;
  avatar_url: string;
}

interface Like {
  id: number;
  user_id: number;
  livestream_id: number;
  created_at: string;
  username: string;
  avatar_url: string;
}

interface LivestreamInteractionsProps {
  livestreamId: number;
  initialLikesCount?: number;
  initialCommentsCount?: number;
}

const LivestreamInteractions: React.FC<LivestreamInteractionsProps> = ({
  livestreamId,
  initialLikesCount = 0,
  initialCommentsCount = 0
}) => {
  const { authenticated, user } = usePrivy();
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [livestreamId]);

  const fetchLikes = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/livestreams/${livestreamId}/likes`);
      
      if (response.ok) {
        const result = await response.json();
        setLikes(result.likes);
        
        // Check if current user has liked
        if (authenticated && user?.wallet?.address) {
          const userProfile = await getUserProfile(user.wallet.address);
          if (userProfile) {
            const userLiked = result.likes.some((like: Like) => like.user_id === userProfile.id);
            setIsLiked(userLiked);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/livestreams/${livestreamId}/comments`);
      
      if (response.ok) {
        const result = await response.json();
        setComments(result.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const getUserProfile = async (walletAddress: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/users/${walletAddress}`);
      
      if (response.ok) {
        const result = await response.json();
        return result.user;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  const handleLike = async () => {
    if (!authenticated || !user?.wallet?.address) {
      alert('Please connect your wallet to like this livestream');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await getUserProfile(user.wallet.address);
      if (!userProfile) {
        alert('Please create a profile first');
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      
      if (isLiked) {
        // Unlike
        await fetch(`${API_BASE_URL}/api/likes/${userProfile.id}/${livestreamId}`, {
          method: 'DELETE',
        });
        setIsLiked(false);
        setLikes(prev => prev.filter(like => like.user_id !== userProfile.id));
      } else {
        // Like
        const response = await fetch(`${API_BASE_URL}/api/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userProfile.id,
            livestream_id: livestreamId,
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.like) {
            setIsLiked(true);
            setLikes(prev => [...prev, result.like]);
          }
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!authenticated || !user?.wallet?.address) {
      alert('Please connect your wallet to comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await getUserProfile(user.wallet.address);
      if (!userProfile) {
        alert('Please create a profile first');
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          livestream_id: livestreamId,
          content: newComment.trim(),
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setComments(prev => [result.comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-yellow-50 border-2 border-black rounded-none p-4">
      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-2 border-2 border-black rounded-none font-bold transition-colors ${
            isLiked 
              ? 'bg-red-600 text-yellow-50 hover:bg-red-700' 
              : 'bg-white text-black hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          <span>{likes.length}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-black hover:bg-gray-100 rounded-none font-bold transition-colors"
        >
          <MessageCircle size={16} />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t-2 border-black pt-4">
          {/* Comment Input */}
          {authenticated && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={isLoading || !newComment.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-yellow-50 border-2 border-black rounded-none font-bold transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white border-2 border-black p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.avatar_url || "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png"}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full border border-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-black text-sm">{comment.username}</span>
                        <span className="text-gray-600 text-xs">{formatTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-black text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamInteractions; 