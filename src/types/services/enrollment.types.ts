import { Table } from '..';
import { IAcademicYearInfo } from './academicyears.types';
import { InstructorProgram } from './instructor.types';
import { AcademicProgramLevel } from './program.types';
/* eslint-disable no-unused-vars */
export enum EnrollmentStatus {
  PENDING,
  NEW,
  RETAKE = 'RETAKE',
  DISMISSED = 'DISMISSED',
}

export enum EnrollmentMode {
  NEW = 'NEW',
  RECURRING = 'RECURRING',
}

export interface EnrollInstructorProgram {
  instructor_id: string;
  intake_program_id: string;
}

export interface EnrollInstructorLevel {
  academicProgramLevelId: string;
  academicYearId: string;
  intakeProgramInstructorId: number;
}

export interface EnrollStudents {
  academic_year_id: string;
  intake_program_student_id: number;
  program_level_id: string;
}

export interface EnrollStudentToProgram {
  completed_on: string;
  employee_number: string;
  enroled_on: string;
  enrolment_mode: EnrollmentMode;
  enrolment_status: EnrollmentStatus;
  intake_program_id: string;
  other_rank: string;
  rank_id: string;
  rank_institution: string;
  student_id: string;
  third_party_reg_number: string;
}

export interface EnrollInstructorLevelInfo extends Table {
  intake_program_instructor: InstructorProgram;
  academic_program_level: AcademicProgramLevel;
  academic_year: IAcademicYearInfo;
}