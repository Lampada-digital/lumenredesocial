// Sistema de banco de dados local usando localStorage
// Funciona imediatamente sem configuração externa

const DB_KEYS = {
  USERS: 'lumen_users',
  POSTS: 'lumen_posts',
  LIKES: 'lumen_likes',
  COMMENTS: 'lumen_comments',
  SAVES: 'lumen_saves',
  COMMUNITIES: 'lumen_communities',
  COMMUNITY_MEMBERS: 'lumen_community_members',
  EVENTS: 'lumen_events',
  EVENT_PARTICIPANTS: 'lumen_event_participants',
  COURSES: 'lumen_courses',
  COURSE_ENROLLMENTS: 'lumen_course_enrollments',
  FRIENDSHIPS: 'lumen_friendships',
  FOLLOWS: 'lumen_follows',
  NOTIFICATIONS: 'lumen_notifications',
  SESSION: 'lumen_session',
};

// Helper functions
function getStore<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================
// USERS
// ============================================

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  username: string;
  full_name: string;
  avatar_url: string;
  cover_url: string;
  bio: string;
  city: string;
  parish: string;
  diocese: string;
  role: string;
  verified: boolean;
  presence: string;
  presence_message: string;
  devotions: string[];
  pastorals: string[];
  friends_count: number;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export function createUser(userData: {
  email: string;
  password: string;
  username: string;
  full_name: string;
  city?: string;
  parish?: string;
}): LocalUser | { error: string } {
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  
  // Verifica se email já existe
  if (users.find(u => u.email === userData.email)) {
    return { error: 'Email já cadastrado' };
  }
  
  // Verifica se username já existe
  if (users.find(u => u.username === userData.username)) {
    return { error: 'Username já existe' };
  }
  
  const newUser: LocalUser = {
    id: generateId(),
    email: userData.email,
    password: userData.password, // Em produção, isso seria hasheado
    username: userData.username,
    full_name: userData.full_name,
    avatar_url: '',
    cover_url: '',
    bio: '',
    city: userData.city || '',
    parish: userData.parish || '',
    diocese: '',
    role: 'user',
    verified: false,
    presence: 'online',
    presence_message: 'Disponível',
    devotions: [],
    pastorals: [],
    friends_count: 0,
    followers_count: 0,
    following_count: 0,
    created_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  setStore(DB_KEYS.USERS, users);
  
  return newUser;
}

export function authenticateUser(email: string, password: string): LocalUser | null {
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

export function getUserById(id: string): LocalUser | null {
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  return users.find(u => u.id === id) || null;
}

export function updateUser(id: string, updates: Partial<LocalUser>): void {
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    setStore(DB_KEYS.USERS, users);
  }
}

export function searchUsers(query: string): LocalUser[] {
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  const lowerQuery = query.toLowerCase();
  return users.filter(u => 
    u.full_name.toLowerCase().includes(lowerQuery) ||
    u.username.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// SESSION
// ============================================

export function saveSession(userId: string): void {
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
  }));
}

export function getSession(): string | null {
  try {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    if (!session) return null;
    
    const { userId, expiresAt } = JSON.parse(session);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(DB_KEYS.SESSION);
      return null;
    }
    
    return userId;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(DB_KEYS.SESSION);
}

// ============================================
// POSTS
// ============================================

export interface LocalPost {
  id: string;
  author_id: string;
  content: string;
  type: string;
  privacy: string;
  media_urls: string[];
  hashtags: string[];
  mentions: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  prayer_title: string;
  prayer_description: string;
  prayer_category: string;
  prayers_count: number;
  created_at: string;
  author?: LocalUser;
}

export function createPost(postData: {
  author_id: string;
  content: string;
  type?: string;
  privacy?: string;
  prayer_title?: string;
  prayer_description?: string;
  prayer_category?: string;
}): LocalPost {
  const posts = getStore<LocalPost>(DB_KEYS.POSTS);
  
  const newPost: LocalPost = {
    id: generateId(),
    author_id: postData.author_id,
    content: postData.content,
    type: postData.type || 'text',
    privacy: postData.privacy || 'public',
    media_urls: [],
    hashtags: [],
    mentions: [],
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    prayer_title: postData.prayer_title || '',
    prayer_description: postData.prayer_description || '',
    prayer_category: postData.prayer_category || '',
    prayers_count: 0,
    created_at: new Date().toISOString(),
  };
  
  posts.unshift(newPost);
  setStore(DB_KEYS.POSTS, posts);
  
  return newPost;
}

