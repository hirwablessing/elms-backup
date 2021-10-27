/* eslint-disable no-unused-vars */
export enum IEvaluationTypeEnum {
  EXAM = 'EXAM',
  CAT = 'CAT',
  GROUP_WORK = 'GROUP_WORK',
  QUIZ = 'QUIZ',
}

export enum IQuestionaireTypeEnum {
  MULTIPLE = 'MULTIPLE',
  FIELD = 'FIELD',
  OPEN = 'OPEN',
  HYBRID = 'HYBRID',
}

export interface IEvaluationProps {
  handleNext: () => void;
  handleGoBack: () => void;
  handleAddQuestion?: () => void;
}

export enum ISubmissionTypeEnum {
  FILE = 'FILE',
  ONLINE_TEXT = 'ONLINE_TEXT',
}

export enum IEvaluationClassification {
  MODULAR = 'MODULAR',
  SUBJECT = 'SUBJECT',
}

export enum IEligibleClassEnum {
  MULTIPLE_CLASSES = 'MULTIPLE_CLASSES',
  SINGLE_CLASS = 'SINGLE_CLASS',
}

export enum IAccessTypeEnum {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum IContentFormatEnum {
  MP4 = 'MP4',
  PNG = 'PNG',
  DOC = 'DOC',
  PDF = 'PDF',
}

export enum IEvaluationStatus {
  PENDING = 'PENDING',
  ON_GOING = 'ON_GOING',
  UNMARKED = 'UNMARKED',
  MARKING = 'MARKING',
  MARKED = 'MARKED',
  CANCELED = 'CANCELED',
}

export enum IEligibleGroup {
  MULTIPLE_CLASSES = 'MULTIPLE_CLASSES',
  SINGLE_CLASS = 'SINGLE_CLASS',
}

export interface IEvaluationCreate {
  access_type: string;
  allow_submission_time: string;
  class_ids: string;
  subject_academic_year_period_id: number;
  classification: IEvaluationClassification;
  content_format: string;
  due_on: string | null;
  eligible_group: string;
  evaluation_status: IEvaluationStatus;
  evaluation_type: IEvaluationTypeEnum;
  exam_instruction: string;
  is_consider_on_report: boolean;
  marking_reminder_date: string;
  maximum_file_size: number;
  name: string;
  id: '';
  questionaire_type: IQuestionaireTypeEnum;
  submision_type: ISubmissionTypeEnum;
  time_limit: number;
  total_mark: number;
}

export interface IEvaluationInfo {
  id: string;
  name: string;
  subject_academic_year_period: string;
  access_type: IAccessTypeEnum;
  evaluation_type: IEvaluationTypeEnum;
  questionaire_type: IQuestionaireTypeEnum;
  exam_instruction: string;
  submision_type: ISubmissionTypeEnum;
  total_mark: number;
  evaluation_status: IEvaluationStatus;
  eligible_group: IEligibleGroup;
  classification: IEvaluationClassification;
  allow_submission_time: string;
  due_on: string;
  time_limit: number;
  marking_reminder_date: string;
  content_format: string;
  maximum_file_size: number;
  is_consider_on_report: boolean;
  subject_academic_year_period_id: string;
  group_evaluations: [];
  private_attendees: [];
  student_answers: [];
  evaluation_attachments: [];
  evaluation_approvals: [];
  student_evaluations: [];
  evaluation_comments: [];
}