
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { initialSections, initialStudents } from './services/mockData';
import { Student, Section, Attendance, EvaluationModule, Evaluations } from './types';
import { Header } from './components/Header';
import { StudentTable } from './components/StudentTable';
import { EvaluationManager } from './components/EvaluationManager';
import { AddStudentManager } from './components/AddStudentManager';
import { AddSectionManager } from './components/AddSectionManager';
import { SaveIcon, PlusCircleIcon, CheckCircleIcon, UserPlusIcon, FolderPlusIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, UsersIcon, CalendarIcon } from './components/icons';
import { HomeScreen } from './components/HomeScreen';

// Helper function to get data from localStorage
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'main'>('home');

  // Initialize state from localStorage or use initial mock data
  const [allStudents, setAllStudents] = useState<Student[]>(() => getFromLocalStorage('allStudents', initialStudents));
  const [sections, setSections] = useState<Section[]>(() => getFromLocalStorage('sections', initialSections));
  const [attendance, setAttendance] = useState<Attendance>(() => getFromLocalStorage('attendance', {}));
  const [evaluations, setEvaluations] = useState<Evaluations>(() => getFromLocalStorage('evaluations', {}));
  const [evaluationModules, setEvaluationModules] = useState<EvaluationModule[]>(() => getFromLocalStorage('evaluationModules', [
    { id: 'mod1', name: 'Participación', type: 'select', options: ['Excelente', 'Bueno', 'Regular', 'Deficiente'] },
    { id: 'mod2', name: 'Comportamiento', type: 'select', options: ['Ejemplar', 'Satisfactorio', 'Necesita Mejorar'] },
    { id: 'mod3', name: 'Notas', type: 'text' },
  ]));

  const [selectedSectionId, setSelectedSectionId] = useState<string>(() => {
      const savedSections = getFromLocalStorage('sections', initialSections);
      return savedSections[0]?.id || '';
  });
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isEvalManagerOpen, setIsEvalManagerOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem('allStudents', JSON.stringify(allStudents));
      window.localStorage.setItem('sections', JSON.stringify(sections));
      window.localStorage.setItem('attendance', JSON.stringify(attendance));
      window.localStorage.setItem('evaluations', JSON.stringify(evaluations));
      window.localStorage.setItem('evaluationModules', JSON.stringify(evaluationModules));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [allStudents, sections, attendance, evaluations, evaluationModules]);


  const students = useMemo(() => {
    return allStudents.filter(s => s.sectionId === selectedSectionId).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSectionId, allStudents]);

  const handleAttendanceChange = useCallback((studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => {
      const newAttendance = { ...prev };
      if (!newAttendance[selectedDate]) {
        newAttendance[selectedDate] = {};
      }
      if (newAttendance[selectedDate][studentId] === status) {
        delete newAttendance[selectedDate][studentId];
      } else {
        newAttendance[selectedDate][studentId] = status;
      }
      return newAttendance;
    });
  }, [selectedDate]);

  const handleEvaluationChange = useCallback((studentId: string, moduleId: string, value: string) => {
    setEvaluations(prev => {
      const newEvaluations = { ...prev };
      if (!newEvaluations[selectedDate]) {
        newEvaluations[selectedDate] = {};
      }
      if (!newEvaluations[selectedDate][studentId]) {
        newEvaluations[selectedDate][studentId] = {};
      }
      newEvaluations[selectedDate][studentId][moduleId] = value;
      return newEvaluations;
    });
  }, [selectedDate]);

  const handleDateChange = useCallback((days: number) => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    // Create date in UTC to avoid timezone issues. Month is 0-indexed.
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + days);
    setSelectedDate(date.toISOString().slice(0, 10));
  }, [selectedDate]);

  const handleGoToToday = useCallback(() => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save data to Google Sheets
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      console.log("Simulating save to Google Sheets with current data:", {
        date: selectedDate,
        section: selectedSectionId,
        attendance: attendance[selectedDate] || {},
        evaluations: evaluations[selectedDate] || {},
        allStudents,
        sections,
      });
      setTimeout(() => setShowSaved(false), 2000);
    }, 1500);
  };

  const handleAddStudents = useCallback((newStudentNames: string[]) => {
    const newStudents: Student[] = newStudentNames.map(name => ({
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      sectionId: selectedSectionId,
    }));
    setAllStudents(prev => [...prev, ...newStudents]);
  }, [selectedSectionId]);

  const handleCreateSection = useCallback((sectionName: string, studentNames: string[]) => {
    const newSectionId = `sec-${Date.now()}`;
    const newSection: Section = { id: newSectionId, name: sectionName };

    const newStudents: Student[] = studentNames.map(name => ({
        id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        sectionId: newSectionId,
    }));

    setSections(prev => [...prev, newSection]);
    setAllStudents(prev => [...prev, ...newStudents]);
    setSelectedSectionId(newSectionId);
  }, []);

  const handleExportToCSV = useCallback(() => {
    const allDates = [...Object.keys(attendance), ...Object.keys(evaluations)].filter((v, i, a) => a.indexOf(v) === i).sort();
    if (allDates.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ['Fecha', 'Estudiante', 'Sección', 'Asistencia', ...evaluationModules.map(m => m.name)];
    
    let csvContent = headers.join(',') + '\n';

    allStudents.forEach(student => {
      allDates.forEach(date => {
        const attendanceRecord = attendance[date]?.[student.id];
        const evaluationRecord = evaluations[date]?.[student.id];

        if (attendanceRecord || evaluationRecord) {
          const sectionName = sections.find(s => s.id === student.sectionId)?.name || 'N/A';
          const attendanceStatus = attendanceRecord === 'present' ? 'Presente' : attendanceRecord === 'absent' ? 'Ausente' : 'N/A';
          
          const evaluationValues = evaluationModules.map(module => {
            const value = evaluationRecord?.[module.id] || '';
            // Escape commas in values by wrapping in quotes
            return `"${value.replace(/"/g, '""')}"`;
          });
          
          const row = [
            date,
            `"${student.name.replace(/"/g, '""')}"`,
            `"${sectionName.replace(/"/g, '""')}"`,
            attendanceStatus,
            ...evaluationValues
          ];

          csvContent += row.join(',') + '\n';
        }
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `reporte_asistencia_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [allStudents, sections, attendance, evaluations, evaluationModules]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Header 
        showHomeButton={currentView !== 'home'}
        onGoHome={() => setCurrentView('home')}
      />
      {currentView === 'home' ? (
        <HomeScreen onNavigate={() => setCurrentView('main')} />
      ) : (
        <>
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="section-select" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <UsersIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    <span>Grado / Sección</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="section-select"
                      value={selectedSectionId}
                      onChange={e => setSelectedSectionId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                    >
                      {sections.map(section => (
                        <option key={section.id} value={section.id}>{section.name}</option>
                      ))}
                    </select>
                    <button
                        onClick={() => setIsAddSectionModalOpen(true)}
                        className="flex-shrink-0 bg-secondary hover:bg-slate-700 text-white font-semibold p-2 rounded-lg shadow-md transition-colors duration-300"
                        title="Añadir nueva sección"
                    >
                        <FolderPlusIcon />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="date-select" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    <span>Fecha</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDateChange(-1)}
                      className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      title="Día Anterior"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <input
                      id="date-select"
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="flex-grow w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={() => handleDateChange(1)}
                      className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      title="Día Siguiente"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                      onClick={handleGoToToday}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap"
                    >
                      <CalendarIcon className="h-4 w-4"/>
                      Hoy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Lista de Estudiantes</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsAddStudentModalOpen(true)}
                        className="flex items-center gap-2 bg-secondary hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                    >
                        <UserPlusIcon />
                        <span className="hidden sm:inline">Añadir Estudiantes</span>
                    </button>
                    <button
                        onClick={() => setIsEvalManagerOpen(true)}
                        className="flex items-center gap-2 bg-secondary hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                    >
                        <PlusCircleIcon />
                        <span className="hidden sm:inline">Gestionar Evaluaciones</span>
                    </button>
                     <button
                        onClick={handleExportToCSV}
                        className="flex items-center gap-2 bg-accent hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                    >
                        <DownloadIcon />
                        <span className="hidden sm:inline">Generar Reporte</span>
                    </button>
                </div>
            </div>

            <StudentTable
              students={students}
              attendance={attendance[selectedDate] || {}}
              evaluations={evaluations[selectedDate] || {}}
              evaluationModules={evaluationModules}
              onAttendanceChange={handleAttendanceChange}
              onEvaluationChange={handleEvaluationChange}
            />
            
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving || showSaved}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto min-w-[150px] font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ${
                    isSaving 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : showSaved
                        ? 'bg-accent text-white'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : showSaved ? (
                        <>
                            <CheckCircleIcon />
                            ¡Guardado!
                        </>
                    ) : (
                        <>
                            <SaveIcon />
                            Guardar en Google Sheets
                        </>
                    )}
                </button>
            </div>
          </main>
          
          <EvaluationManager
            isOpen={isEvalManagerOpen}
            onClose={() => setIsEvalManagerOpen(false)}
            modules={evaluationModules}
            setModules={setEvaluationModules}
          />

          <AddStudentManager
            isOpen={isAddStudentModalOpen}
            onClose={() => setIsAddStudentModalOpen(false)}
            onAddStudents={handleAddStudents}
          />

          <AddSectionManager
            isOpen={isAddSectionModalOpen}
            onClose={() => setIsAddSectionModalOpen(false)}
            onCreateSection={handleCreateSection}
          />
        </>
      )}
    </div>
  );
};

export default App;
