import React, { useState } from 'react';
import { courses } from '../data/mockData';
import { BookOpen, Clock, Users, Award, Play, Search, GraduationCap } from 'lucide-react';

const categories = ['Todos', 'Bíblia', 'Doutrina', 'Liturgia', 'História da Igreja', 'Comunicação', 'Formação pastoral'];
const levels = [
  { id: 'all', label: 'Todos' },
  { id: 'beginner', label: 'Iniciante' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
];

export default function FormationPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filtered = courses.filter(c => {
    const matchesCategory = selectedCategory === 'Todos' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-surface-50 text-surface-700 border-surface-200';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Formação</h1>
          <p className="text-surface-500 text-sm mt-1.5">Cursos e conteúdos para aprofundar sua fé</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-50 transition-colors">
          <Award size={14} />
          Meus certificados
        </button>
      </div>

      {/* My Progress */}
      <div className="bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-semibold text-lg">Seu progresso</h2>
            <p className="text-white/50 text-sm mt-1">Continue aprendendo e crescendo na fé</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">3</p>
            <p className="text-white/50 text-xs">cursos em andamento</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10 relative z-10">
          <div className="text-center">
            <p className="text-xl font-bold">12</p>
            <p className="text-[11px] text-white/50 mt-0.5">Aulas concluídas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">8h</p>
            <p className="text-[11px] text-white/50 mt-0.5">Tempo de estudo</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">1</p>
            <p className="text-[11px] text-white/50 mt-0.5">Certificado</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200/80 rounded-xl text-sm focus:outline-none focus:border-surface-300 focus:shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedLevel === level.id
                  ? 'bg-surface-900 text-white'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200/80'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-surface-900 text-white'
                : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group">
            {/* Image */}
            <div className="relative h-44">
              <img src={course.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border uppercase tracking-wide ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-xl">
                  <Play size={18} className="text-surface-900 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">{course.category}</span>
              </div>
              <h3 className="font-semibold text-surface-900 group-hover:text-primary-700 transition-colors text-[15px]">{course.title}</h3>
              <p className="text-xs text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-3 mt-3 text-[11px] text-surface-500">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {course.modules} módulos</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} /> {course.enrolled.toLocaleString()}</span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
                <img src={course.instructor.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs text-surface-600 font-medium">{course.instructor.name}</span>
              </div>

              {/* Progress */}
              {course.progress > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-surface-500 font-medium">Progresso</span>
                    <span className="font-semibold text-surface-900">{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-surface-900 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button className={`w-full mt-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                course.progress > 0
                  ? 'bg-surface-900 text-white hover:bg-surface-800'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}>
                {course.progress > 0 ? 'Continuar curso' : 'Iniciar curso'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhum curso encontrado</p>
        </div>
      )}
    </div>
  );
}
