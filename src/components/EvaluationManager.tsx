import React, { useState } from 'react';
import { EvaluationModule } from '../types';
import { generateEvaluationModule } from '../services/geminiService';
import { PlusIcon, TrashIcon, WandIcon, XIcon } from './icons';

interface EvaluationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  modules: EvaluationModule[];
  setModules: React.Dispatch<React.SetStateAction<EvaluationModule[]>>;
}

export const EvaluationManager: React.FC<EvaluationManagerProps> = ({ isOpen, onClose, modules, setModules }) => {
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleType, setNewModuleType] = useState<'text' | 'select'>('select');
  const [newModuleOptions, setNewModuleOptions] = useState('');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  if (!isOpen) return null;

  const handleAddModule = () => {
    if (!newModuleName.trim()) return;
    const newModule: EvaluationModule = {
      id: `mod-${Date.now()}`,
      name: newModuleName.trim(),
      type: newModuleType,
      ...(newModuleType === 'select' && { options: newModuleOptions.split(',').map(s => s.trim()).filter(Boolean) }),
    };
    setModules(prev => [...prev, newModule]);
    setNewModuleName('');
    setNewModuleType('select');
    setNewModuleOptions('');
  };
  
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');
    try {
      const generatedModule = await generateEvaluationModule(aiPrompt);
      if (generatedModule) {
        setModules(prev => [...prev, { ...generatedModule, id: `mod-${Date.now()}` }]);
        setAiPrompt('');
      } else {
        throw new Error("AI did not return a valid module.");
      }
    } catch (error) {
      console.error("Error generating module with AI:", error);
      setAiError("Error al generar el módulo. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl font-bold">Gestionar Módulos de Evaluación</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><XIcon /></button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* AI Generation Section */}
          <div className="space-y-3 p-4 border border-primary-light rounded-lg bg-sky-50 dark:bg-slate-900/20">
            <h3 className="font-semibold flex items-center gap-2 text-primary-dark dark:text-primary-light"><WandIcon /> Crear con IA</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Describe la evaluación que quieres crear. Por ejemplo: "Seguimiento de tareas diarias con opciones como 'Completa', 'Incompleta' o 'No entregada'".</p>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe tu módulo de evaluación..."
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
              rows={2}
            />
            {aiError && <p className="text-sm text-red-500">{aiError}</p>}
            <button onClick={handleGenerateWithAI} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto disabled:bg-slate-400">
              {isGenerating ? 'Generando...' : 'Generar'}
            </button>
          </div>

          {/* Manual Creation Section */}
          <div className="space-y-3 p-4 border border-slate-300 dark:border-slate-700 rounded-lg">
            <h3 className="font-semibold">Crear Manualmente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre del Módulo" value={newModuleName} onChange={e => setNewModuleName(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
              <select value={newModuleType} onChange={e => setNewModuleType(e.target.value as any)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                <option value="select">Selección</option>
                <option value="text">Texto</option>
              </select>
            </div>
            {newModuleType === 'select' && (
              <input type="text" placeholder="Opciones (separadas por comas)" value={newModuleOptions} onChange={e => setNewModuleOptions(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
            )}
            <button onClick={handleAddModule} className="flex items-center gap-2 bg-secondary hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg"><PlusIcon /> Añadir Módulo</button>
          </div>

          {/* Current Modules List */}
          <div>
            <h3 className="font-semibold mb-2">Módulos Actuales</h3>
            <ul className="space-y-2">
              {modules.map(module => (
                <li key={module.id} className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                  <div>
                    <span className="font-medium">{module.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 capitalize bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">{module.type === 'select' ? 'Selección' : 'Texto'}</span>
                  </div>
                  <button onClick={() => handleDeleteModule(module.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
