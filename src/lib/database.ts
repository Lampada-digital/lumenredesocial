import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// POSTS
// ============================================

export async function fetchPosts(limit = 20, offset = 0) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }

  return data || [];
}

export async function createPost(post: {
  author_id: string;
  content: string;
  type?: string;
  privacy?: string;
  media_urls?: string[];
  hashtags?: string[];
  mentions?: string[];
  prayer_title?: string;
  prayer_description?: string;
  prayer_category?: string;
}) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .single();

  if (error) {
    console.error('Erro ao criar post:', error);
    return null;
  }

  return data;
}

export async function togglePostLike(postId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  // Verifica se já curtiu
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Remove like
    await supabase.from('post_likes').delete().eq('id', existing.id);
    return { liked: false };
  } else {
    // Adiciona like
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    return { liked: true };
  }
}

export async function checkPostLiked(postId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

// ============================================
// PROFILES
// ============================================

export async function fetchProfile(userId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  return data;
}

export async function fetchProfileByUsername(username: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  return data;
}

export async function searchProfiles(query: string, limit = 10) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar perfis:', error);
    return [];
  }

  return data || [];
}

// ============================================
// COMMUNITIES
// ============================================

export async function fetchCommunities(limit = 20) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('members_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar comunidades:', error);
    return [];
  }

  return data || [];
}

export async function joinCommunity(communityId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('community_members')
    .insert({ community_id: communityId, user_id: userId, role: 'member' })
    .select()
    .single();

  if (error) {
    console.error('Erro ao entrar na comunidade:', error);
    return null;
  }

  return data;
}

export async function leaveCommunity(communityId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('community_id', communityId)
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao sair da comunidade:', error);
    return false;
  }

  return true;
}

export async function checkCommunityMembership(communityId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data } = await supabase
    .from('community_members')
    .select('id')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

// ============================================
// EVENTS
// ============================================

export async function fetchEvents(limit = 20) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(*)
    `)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }

  return data || [];
}

export async function joinEvent(eventId: string, userId: string, status = 'interested') {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('event_participants')
    .upsert({ event_id: eventId, user_id: userId, status })
    .select()
    .single();

  if (error) {
    console.error('Erro ao participar do evento:', error);
    return null;
  }

  return data;
}

// ============================================
// COURSES
// ============================================

export async function fetchCourses(limit = 20) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!instructor_id(*)
    `)
    .order('enrolled_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar cursos:', error);
    return [];
  }

  return data || [];
}

export async function enrollInCourse(courseId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('course_enrollments')
    .insert({ course_id: courseId, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Erro ao se inscrever no curso:', error);
    return null;
  }

  return data;
}

// ============================================
// FRIENDSHIPS
// ============================================

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('friendships')
    .insert({ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' })
    .select()
    .single();

  if (error) {
    console.error('Erro ao enviar solicitação:', error);
    return null;
  }

  return data;
}

export async function acceptFriendRequest(friendshipId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId);

  if (error) {
    console.error('Erro ao aceitar solicitação:', error);
    return false;
  }

  return true;
}

// ============================================
// FOLLOWS
// ============================================

export async function toggleFollow(followerId: string, followingId: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  // Verifica se já segue
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  if (existing) {
    // Deixa de seguir
    await supabase.from('follows').delete().eq('id', existing.id);
    return { following: false };
  } else {
    // Começa a seguir
    await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId });
    return { following: true };
  }
}

export async function checkFollowing(followerId: string, followingId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  return !!data;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function fetchNotifications(userId: string, limit = 20) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:profiles!actor_id(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }

  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Erro ao marcar notificação:', error);
    return false;
  }

  return true;
}

// ============================================
// MESSAGES
// ============================================

export async function fetchConversations(userId: string) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('conversation_participants')
    .select(`
      conversation:conversations(*),
      conversation:conversations(
        *,
        participants:conversation_participants(
          profiles(*)
        )
      )
    `)
    .eq('user_id', userId)
    .order('conversation(updated_at)', { ascending: false });

  if (error) {
    console.error('Erro ao buscar conversas:', error);
    return [];
  }

  return data || [];
}

export async function sendMessage(conversationId: string, senderId: string, content: string, type = 'text') {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content, type })
    .select()
    .single();

  if (error) {
    console.error('Erro ao enviar mensagem:', error);
    return null;
  }

  // Atualiza timestamp da conversa
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

// ============================================
// UPLOAD
// ============================================

export async function uploadFile(file: File, bucket: string, path: string) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
