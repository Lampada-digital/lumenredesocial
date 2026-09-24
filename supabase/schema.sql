-- ============================================
-- LUMEN - REDE SOCIAL CATÓLICA
-- Schema PostgreSQL para Supabase
-- ============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- Perfil público dos usuários
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  city TEXT,
  parish TEXT,
  diocese TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'priest', 'deacon', 'religious', 'seminarian', 'catechist', 'pastoral_coordinator', 'parish_admin', 'diocese_admin', 'community_admin', 'moderator', 'platform_admin')),
  verified BOOLEAN DEFAULT FALSE,
  presence TEXT DEFAULT 'online' CHECK (presence IN ('online', 'away', 'busy', 'dnd', 'invisible')),
  presence_message TEXT DEFAULT 'Disponível',
  devotions TEXT[] DEFAULT '{}',
  pastorals TEXT[] DEFAULT '{}',
  friends_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: friendships
-- Relações de amizade
-- ============================================
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- ============================================
-- TABELA: follows
-- Sistema de seguidores
-- ============================================
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- ============================================
-- TABELA: posts
-- Publicações do feed
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'prayer', 'event', 'formation', 'poll')),
  privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public', 'friends', 'followers', 'community', 'private')),
  media_urls TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',
  mentions TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  prayer_title TEXT,
  prayer_description TEXT,
  prayer_category TEXT,
  prayers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: post_likes
-- Curtidas em posts
-- ============================================
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- TABELA: post_comments
-- Comentários em posts
-- ============================================
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: post_saves
-- Posts salvos
-- ============================================
CREATE TABLE post_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- TABELA: prayer_reactions
-- "Vou rezar por você"
-- ============================================
CREATE TABLE prayer_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- TABELA: communities
-- Comunidades/grupos
-- ============================================
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cover_url TEXT,
  type TEXT DEFAULT 'public' CHECK (type IN ('public', 'private', 'institutional')),
  category TEXT,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: community_members
-- Membros de comunidades
-- ============================================
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- ============================================
-- TABELA: conversations
-- Conversas (DM e grupos)
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_group BOOLEAN DEFAULT FALSE,
  group_name TEXT,
  group_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: conversation_participants
-- Participantes de conversas
-- ============================================
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- ============================================
-- TABELA: messages
-- Mensagens
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'audio', 'video', 'file')),
  media_url TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: events
-- Eventos
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'other' CHECK (type IN ('mass', 'adoration', 'novena', 'procession', 'retreat', 'catechesis', 'formation', 'meeting', 'other')),
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT,
  parish TEXT,
  image_url TEXT,
  organizer_id UUID REFERENCES profiles(id),
  participants_count INTEGER DEFAULT 0,
  interested_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: event_participants
-- Participantes de eventos
-- ============================================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'not_going')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABELA: courses
-- Cursos de formação
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  instructor_id UUID REFERENCES profiles(id),
  category TEXT,
  modules_count INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  duration TEXT,
  enrolled_count INTEGER DEFAULT 0,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: course_enrollments
-- Inscrições em cursos
-- ============================================
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- ============================================
-- TABELA: notifications
-- Notificações
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  resource_type TEXT,
  resource_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: stories
-- Stories (24h)
-- ============================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  caption TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para performance
-- ============================================
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Atualizar contadores de amizade
CREATE OR REPLACE FUNCTION update_friendship_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' THEN
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.requester_id;
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.addressee_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_friendship_accepted
AFTER UPDATE ON friendships
FOR EACH ROW
WHEN (NEW.status = 'accepted' AND OLD.status != 'accepted')
EXECUTE FUNCTION update_friendship_counts();

-- Atualizar contadores de likes
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_like_change
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

-- Atualizar contadores de comentários
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();

-- Atualizar contadores de seguidores
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON follows
FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();

-- Atualizar contadores de membros de comunidade
CREATE OR REPLACE FUNCTION update_community_members_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET members_count = members_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET members_count = members_count - 1 WHERE id = OLD.community_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_change
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW
EXECUTE FUNCTION update_community_members_count();

-- Criar profile automaticamente ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
BEGIN
  -- Gerar username único baseado no email
  username_val := LOWER(SPLIT_PART(NEW.email, '@', 1));
  
  -- Se username já existe, adicionar sufixo aleatório
  IF EXISTS (SELECT 1 FROM profiles WHERE username = username_val) THEN
    username_val := username_val || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6);
  END IF;
  
  INSERT INTO profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    username_val,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Profiles: todos podem ver, só o dono pode editar
