
import React, { useState, useMemo } from 'react';
import { PlusIcon, TrashIcon, XIcon, EditIcon, FileTextIcon } from './icons';

interface AddSectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSection: (sectionName: string, studentNames: string[]) => void;
}

type Mode = 'manual' | 'import';

export const AddSectionManager: React.FC<AddSectionManagerProps> = ({ isOpen, onClose, onCreateSection }) => {
  const [sectionName, setSectionName] = useState('');
  const [mode, setMode] = useState<Mode>('manual');
  
  // Student states
  const [manualName, setManualName] = useState('');
  const [stagedStudents, setStagedStudents] = useState<string[]>([]);
  const [importText, setImportText] = useState('');

  const studentsFromImport = useMemo(() => {
    return importText.split('\n').map(name => name.trim()).filter(Boolean);
  }, [importText]);

  if (!isOpen) return null;

  const handleStageStudent = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (manualName.trim()) {
      setStagedStudents(prev => [...prev, manualName.trim()]);
      setManualName('');
    }
  };

  const handleRemoveStaged = (index: number) => {
    setStagedStudents(prev => prev.filter((_, i) => i !== index));
  };

  const studentsToAdd = mode === 'manual' ? stagedStudents : studentsFromImport;
  const canCreate = sectionName.trim() !== '' && studentsToAdd.length > 0;

  const handleCreateAndClose = () => {
    if (!canCreate) return;
    onCreateSection(sectionName.trim(), studentsToAdd);
    handleClose();
  };

  const handleClose = () => {
    setSectionName('');
    setManualName('');
    setStagedStudents([]);
    setImportText('');
    setMode('manual');
    onClose();
  }

  const TabButton: React.FC<{ currentMode: Mode, targetMode: Mode, children: React.ReactNode, icon: React.ReactNode }> = ({ currentMode, targetMode, children, icon }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        currentMode === targetMode 
          ? 'bg-white dark:bg-slate-700 border-b-2 border-primary text-primary'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Crear Nueva Sección</h2>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><XIcon /></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="section-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de la Sección</label>
            <input
              id="section-name"
              type="text"
              placeholder="p. ej., Grado 7 - Sección C"
              value={sectionName}
              onChange={e => setSectionName(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
            />
          </div>

          <div className="pt-2">
            <h3 className="font-semibold mb-2">Añadir Estudiantes a la Sección</h3>
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex -mb-px">
                <TabButton currentMode={mode} targetMode="manual" icon={<EditIcon className="w-4 h-4 mr-2" />}>Añadir Manualmente</TabButton>
                <TabButton currentMode={mode} targetMode="import" icon={<FileTextIcon className="w-4 h-4 mr-2" />}>Importar de Hoja de Cálculo</TabButton>
              </nav>
            </div>
            <div className="pt-4">
              {mode === 'manual' && (
                <div>
                  <form onSubmit={handleStageStudent} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Nombre completo del estudiante"
                      value={manualName}
                      onChange={e => setManualName(e.target.value)}
                      className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" 
                    />
                    <button type="submit" className="flex items-center gap-2 bg-secondary hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg"><PlusIcon /></button>
                  </form>
                  <h3 className="font-semibold mb-2 text-sm text-slate-600 dark:text-slate-400">Estudiantes a añadir:</h3>
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {stagedStudents.length === 0 && <p className="text-slate-500 text-sm italic">Aún no se han añadido estudiantes.</p>}
                    {stagedStudents.map((name, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                        <span className="font-medium text-sm">{name}</span>
                        <button onClick={() => handleRemoveStaged(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mode === 'import' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Para importar desde Google Sheets o Excel, copia la columna con los nombres de los estudiantes y pégala aquí. Cada nombre debe estar en una nueva línea.
                  </p>
                  <textarea
                    id="import-textarea"
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    placeholder="Liam Smith&#10;Olivia Johnson&#10;Noah Williams..."
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 font-mono text-sm"
                    rows={8}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button onClick={handleClose} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg">
              Cancelar
            </button>
            <button 
              onClick={handleCreateAndClose}
              disabled={!canCreate}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Crear Sección y Añadir {studentsToAdd.length} Estudiante{studentsToAdd.length !== 1 ? 's' : ''}
            </button>
        </div>
      </div>
    </div>
  );
};
