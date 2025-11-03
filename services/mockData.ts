
import { Student, Section } from '../types';

export const initialSections: Section[] = [
  { id: 'sec1', name: 'Grade 5 - Section A' },
  { id: 'sec2', name: 'Grade 5 - Section B' },
  { id: 'sec3', name: 'Grade 6 - Section A' },
];

export const initialStudents: Student[] = [
  // Grade 5 - Section A
  { id: 's1', name: 'Liam Smith', sectionId: 'sec1' },
  { id: 's2', name: 'Olivia Johnson', sectionId: 'sec1' },
  { id: 's3', name: 'Noah Williams', sectionId: 'sec1' },
  { id: 's4', name: 'Emma Brown', sectionId: 'sec1' },
  { id: 's5', name: 'Oliver Jones', sectionId: 'sec1' },
  { id: 's6', name: 'Ava Garcia', sectionId: 'sec1' },
  { id: 's7', name: 'Elijah Miller', sectionId: 'sec1' },
  { id: 's8', name: 'Charlotte Davis', sectionId: 'sec1' },
  { id: 's9', name: 'William Rodriguez', sectionId: 'sec1' },
  { id: 's10', name: 'Sophia Martinez', sectionId: 'sec1' },

  // Grade 5 - Section B
  { id: 's11', name: 'James Hernandez', sectionId: 'sec2' },
  { id: 's12', name: 'Isabella Lopez', sectionId: 'sec2' },
  { id: 's13', name: 'Benjamin Gonzalez', sectionId: 'sec2' },
  { id: 's14', name: 'Mia Wilson', sectionId: 'sec2' },
  { id: 's15', name: 'Lucas Anderson', sectionId: 'sec2' },
  { id: 's16', name: 'Harper Thomas', sectionId: 'sec2' },
  { id: 's17', name: 'Henry Taylor', sectionId: 'sec2' },
  { id: 's18', name: 'Evelyn Moore', sectionId: 'sec2' },

  // Grade 6 - Section A
  { id: 's19', name: 'Alexander Jackson', sectionId: 'sec3' },
  { id: 's20', name: 'Abigail Martin', sectionId: 'sec3' },
  { id: 's21', name: 'Michael Lee', sectionId: 'sec3' },
  { id: 's22', name: 'Emily Perez', sectionId: 'sec3' },
  { id: 's23', name: 'Daniel Thompson', sectionId: 'sec3' },
  { id: 's24', name: 'Ella White', sectionId: 'sec3' },
  { id: 's25', name: 'Matthew Harris', sectionId: 'sec3' },
  { id: 's26', name: 'Scarlett Clark', sectionId: 'sec3' },
  { id: 's27', name: 'Joseph Lewis', sectionId: 'sec3' },
  { id: 's28', name: 'Victoria Robinson', sectionId: 'sec3' },
];
