import React from 'react';
import { Student, EvaluationModule } from '../types';

interface StudentTableProps {
  students: Student[];
  attendance: { [studentId: string]: 'present' | 'absent' };
  evaluations: { [studentId: string]: { [moduleId: string]: string } };
  evaluationModules: EvaluationModule[];
  onAttendanceChange: (studentId: string, status: 'present' | 'absent') => void;
  onEvaluationChange: (studentId: string, moduleId: string, value: string) => void;
}


export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  attendance,
  evaluations,
  evaluationModules,
  onAttendanceChange,
  onEvaluationChange,
}) => {
  if (students.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No hay estudiantes en esta sección. ¡Añade algunos para comenzar!</p>;
  }

  return (
    <>
      {/* Mobile View: Card List (hidden on md screens and up) */}
      <div className="md:hidden space-y-4">
        {students.map((student) => {
          const studentAttendance = attendance[student.id];
          const studentEvaluations = evaluations[student.id] || {};

          return (
            <div key={student.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{student.name}</h3>
              
              {/* Attendance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Asistencia</label>
                <div className="flex gap-2">
                   <button
                      onClick={() => onAttendanceChange(student.id, 'present')}
                      className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        studentAttendance === 'present'
                          ? 'bg-emerald-500 text-white shadow'
                          : 'bg-slate-200 dark:bg-slate-600 hover:bg-emerald-200 dark:hover:bg-emerald-700'
                      }`}
                    >
                      Presente
                    </button>
                    <button
                      onClick={() => onAttendanceChange(student.id, 'absent')}
                      className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                        studentAttendance === 'absent'
                          ? 'bg-red-500 text-white shadow'
                          : 'bg-slate-200 dark:bg-slate-600 hover:bg-red-200 dark:hover:bg-red-700'
                      }`}
                    >
                      Ausente
                    </button>
                </div>
              </div>

              {/* Evaluations */}
              {evaluationModules.map(module => (
                <div key={module.id} className="space-y-2">
                  <label htmlFor={`mobile-${student.id}-${module.id}`} className="block text-sm font-medium text-slate-600 dark:text-slate-400">{module.name}</label>
                  {module.type === 'select' ? (
                     <select
                      id={`mobile-${student.id}-${module.id}`}
                      value={studentEvaluations[module.id] || ''}
                      onChange={e => onEvaluationChange(student.id, module.id, e.target.value)}
                      className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                    >
                      <option value="">- Seleccionar -</option>
                      {module.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`mobile-${student.id}-${module.id}`}
                      type="text"
                      value={studentEvaluations[module.id] || ''}
                      onChange={e => onEvaluationChange(student.id, module.id, e.target.value)}
                      className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Desktop View: Table (visible on md screens and up) */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
            <tr>
              <th scope="col" className="p-3 sticky left-0 z-20 bg-slate-100 dark:bg-slate-700">Nombre del Estudiante</th>
              <th scope="col" className="p-3">Asistencia</th>
              {evaluationModules.map(module => (
                <th key={module.id} scope="col" className="p-3">{module.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const isEven = index % 2 === 0;
              const bgColor = isEven ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-800/50';
              const studentAttendance = attendance[student.id];
              const studentEvaluations = evaluations[student.id] || {};

              return (
                <tr key={student.id} className={`${bgColor} border-b border-slate-200 dark:border-slate-700`}>
                  <td className={`p-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap sticky left-0 z-10 ${bgColor}`}>
                    {student.name}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2">
                       <button
                        onClick={() => onAttendanceChange(student.id, 'present')}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                          studentAttendance === 'present'
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-600 hover:bg-emerald-200 dark:hover:bg-emerald-700'
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        onClick={() => onAttendanceChange(student.id, 'absent')}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                          studentAttendance === 'absent'
                            ? 'bg-red-500 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-600 hover:bg-red-200 dark:hover:bg-red-700'
                        }`}
                      >
                        Ausente
                      </button>
                    </div>
                  </td>
                  {evaluationModules.map(module => (
                    <td key={module.id} className="p-3 whitespace-nowrap min-w-[150px]">
                      {module.type === 'select' ? (
                        <select
                          value={studentEvaluations[module.id] || ''}
                          onChange={e => onEvaluationChange(student.id, module.id, e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm focus:ring-primary focus:border-primary"
                        >
                          <option value="">-</option>
                          {module.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={studentEvaluations[module.id] || ''}
                          onChange={e => onEvaluationChange(student.id, module.id, e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm focus:ring-primary focus:border-primary"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};