export function getPosts(limit = 20, offset = 0): LocalPost[] {
  const posts = getStore<LocalPost>(DB_KEYS.POSTS);
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  
  return posts
    .slice(offset, offset + limit)
    .map(post => ({
      ...post,
      author: users.find(u => u.id === post.author_id),
    }));
}

export function toggleLike(postId: string, userId: string): boolean {
  const likes = getStore<{ post_id: string; user_id: string }>(DB_KEYS.LIKES);
  const existingIndex = likes.findIndex(l => l.post_id === postId && l.user_id === userId);
  
  if (existingIndex !== -1) {
    likes.splice(existingIndex, 1);
    setStore(DB_KEYS.LIKES, likes);
    
    // Atualiza contador
    const posts = getStore<LocalPost>(DB_KEYS.POSTS);
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes_count = Math.max(0, post.likes_count - 1);
      setStore(DB_KEYS.POSTS, posts);
    }
    
    return false;
  } else {
    likes.push({ post_id: postId, user_id: userId });
    setStore(DB_KEYS.LIKES, likes);
    
    // Atualiza contador
    const posts = getStore<LocalPost>(DB_KEYS.POSTS);
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes_count++;
      setStore(DB_KEYS.POSTS, posts);
    }
    
    return true;
  }
}

export function isLiked(postId: string, userId: string): boolean {
  const likes = getStore<{ post_id: string; user_id: string }>(DB_KEYS.LIKES);
  return likes.some(l => l.post_id === postId && l.user_id === userId);
}

// ============================================
// COMMUNITIES
// ============================================

export interface LocalCommunity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cover_url: string;
  type: string;
  category: string;
  members_count: number;
  created_by: string;
  created_at: string;
}

export function getCommunities(): LocalCommunity[] {
  return getStore<LocalCommunity>(DB_KEYS.COMMUNITIES);
}

export function joinCommunity(communityId: string, userId: string): void {
  const members = getStore<{ community_id: string; user_id: string }>(DB_KEYS.COMMUNITY_MEMBERS);
  
  if (!members.some(m => m.community_id === communityId && m.user_id === userId)) {
    members.push({ community_id: communityId, user_id: userId });
    setStore(DB_KEYS.COMMUNITY_MEMBERS, members);
    
    // Atualiza contador
    const communities = getStore<LocalCommunity>(DB_KEYS.COMMUNITIES);
    const community = communities.find(c => c.id === communityId);
    if (community) {
      community.members_count++;
      setStore(DB_KEYS.COMMUNITIES, communities);
    }
  }
}

export function leaveCommunity(communityId: string, userId: string): void {
  const members = getStore<{ community_id: string; user_id: string }>(DB_KEYS.COMMUNITY_MEMBERS);
  const index = members.findIndex(m => m.community_id === communityId && m.user_id === userId);
  
  if (index !== -1) {
    members.splice(index, 1);
    setStore(DB_KEYS.COMMUNITY_MEMBERS, members);
    
    // Atualiza contador
    const communities = getStore<LocalCommunity>(DB_KEYS.COMMUNITIES);
    const community = communities.find(c => c.id === communityId);
    if (community) {
      community.members_count = Math.max(0, community.members_count - 1);
      setStore(DB_KEYS.COMMUNITIES, communities);
    }
  }
}

export function isMember(communityId: string, userId: string): boolean {
  const members = getStore<{ community_id: string; user_id: string }>(DB_KEYS.COMMUNITY_MEMBERS);
  return members.some(m => m.community_id === communityId && m.user_id === userId);
}

// ============================================
// EVENTS
// ============================================

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  organizer_id: string;
  participants_count: number;
  created_at: string;
}

export function getEvents(): LocalEvent[] {
  return getStore<LocalEvent>(DB_KEYS.EVENTS);
}

export function joinEvent(eventId: string, userId: string): void {
  const participants = getStore<{ event_id: string; user_id: string }>(DB_KEYS.EVENT_PARTICIPANTS);
  
  if (!participants.some(p => p.event_id === eventId && p.user_id === userId)) {
    participants.push({ event_id: eventId, user_id: userId });
    setStore(DB_KEYS.EVENT_PARTICIPANTS, participants);
    
    // Atualiza contador
    const events = getStore<LocalEvent>(DB_KEYS.EVENTS);
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.participants_count++;
      setStore(DB_KEYS.EVENTS, events);
    }
  }
}

// ============================================
// COURSES
// ============================================

