import { Link } from 'react-router-dom';
import { LATEST_NEWS } from '../../data/mockData';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function NewsPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-dnu-blue">Новини та оголошення</h2>
          <Link to="/news" className="text-dnu-blue font-semibold hover:text-dnu-gold transition-colors flex items-center gap-2">
            Всі новини <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LATEST_NEWS.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-dnu-blue uppercase tracking-wider">
                  {news.category === 'announcement' ? 'Оголошення' : 'Новина'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-3">
                  <Calendar size={14} />
                  <time dateTime={news.date}>{new Date(news.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-dnu-blue transition-colors line-clamp-2">
                  <Link to={`/news/${news.id}`}>
                    {news.title}
                  </Link>
                </h3>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {news.summary}
                </p>
                
                <Link 
                  to={`/news/${news.id}`} 
                  className="inline-flex items-center text-dnu-blue font-semibold text-sm hover:text-dnu-gold transition-colors mt-auto"
                >
                  Читати далі <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
