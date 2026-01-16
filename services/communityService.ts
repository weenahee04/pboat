import { Post, Comment, PostCategory, LineUserProfile } from '../types';

const STORAGE_KEY = 'cheewit_community_posts';

// Initial Mock Data
const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'system',
    userName: 'Grandmaster (Admin)',
    userAvatar: 'https://cdn-icons-png.flaticon.com/512/1995/1995667.png',
    category: 'general',
    title: 'ยินดีต้อนรับสู่ชุมชนแห่งชะตา',
    content: 'พื้นที่นี้สร้างขึ้นเพื่อให้กัลยาณมิตรทุกท่านได้แลกเปลี่ยนความคิดเห็น ปรึกษาปัญหาชีวิต และแบ่งปันเรื่องราวดีๆ ขอให้ทุกท่านสนทนาด้วยความสุภาพและเมตตาธรรม',
    likes: ['u1', 'u2', 'u3'],
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Somsak',
        content: 'สาธุครับ',
        timestamp: Date.now() - 100000
      }
    ],
    timestamp: Date.now() - 86400000,
    views: 128
  },
  {
    id: 'p2',
    userId: 'u_mock_1',
    userName: 'Nidnoi Story',
    category: 'love',
    title: 'ปีชงกับความรัก เกี่ยวกันไหมคะ?',
    content: 'ปีนี้เป็นปีชง รู้สึกทะเลาะกับแฟนบ่อยมาก มีวิธีแก้เคล็ดไหมคะ หรือควรไปไหว้พระที่ไหนดี ร้อนใจมากเลยค่ะ',
    likes: [],
    comments: [],
    timestamp: Date.now() - 3600000,
    views: 45
  }
];

const loadPosts = (): Post[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_POSTS));
    return MOCK_POSTS;
  }
  return JSON.parse(stored);
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getPosts = (): Post[] => {
  return loadPosts().sort((a, b) => b.timestamp - a.timestamp);
};

export const createPost = (user: LineUserProfile, title: string, content: string, category: PostCategory): Post => {
  const posts = loadPosts();
  const newPost: Post = {
    id: `post_${Date.now()}`,
    userId: user.userId,
    userName: user.displayName,
    userAvatar: user.pictureUrl,
    category,
    title,
    content,
    likes: [],
    comments: [],
    timestamp: Date.now(),
    views: 0
  };
  
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
};

export const toggleLike = (postId: string, userId: string): boolean => {
  const posts = loadPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) return false;
  
  const post = posts[postIndex];
  const hasLiked = post.likes.includes(userId);
  
  if (hasLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }
  
  posts[postIndex] = post;
  savePosts(posts);
  return !hasLiked; // Return new state (true = liked, false = unliked)
};

export const addComment = (postId: string, user: LineUserProfile, content: string): Comment | null => {
  const posts = loadPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) return null;
  
  const newComment: Comment = {
    id: `cmt_${Date.now()}`,
    userId: user.userId,
    userName: user.displayName,
    userAvatar: user.pictureUrl,
    content,
    timestamp: Date.now()
  };
  
  posts[postIndex].comments.push(newComment);
  savePosts(posts);
  return newComment;
};

export const incrementView = (postId: string) => {
   const posts = loadPosts();
   const postIndex = posts.findIndex(p => p.id === postId);
   if (postIndex !== -1) {
     posts[postIndex].views += 1;
     savePosts(posts);
   }
};
