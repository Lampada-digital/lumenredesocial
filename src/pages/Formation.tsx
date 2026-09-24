import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchCourses, enrollInCourse } from '../lib/database';
import { isSupabaseConfigured } from '../lib/supabase';
import { BookOpen, Clock, Users, Search, GraduationCap } from 'lucide-react';

export default function FormationPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const data = await fetchCourses(50);
    setCourses(data);
    setLoading(false);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    await enrollInCourse(courseId, user.id);
  };

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-8 text-center">
          <div className="w-8 h-8 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500 mt-3">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Formação</h1>
          <p className="text-surface-500 text-sm mt-1.5">Cursos e conteúdos para aprofundar sua fé</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar cursos..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200/80 rounded-xl text-sm focus:outline-none focus:border-surface-300 focus:shadow-sm transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
          <GraduationCap size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhum curso encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group">
              <div className="relative h-44 bg-gradient-to-br from-primary-600 to-primary-800">
                {course.image_url && <img src={course.image_url} alt="" className="w-full h-full object-cover" />}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">{course.category}</span>
                </div>
                <h3 className="font-semibold text-surface-900 group-hover:text-primary-700 transition-colors text-[15px]">{course.title}</h3>
                <p className="text-xs text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-surface-500">
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {course.modules_count} módulos</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {course.enrolled_count}</span>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-900 text-white hover:bg-surface-800 transition-colors"
                >
                  Inscrever-se
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
