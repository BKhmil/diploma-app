import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section className="relative bg-dnu-blue text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="DNU Campus" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dnu-blue via-dnu-blue/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Навчання протягом <span className="text-dnu-gold">усього життя</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
              Центр неперервної освіти ДНУ ім. О. Гончара — це ваш шлях до професійного зростання, нових знань та кар'єрних можливостей.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/apply" 
                className="bg-dnu-gold text-dnu-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group"
              >
                Подати заявку
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/qualification" 
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                Обрати програму
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