export interface LocalCourse {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  modules_count: number;
  lessons_count: number;
  duration: string;
  enrolled_count: number;
  level: string;
  created_at: string;
}

export function getCourses(): LocalCourse[] {
  return getStore<LocalCourse>(DB_KEYS.COURSES);
}

export function enrollInCourse(courseId: string, userId: string): void {
  const enrollments = getStore<{ course_id: string; user_id: string }>(DB_KEYS.COURSE_ENROLLMENTS);
  
  if (!enrollments.some(e => e.course_id === courseId && e.user_id === userId)) {
    enrollments.push({ course_id: courseId, user_id: userId });
    setStore(DB_KEYS.COURSE_ENROLLMENTS, enrollments);
    
    // Atualiza contador
    const courses = getStore<LocalCourse>(DB_KEYS.COURSES);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.enrolled_count++;
      setStore(DB_KEYS.COURSES, courses);
    }
  }
}

// ============================================
// FILE UPLOAD (Base64)
// ============================================

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const base64 = await fileToBase64(file);
    updateUser(userId, { avatar_url: base64 });
    return base64;
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    return null;
  }
}

export async function uploadCover(userId: string, file: File): Promise<string | null> {
  try {
    const base64 = await fileToBase64(file);
    updateUser(userId, { cover_url: base64 });
    return base64;
  } catch (error) {
    console.error('Erro ao fazer upload da capa:', error);
    return null;
  }
}

// ============================================
// CREATE COMMUNITY
// ============================================

export function createCommunity(data: {
  name: string;
  description: string;
  type: string;
  category: string;
  created_by: string;
  image_url?: string;
  cover_url?: string;
}): LocalCommunity {
  const communities = getStore<LocalCommunity>(DB_KEYS.COMMUNITIES);
  
  const newCommunity: LocalCommunity = {
    id: generateId(),
    name: data.name,
    description: data.description,
    image_url: data.image_url || '',
    cover_url: data.cover_url || '',
    type: data.type,
    category: data.category,
    members_count: 1, // Criador já é membro
    created_by: data.created_by,
    created_at: new Date().toISOString(),
  };
  
  communities.unshift(newCommunity);
  setStore(DB_KEYS.COMMUNITIES, communities);
  
  // Adiciona criador como membro
  joinCommunity(newCommunity.id, data.created_by);
  
  return newCommunity;
}

// ============================================
// CREATE EVENT
// ============================================

export function createEvent(data: {
  title: string;
  description: string;
  type: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer_id: string;
  image_url?: string;
}): LocalEvent {
  const events = getStore<LocalEvent>(DB_KEYS.EVENTS);
  
  const newEvent: LocalEvent = {
    id: generateId(),
    title: data.title,
    description: data.description,
    type: data.type,
    event_date: data.event_date,
    event_time: data.event_time,
    location: data.location,
    image_url: data.image_url || '',
    organizer_id: data.organizer_id,
    participants_count: 0,
    created_at: new Date().toISOString(),
  };
  
  events.unshift(newEvent);
  setStore(DB_KEYS.EVENTS, events);
  
  return newEvent;
}

// ============================================
// CREATE COURSE
// ============================================

export function createCourse(data: {
  title: string;
  description: string;
  category: string;
  modules_count: number;
  lessons_count: number;
  duration: string;
  level: string;
  instructor_id: string;
  image_url?: string;
}): LocalCourse {
  const courses = getStore<LocalCourse>(DB_KEYS.COURSES);
  
  const newCourse: LocalCourse = {
    id: generateId(),
    title: data.title,
    description: data.description,
    image_url: data.image_url || '',
    category: data.category,
    modules_count: data.modules_count,
    lessons_count: data.lessons_count,
    duration: data.duration,
    enrolled_count: 0,
    level: data.level,
    created_at: new Date().toISOString(),
  };
  
  courses.unshift(newCourse);
  setStore(DB_KEYS.COURSES, courses);
  
  return newCourse;
}

// ============================================
// COMMENTS
// ============================================

export interface LocalComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: LocalUser;
}

export function createComment(postId: string, authorId: string, content: string): LocalComment {
  const comments = getStore<LocalComment>('lumen_comments');
  
  const newComment: LocalComment = {
    id: generateId(),
    post_id: postId,
    author_id: authorId,
    content: content,
    created_at: new Date().toISOString(),
  };
  
  comments.unshift(newComment);
  setStore('lumen_comments', comments);
  
  // Atualiza contador do post
  const posts = getStore<LocalPost>(DB_KEYS.POSTS);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments_count++;
    setStore(DB_KEYS.POSTS, posts);
  }
  
  return newComment;
}

