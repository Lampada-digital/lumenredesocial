import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { fetchCourses, enrollInCourse } from '../lib/database';
import { BookOpen, Clock, Users, Search, GraduationCap, Plus, X } from 'lucide-react';

export default function FormationPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Bíblia',
    modules_count: 1,
    lessons_count: 1,
    duration: '1 hora',
    level: 'beginner',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    if (isSupabaseConfigured) {
      const data = await fetchCourses(50);
      setCourses(data);
    } else {
      const data = localDb.getCourses();
      setCourses(data);
    }
    setLoading(false);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;

    if (isSupabaseConfigured) {
      await enrollInCourse(courseId, user.id);
    } else {
      localDb.enrollInCourse(courseId, user.id);
      const data = localDb.getCourses();
      setCourses(data);
    }
  };

  const handleCreateCourse = async () => {
    if (!user || !newCourse.title.trim() || !newCourse.description.trim()) return;

    if (isSupabaseConfigured) {
      // TODO: Implementar criação via Supabase
      console.log('Criar curso via Supabase');
    } else {
      // Modo local
      const course = localDb.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        modules_count: newCourse.modules_count,
        lessons_count: newCourse.lessons_count,
        duration: newCourse.duration,
        level: newCourse.level,
        instructor_id: user.id,
      });
      setCourses([course, ...courses]);
    }

    setNewCourse({
      title: '',
      description: '',
      category: 'Bíblia',
      modules_count: 1,
      lessons_count: 1,
      duration: '1 hora',
      level: 'beginner',
    });
    setShowCreateModal(false);
    loadCourses();
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white rounded-xl text-xs font-semibold hover:bg-surface-800 transition-colors shadow-sm"
        >
          <Plus size={14} />
          Criar curso
        </button>
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

      {/* Modal de Criar Curso */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-surface-900">Criar Curso</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Ex: Introdução à Sagrada Escritura"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Descrição *
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Descreva o conteúdo do curso..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Categoria
                </label>
                <select
                  value={newCourse.category}
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                >
                  <option value="Bíblia">Bíblia</option>
                  <option value="Doutrina">Doutrina</option>
                  <option value="Liturgia">Liturgia</option>
                  <option value="História da Igreja">História da Igreja</option>
                  <option value="Comunicação">Comunicação</option>
                  <option value="Formação pastoral">Formação pastoral</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Módulos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.modules_count}
                    onChange={e => setNewCourse({ ...newCourse, modules_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Aulas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.lessons_count}
                    onChange={e => setNewCourse({ ...newCourse, lessons_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                    placeholder="Ex: 20 horas"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Nível
                  </label>
                  <select
                    value={newCourse.level}
                    onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-surface-100 text-surface-700 rounded-xl text-sm font-semibold hover:bg-surface-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={!newCourse.title.trim() || !newCourse.description.trim()}
                  className="flex-1 px-4 py-3 bg-surface-900 text-white rounded-xl text-sm font-semibold hover:bg-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
