import { Program } from '../../types';
import { Clock, Users, Monitor, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const formatIcon = {
    online: <Monitor size={16} />,
    offline: <MapPin size={16} />,
    mixed: <Users size={16} />,
  };

  const formatLabel = {
    online: 'Онлайн',
    offline: 'Офлайн',
    mixed: 'Змішаний',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full overflow-hidden group">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={clsx(
            "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide",
            program.format === 'online' ? "bg-green-100 text-green-700" :
            program.format === 'offline' ? "bg-blue-100 text-blue-700" :
            "bg-purple-100 text-purple-700"
          )}>
            {formatLabel[program.format]}
          </span>
          {program.credits && (
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
              <Award size={14} /> {program.credits} ЄКТС
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-dnu-blue transition-colors">
          {program.title}
        </h3>

        <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">
          {program.description}
        </p>

        <div className="space-y-2 text-sm text-slate-500 mb-6">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-dnu-gold" />
            <span>{program.duration}</span>
          </div>
          {program.targetAudience && (
            <div className="flex items-start gap-2">
              <Users size={16} className="text-dnu-gold mt-0.5 shrink-0" />
              <span className="line-clamp-1">{program.targetAudience}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="font-bold text-slate-900">{program.price}</span>
          <Link 
            to={`/program/${program.id}`} 
            className="bg-dnu-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </div>
  );
}