export function getComments(postId: string): LocalComment[] {
  const comments = getStore<LocalComment>('lumen_comments');
  const users = getStore<LocalUser>(DB_KEYS.USERS);
  
  return comments
    .filter(c => c.post_id === postId)
    .map(comment => ({
      ...comment,
      author: users.find(u => u.id === comment.author_id),
    }));
}

// ============================================
// POST WITH IMAGE
// ============================================

export function createPostWithImage(postData: {
  author_id: string;
  content: string;
  type?: string;
  privacy?: string;
  image_url?: string;
}): LocalPost {
  const posts = getStore<LocalPost>(DB_KEYS.POSTS);
  
  const newPost: LocalPost = {
    id: generateId(),
    author_id: postData.author_id,
    content: postData.content,
    type: postData.type || 'image',
    privacy: postData.privacy || 'public',
    media_urls: postData.image_url ? [postData.image_url] : [],
    hashtags: [],
    mentions: [],
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    prayer_title: '',
    prayer_description: '',
    prayer_category: '',
    prayers_count: 0,
    created_at: new Date().toISOString(),
  };
  
  posts.unshift(newPost);
  setStore(DB_KEYS.POSTS, posts);
  
  return newPost;
}

// ============================================
// INITIAL DATA
// ============================================

export function initializeData(): void {
  // Cria comunidades de exemplo
  const communities = getStore<LocalCommunity>(DB_KEYS.COMMUNITIES);
  if (communities.length === 0) {
    const sampleCommunities: LocalCommunity[] = [
      {
        id: generateId(),
        name: 'Jovens Católicos',
        description: 'Comunidade para jovens católicos compartilharem sua fé',
        image_url: '',
        cover_url: '',
        type: 'public',
        category: 'Juventude',
        members_count: 0,
        created_by: 'system',
        created_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Estudos Bíblicos',
        description: 'Grupo de estudo e reflexão da Sagrada Escritura',
        image_url: '',
        cover_url: '',
        type: 'public',
        category: 'Formação',
        members_count: 0,
        created_by: 'system',
        created_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'PASCOM Brasil',
        description: 'Pastoral da Comunicação - Compartilhando a fé através dos meios digitais',
        image_url: '',
        cover_url: '',
        type: 'institutional',
        category: 'Comunicação',
        members_count: 0,
        created_by: 'system',
        created_at: new Date().toISOString(),
      },
    ];
    setStore(DB_KEYS.COMMUNITIES, sampleCommunities);
  }
  
  // Cria eventos de exemplo
  const events = getStore<LocalEvent>(DB_KEYS.EVENTS);
  if (events.length === 0) {
    const sampleEvents: LocalEvent[] = [
      {
        id: generateId(),
        title: 'Missa Dominical',
        description: 'Celebração Eucarística dominical',
        type: 'mass',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '09:00',
        location: 'Paróquia Nossa Senhora Aparecida',
        image_url: '',
        organizer_id: 'system',
        participants_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Retiro de Quaresma',
        description: 'Retiro espiritual para preparação da Páscoa',
        type: 'retreat',
        event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_time: '08:00',
        location: 'Casa de Retiros',
        image_url: '',
        organizer_id: 'system',
        participants_count: 0,
        created_at: new Date().toISOString(),
      },
    ];
    setStore(DB_KEYS.EVENTS, sampleEvents);
  }
  
  // Cria cursos de exemplo
  const courses = getStore<LocalCourse>(DB_KEYS.COURSES);
  if (courses.length === 0) {
    const sampleCourses: LocalCourse[] = [
      {
        id: generateId(),
        title: 'Introdução à Sagrada Escritura',
        description: 'Curso completo sobre a Bíblia',
        image_url: '',
        category: 'Bíblia',
        modules_count: 8,
        lessons_count: 32,
        duration: '20 horas',
        enrolled_count: 0,
        level: 'beginner',
        created_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Catecismo da Igreja Católica',
        description: 'Estudo aprofundado do Catecismo',
        image_url: '',
        category: 'Doutrina',
        modules_count: 12,
        lessons_count: 48,
        duration: '40 horas',
        enrolled_count: 0,
        level: 'intermediate',
        created_at: new Date().toISOString(),
      },
    ];
    setStore(DB_KEYS.COURSES, sampleCourses);
  }
}
