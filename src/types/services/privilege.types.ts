/* eslint-disable no-unused-vars */
export enum PrivilegeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PrivilegeFeatureType {
  ADMIN = 'ADMIN',
  EVALUATION = 'EVALUATION',
  REPORTING = 'REPORTING',
  INTERACTIVE_LEARNING = 'INTERACTIVE_LEARNING',
}

export interface PrivilegeUpdate {
  id: string;
  name: string;
  status: PrivilegeStatus;
  description: string;
  feature_type: PrivilegeFeatureType;
}

export interface PrivilegeRes extends PrivilegeUpdate {}

export enum Privileges {
  CAN_ACCESS_EVALUATIONS = 'CAN_ACCESS_EVALUATIONS',
  CAN_CREATE_EVALUATION = 'CAN_CREATE_EVALUATION',
  CAN_MODIFY_EVALUATION = 'CAN_MODIFY_EVALUATION',
  CAN_DELETE_EVALUATION = 'CAN_DELETE_EVALUATION',
  CAN_ACCESS_USERS = 'CAN_ACCESS_USERS',
  CAN_CREATE_USER = 'CAN_CREATE_USER',
  CAN_MODIFY_USER = 'CAN_MODIFY_USER',
  CAN_DELETE_USER = 'CAN_DELETE_USER',
  CAN_MODIFY_INTAKE = 'CAN_MODIFY_INTAKE',
  CAN_ACCESS_PROGRAMS_IN_INTAKE = 'CAN_ACCESS_PROGRAMS_IN_INTAKE',
  CAN_CREATE_RANK = 'CAN_CREATE_RANK',
  CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
  CAN_ACCESS_RANKS = 'CAN_ACCESS_RANKS',
  CAN_EDIT_RANK = 'CAN_EDIT_RANK',
  CAN_MODIFY_ROLE = 'CAN_MODIFY_ROLE',
  CAN_ACCESS_ROLE = 'CAN_ACCESS_ROLE',
  CAN_CREATE_ACADEMY = 'CAN_CREATE_ACADEMY',
  CAN_MODIFY_ACADEMY = 'CAN_MODIFY_ACADEMY',
  CAN_DELETE_ACADEMY = 'CAN_DELETE_ACADEMY',
  CAN_ACCESS_ACADEMY = 'CAN_ACCESS_ACADEMY',
  CAN_ASSIGN_ACADEMY_INCHARGE = 'CAN_ASSIGN_ACADEMY_INCHARGE',
  CAN_ASSIGN_ROLE = 'CAN_ASSIGN_ROLE',
  CAN_ACCESS_PROFILE = 'CAN_ACCESS_PROFILE',
  CAN_MODIFY_INSTITUTION = 'CAN_MODIFY_INSTITUTION',
  CAN_CREATE_LEVEL = 'CAN_CREATE_LEVEL',
  CAN_ACCESS_LEVELS = 'CAN_ACCESS_LEVELS',
  CAN_MODIFY_LEVEL = 'CAN_MODIFY_LEVEL',
  CAN_DELETE_LEVEL = 'CAN_DELETE_LEVEL',
  CAN_ACCESS_ACADEMIC_YEARS = 'CAN_ACCESS_ACADEMIC_YEARS',
  CAN_CREATE_ACADEMIC_YEAR = 'CAN_CREATE_ACADEMIC_YEAR',
  CAN_MODIFY_ACADEMIC_YEAR = 'CAN_MODIFY_ACADEMIC_YEAR',
  CAN_DELETE_ACADEMIC_YEAR = 'CAN_DELETE_ACADEMIC_YEAR',
  CAN_ACCESS_ACADEMIC_YEAR = 'CAN_ACCESS_ACADEMIC_YEAR',
  CAN_ACCESS_DIVISIONS = 'CAN_ACCESS_DIVISIONS',
  CAN_CREATE_DIVISION = 'CAN_CREATE_DIVISION',
  CAN_MODIFY_DIVISION = 'CAN_MODIFY_DIVISION',
  CAN_DELETE_DIVISION = 'CAN_DELETE_DIVISION',
  CAN_ACCESS_PROGRAMS = 'CAN_ACCESS_PROGRAMS',
  CAN_CREATE_PROGRAM = 'CAN_CREATE_PROGRAM',
  CAN_MODIFY_PROGRAM = 'CAN_MODIFY_PROGRAM',
  CAN_DELETE_PROGRAM = 'CAN_DELETE_PROGRAM',
  CAN_ACCESS_PROGRAM_LEVELS = 'CAN_ACCESS_PROGRAM_LEVELS',
  CAN_CREATE_PROGRAM_LEVELS = 'CAN_CREATE_PROGRAM_LEVELS',
  CAN_MODIFY_PROGRAM_LEVELS = 'CAN_MODIFY_PROGRAM_LEVELS',
  CAN_DELETE_PROGRAM_LEVELS = 'CAN_DELETE_PROGRAM_LEVELS',
}
