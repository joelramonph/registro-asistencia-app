
import React from 'react';
import { CalendarCheckIcon, StarIcon, CogIcon } from './icons';

interface HomeScreenProps {
  onNavigate: (view: 'main') => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ title, description, icon, onClick, disabled }) => {
  const cardClasses = `
    group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg
    transition-all duration-300 transform 
    ${disabled 
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:bg-sky-50 dark:hover:bg-slate-700'
    }
  `;

  return (
    <div onClick={!disabled ? onClick : undefined} className={cardClasses}>
      <div className="flex items-center justify-center w-12 h-12 bg-primary-light/20 dark:bg-primary-dark/30 rounded-lg mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Gestor Académico</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Selecciona una herramienta para comenzar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="Registro de Asistencia"
          description="Toma lista diaria de forma rápida, visualiza el historial y gestiona las ausencias de tus estudiantes."
          icon={<CalendarCheckIcon className="w-6 h-6" />}
          onClick={() => onNavigate('main')}
        />
        <FeatureCard
          title="Evaluaciones Cualitativas"
          description="Registra participación, comportamiento y otras notas personalizadas en la misma interfaz."
          icon={<StarIcon className="w-6 h-6" />}
          onClick={() => onNavigate('main')}
        />
        <FeatureCard
          title="Próximamente"
          description="Nuevas herramientas y módulos para facilitar tu trabajo, como reportes y comunicación con padres."
          icon={<CogIcon className="w-6 h-6" />}
          disabled
        />
      </div>
    </main>
  );
};
