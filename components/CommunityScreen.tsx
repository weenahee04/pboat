import React, { useState, useEffect } from 'react';
import { Post, Comment, LineUserProfile, PostCategory } from '../types';
import { getPosts, createPost, toggleLike, addComment, incrementView } from '../services/communityService';
import { MessageCircle, Heart, Share2, Plus, X, Send, Eye, Users, Sparkles, User as UserIcon } from 'lucide-react';

interface CommunityScreenProps {
  userProfile: LineUserProfile;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ userProfile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostCategory | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<PostCategory>('general');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(getPosts());
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    createPost(userProfile, newTitle, newContent, newCategory);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
    loadPosts();
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    toggleLike(postId, userProfile.userId);
    loadPosts();
    if (selectedPost && selectedPost.id === postId) {
      // Update selected post state locally to reflect like immediately in modal
      const updatedPost = getPosts().find(p => p.id === postId);
      if (updatedPost) setSelectedPost(updatedPost);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    addComment(selectedPost.id, userProfile, commentText);
    setCommentText('');
    loadPosts();
    // Refresh selected post
    const updatedPost = getPosts().find(p => p.id === selectedPost.id);
    if (updatedPost) setSelectedPost(updatedPost);
  };

  const openPost = (post: Post) => {
    incrementView(post.id);
    // Reload to get updated view count
    const updatedList = getPosts();
    setPosts(updatedList);
    const updatedPost = updatedList.find(p => p.id === post.id);
    setSelectedPost(updatedPost || post);
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  const getCategoryLabel = (cat: PostCategory) => {
    switch (cat) {
      case 'love': return 'ความรัก';
      case 'work': return 'การงาน';
      case 'ritual': return 'มูเตลู';
      default: return 'ทั่วไป';
    }
  };

  const getCategoryColor = (cat: PostCategory) => {
    switch (cat) {
      case 'love': return 'bg-pink-900/40 text-pink-400 border-pink-500/30';
      case 'work': return 'bg-blue-900/40 text-blue-400 border-blue-500/30';
      case 'ritual': return 'bg-amber-900/40 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-800/40 text-gray-400 border-gray-500/30';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'เมื่อสักครู่';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} นาทีที่แล้ว`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ชั่วโมงที่แล้ว`;
    return new Date(timestamp).toLocaleDateString('th-TH');
  };

  return (
    <div className="w-full max-w-5xl animate-fade-in pb-12 relative min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block p-3 rounded-full bg-amber-900/20 border border-amber-600/30 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Users className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-amber-100 mystical-font-th mb-2">ชุมชนแห่งชะตา</h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          พื้นที่พักใจ แลกเปลี่ยนประสบการณ์ และแบ่งปันเรื่องราวดีๆ
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 sticky top-16 z-30 py-2 backdrop-blur-sm">
        {['all', 'general', 'love', 'work', 'ritual'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filter === cat 
                ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                : 'bg-black/40 text-gray-400 border-white/10 hover:border-amber-500/50 hover:text-amber-100'
            }`}
          >
            {cat === 'all' ? 'ทั้งหมด' : getCategoryLabel(cat as PostCategory)}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
           <div className="text-center py-20 opacity-50">
             <MessageCircle className="w-12 h-12 mx-auto mb-2" />
             <p>ยังไม่มีการสนทนาในหมวดหมู่นี้</p>
           </div>
        ) : (
          filteredPosts.map(post => (
            <div 
              key={post.id}
              onClick={() => openPost(post)}
              className="glass-panel p-5 rounded-sm cursor-pointer hover:bg-white/5 transition-all border-l-4 border-l-transparent hover:border-l-amber-500 group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                    <img src={post.userAvatar || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-200 group-hover:text-amber-100 transition-colors">{post.userName}</h3>
                    <span className="text-[10px] text-gray-500">{formatTime(post.timestamp)}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-amber-50 mb-2 line-clamp-1">{post.title}</h4>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4 font-light">{post.content}</p>
              
              <div className="flex items-center gap-6 text-gray-500 text-xs border-t border-white/5 pt-3">
                <button 
                  onClick={(e) => handleLike(e, post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.likes.includes(userProfile.userId) ? 'text-red-500' : 'hover:text-red-400'}`}
                >
                  <Heart className={`w-4 h-4 ${post.likes.includes(userProfile.userId) ? 'fill-red-500' : ''}`} />
                  {post.likes.length}
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments.length}
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Eye className="w-4 h-4" />
                  {post.views}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-6 md:right-10 md:bottom-10 w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative w-full max-w-lg glass-panel p-6 rounded-sm border-t-4 border-t-amber-500 animate-fade-in-up">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> ตั้งกระทู้ใหม่
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">หัวข้อ</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-amber-500 focus:bg-white/10 outline-none text-white"
                  placeholder="เรื่องที่อยากปรึกษา..."
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">หมวดหมู่</label>
                <div className="flex gap-2 mt-2">
                  {['general', 'love', 'work', 'ritual'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat as PostCategory)}
                      className={`px-3 py-1.5 rounded-sm text-xs border transition-colors ${newCategory === cat ? getCategoryColor(cat as PostCategory) : 'border-white/10 text-gray-500'}`}
                    >
                      {getCategoryLabel(cat as PostCategory)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">เนื้อหา</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-amber-500 focus:bg-white/10 outline-none text-white h-32 resize-none"
                  placeholder="เล่ารายละเอียด..."
                />
              </div>
              <button 
                type="submit"
                disabled={!newTitle.trim() || !newContent.trim()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                โพสต์
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedPost(null)}></div>
          <div className="relative w-full max-w-2xl h-[90vh] glass-panel rounded-sm flex flex-col animate-fade-in-up border border-white/10 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
               <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedPost(null)} className="md:hidden text-gray-400 mr-2"><X className="w-6 h-6"/></button>
                  <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                    <img src={selectedPost.userAvatar || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedPost.userName}</h3>
                    <span className="text-[10px] text-gray-500">{formatTime(selectedPost.timestamp)}</span>
                  </div>
               </div>
               <button onClick={() => setSelectedPost(null)} className="hidden md:block text-gray-500 hover:text-white">
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
               <div className="mb-6">
                 <span className={`inline-block text-[10px] px-2 py-0.5 rounded border mb-3 ${getCategoryColor(selectedPost.category)}`}>
                    {getCategoryLabel(selectedPost.category)}
                 </span>
                 <h2 className="text-2xl font-bold text-amber-100 mb-4 mystical-font-th">{selectedPost.title}</h2>
                 <p className="text-gray-300 leading-relaxed font-light whitespace-pre-wrap">{selectedPost.content}</p>
               </div>

               <div className="flex items-center gap-4 py-4 border-y border-white/10 text-sm text-gray-400 mb-6">
                  <button 
                    onClick={(e) => handleLike(e, selectedPost.id)}
                    className={`flex items-center gap-2 ${selectedPost.likes.includes(userProfile.userId) ? 'text-red-500' : 'hover:text-white'}`}
                  >
                    <Heart className={`w-5 h-5 ${selectedPost.likes.includes(userProfile.userId) ? 'fill-red-500' : ''}`} /> 
                    {selectedPost.likes.length} ถูกใจ
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> {selectedPost.comments.length} ความคิดเห็น
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Eye className="w-5 h-5" /> {selectedPost.views}
                  </div>
               </div>

               {/* Comments List */}
               <div className="space-y-4">
                 {selectedPost.comments.length === 0 ? (
                   <p className="text-center text-gray-600 text-sm py-8">ยังไม่มีความคิดเห็น เป็นคนแรกที่เริ่มบทสนทนา</p>
                 ) : (
                   selectedPost.comments.map(cmt => (
                     <div key={cmt.id} className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden shrink-0 mt-1">
                          <img src={cmt.userAvatar || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white/5 rounded-r-lg rounded-bl-lg p-3 flex-1 border border-white/5">
                           <div className="flex justify-between items-baseline mb-1">
                             <span className="text-xs font-bold text-amber-500/80">{cmt.userName}</span>
                             <span className="text-[9px] text-gray-600">{formatTime(cmt.timestamp)}</span>
                           </div>
                           <p className="text-sm text-gray-300 font-light">{cmt.content}</p>
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 bg-black/60 border-t border-white/10">
              <form onSubmit={handleComment} className="flex gap-2">
                 <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:border-amber-500 focus:bg-white/10 outline-none"
                   placeholder="แสดงความคิดเห็น..."
                 />
                 <button 
                   type="submit" 
                   disabled={!commentText.trim()}
                   className="p-2 bg-amber-600 rounded-full text-black disabled:opacity-50 hover:bg-amber-500 transition-colors"
                 >
                   <Send className="w-5 h-5" />
                 </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityScreen;