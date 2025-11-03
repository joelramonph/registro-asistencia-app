export interface Student {
  id: string;
  name: string;
  sectionId: string;
}

export interface Section {
  id: string;
  name:string;
}

export interface Attendance {
  [date: string]: {
    [studentId: string]: 'present' | 'absent';
  };
}

export interface EvaluationModule {
  id: string;
  name: string;
  type: 'text' | 'select';
  options?: string[];
}

export interface Evaluations {
    [date: string]: {
        [studentId: string]: {
            [moduleId: string]: string;
        };
    };
}
