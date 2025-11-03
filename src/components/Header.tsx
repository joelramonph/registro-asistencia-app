import React from 'react';
import { BookOpenIcon, HomeIcon } from './icons';

interface HeaderProps {
    showHomeButton?: boolean;
    onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showHomeButton, onGoHome }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <BookOpenIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Registro de Asistencia Estudiantil
            </h1>
        </div>
        {showHomeButton && (
            <button
                onClick={onGoHome}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                title="Ir a Inicio"
            >
                <HomeIcon className="h-5 w-5" />
                <span className="hidden sm:inline font-semibold">Inicio</span>
            </button>
        )}
      </div>
    </header>
  );
};
