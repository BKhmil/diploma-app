import React from 'react';
import { Calendar, Clock, Users, Award, ExternalLink } from 'lucide-react';
import { Program, formatDuration, formatPrice } from '../../types';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const formatLabels = {
    online: 'Онлайн',
    offline: 'Офлайн',
    mixed: 'Змішаний'
  };

  const formatColors = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-blue-100 text-blue-800 border-blue-200',
    mixed: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
      {/* Top Banner Context */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center text-xs font-semibold">
        <span className={clsx('px-2.5 py-1 rounded-md border', formatColors[program.format])}>
          {formatLabels[program.format]}
        </span>
        <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Набір відкрито
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0056b3] transition-colors">
          {program.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
          {program.description}
        </p>

        {/* Info List */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-start bg-gray-50 p-2.5 rounded-lg text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-2.5 text-[#0056b3] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Тривалість</span>
              <span className="font-semibold">{formatDuration(program.duration, program.duration_unit)}</span>
              {program.credits && <span className="text-gray-500 font-normal ml-1">({program.credits} кредитів ЄКТС)</span>}
            </div>
          </div>

          <div className="flex items-start bg-gray-50 p-2.5 rounded-lg text-sm text-gray-700">
            <Users className="w-4 h-4 mr-2.5 text-[#0056b3] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Аудиторія</span>
              <span className="font-medium line-clamp-1">{program.targetAudience || 'Для всіх бажаючих'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex flex-col gap-3">
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Сума</span>
            <span className="font-bold text-lg text-[#003366] leading-none">
              {formatPrice(program.price)}
            </span>
          </div>

          <Link
            to={`/programs/${program.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0056b3] text-white text-sm font-bold rounded-xl hover:bg-[#003366] hover:shadow-lg transition-all"
          >
            Детальніше
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
