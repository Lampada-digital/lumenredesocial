import React, { useState } from 'react';
import { courses } from '../data/mockData';
import {
  BookOpen, Clock, Users, Award, Play, Search,
  Star, ChevronRight, GraduationCap, Filter
} from 'lucide-react';

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
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-100 text-surface-700';
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Formação</h1>
          <p className="text-surface-500 text-sm mt-1">Cursos e conteúdos para aprofundar sua fé</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            <Award size={16} />
            Meus certificados
          </button>
        </div>
      </div>

      {/* My Progress */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Seu progresso</h2>
            <p className="text-primary-200 text-sm mt-1">Continue aprendendo e crescendo na fé</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">3</p>
            <p className="text-primary-200 text-sm">cursos em andamento</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-primary-200">Aulas concluídas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">8h</p>
            <p className="text-xs text-primary-200">Tempo de estudo</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">1</p>
            <p className="text-xs text-primary-200">Certificado</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedLevel === level.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-40">
              <img src={course.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play size={20} className="text-primary-600 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{course.category}</span>
              </div>
              <h3 className="font-semibold text-surface-800 group-hover:text-primary-700 transition-colors">{course.title}</h3>
              <p className="text-xs text-surface-500 mt-1 line-clamp-2">{course.description}</p>

              <div className="flex items-center gap-3 mt-3 text-xs text-surface-500">
                <span className="flex items-center gap-1"><BookOpen size={12} /> {course.modules} módulos</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {course.enrolled.toLocaleString()}</span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
                <img src={course.instructor.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs text-surface-600">{course.instructor.name}</span>
              </div>

              {/* Progress */}
              {course.progress > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-surface-500">Progresso</span>
                    <span className="font-medium text-primary-600">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                course.progress > 0
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}>
                {course.progress > 0 ? 'Continuar curso' : 'Iniciar curso'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap size={48} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500">Nenhum curso encontrado</p>
        </div>
      )}
    </div>
  );
}