CREATE POLICY "Profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: públicos são visíveis para todos
CREATE POLICY "Posts are viewable by everyone" ON posts
FOR SELECT USING (true);

CREATE POLICY "Users can create own posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
FOR DELETE USING (auth.uid() = author_id);

-- Likes: todos podem ver, usuários podem gerenciar os próprios
CREATE POLICY "Likes are viewable by everyone" ON post_likes
FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON post_likes
FOR ALL USING (auth.uid() = user_id);

-- Comments: todos podem ver e criar
CREATE POLICY "Comments are viewable by everyone" ON post_comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON post_comments
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON post_comments
FOR DELETE USING (auth.uid() = author_id);

-- Saves: só o dono vê
CREATE POLICY "Users can view own saves" ON post_saves
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saves" ON post_saves
FOR ALL USING (auth.uid() = user_id);

-- Friendships
CREATE POLICY "Users can view own friendships" ON friendships
FOR SELECT USING (auth.uid() IN (requester_id, addressee_id));

CREATE POLICY "Users can create friendship requests" ON friendships
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of" ON friendships
FOR UPDATE USING (auth.uid() IN (requester_id, addressee_id));

-- Follows
CREATE POLICY "Follows are viewable by everyone" ON follows
FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON follows
FOR ALL USING (auth.uid() = follower_id);

-- Communities
CREATE POLICY "Communities are viewable by everyone" ON communities
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create communities" ON communities
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Community members
CREATE POLICY "Community members are viewable by everyone" ON community_members
FOR SELECT USING (true);

CREATE POLICY "Users can join communities" ON community_members
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" ON community_members
FOR DELETE USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "Users can view own conversations" ON conversations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT WITH CHECK (true);

-- Conversation participants
CREATE POLICY "Users can view own conversation participation" ON conversation_participants
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join conversations" ON conversation_participants
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can view messages in their conversations" ON messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages" ON messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Events
CREATE POLICY "Events are viewable by everyone" ON events
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events
FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Event participants
CREATE POLICY "Event participants are viewable by everyone" ON event_participants
FOR SELECT USING (true);

CREATE POLICY "Users can manage own event participation" ON event_participants
FOR ALL USING (auth.uid() = user_id);

-- Notifications: só o dono vê
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Courses: todos podem ver
CREATE POLICY "Courses are viewable by everyone" ON courses
FOR SELECT USING (true);

-- Course enrollments
CREATE POLICY "Users can view own enrollments" ON course_enrollments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON course_enrollments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON course_enrollments
FOR UPDATE USING (auth.uid() = user_id);

-- Prayer reactions
CREATE POLICY "Prayer reactions are viewable by everyone" ON prayer_reactions
FOR SELECT USING (true);

CREATE POLICY "Users can manage own prayer reactions" ON prayer_reactions
FOR ALL USING (auth.uid() = user_id);

-- Stories
CREATE POLICY "Stories are viewable by everyone" ON stories
FOR SELECT USING (true);

CREATE POLICY "Users can create own stories" ON stories
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON stories
FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Criar buckets para arquivos
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('messages', 'messages', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true);

-- Políticas de storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Cover images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Users can upload their own cover" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Post media is publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload post media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');

CREATE POLICY "Stories are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'stories');

CREATE POLICY "Authenticated users can upload stories" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'stories' AND auth.role() = 'authenticated');

-- ============================================
-- DADOS INICIAIS (cursos de exemplo)
-- ============================================

INSERT INTO courses (title, description, category, modules_count, lessons_count, duration, level) VALUES
('Introdução à Sagrada Escritura', 'Curso completo sobre a Bíblia: estrutura, contexto histórico, métodos de interpretação.', 'Bíblia', 8, 32, '20 horas', 'beginner'),
('Catecismo da Igreja Católica', 'Estudo aprofundado do Catecismo: credos, sacramentos, moral e oração.', 'Doutrina', 12, 48, '40 horas', 'intermediate'),
('Liturgia e Celebração', 'Compreenda a beleza e o significado da liturgia católica.', 'Liturgia', 6, 24, '15 horas', 'beginner'),
('História da Igreja', 'Dos apóstolos aos dias atuais: 2000 anos de história da Igreja.', 'História da Igreja', 10, 40, '30 horas', 'beginner'),
('Teologia Moral', 'Fundamentos da moral católica e aplicação na vida cotidiana.', 'Doutrina', 8, 32, '25 horas', 'intermediate'),
('Comunicação para Evangelização', 'Formação PASCOM: técnicas de comunicação aplicadas à evangelização digital.', 'Comunicação', 5, 20, '12 horas', 'beginner');
