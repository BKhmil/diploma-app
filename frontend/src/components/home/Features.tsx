import { Link } from 'react-router-dom';
import { BookOpen, RefreshCw, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { KEY_DIRECTIONS } from '../../data/mockData';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

// Map string icon names to components
const iconMap = {
  BookOpen,
  RefreshCw,
  GraduationCap,
  Briefcase
};

export function Features() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-dnu-blue mb-4">Напрями діяльності</h2>
          <p className="text-slate-600">
            Ми пропонуємо широкий спектр освітніх послуг для різних категорій слухачів: від школярів до досвідчених фахівців.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {KEY_DIRECTIONS.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col h-full group"
              >
                <div className={clsx("w-14 h-14 rounded-xl flex items-center justify-center mb-6", item.color)}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-dnu-blue transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">
                  {item.description}
                </p>
                
                <Link 
                  to={item.link} 
                  className="inline-flex items-center text-dnu-blue font-semibold text-sm hover:text-dnu-gold transition-colors gap-1 group-hover:gap-2"
                >
                  Детальніше <ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
