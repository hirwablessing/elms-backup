import { AxiosResponse } from 'axios';

import { evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  ICreateEvaluationQuestions,
  IEvaluationApproval,
  IEvaluationCreate,
  IEvaluationInfo,
  IEvaluationInfoCollected,
  IEvaluationQuestionsInfo,
  IStudentAnswer,
  IStudentEvaluationStart,
  IStudentEvaluationStartInfo,
} from '../../types/services/evaluation.types';

class EvaluationService {
  public async createEvaluation(
    evaluationInfo: IEvaluationCreate,
  ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
    return await evaluationAxios.post('/evaluations/add', evaluationInfo);
  }
  public async updateEvaluation(
    evaluationInfo: IEvaluationCreate,
  ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
    return await evaluationAxios.put(
      `/evaluations/modify/${evaluationInfo.id}`,
      evaluationInfo,
    );
  }

  // public async createEvaluationQuestion(
  //   questionsInfo: ICreateEvaluationQuestions[],
  // ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  //   return await evaluationAxios.post('/evaluationQuestions/add', {
  //     questions: questionsInfo,
  //   });
  // }
  public async createEvaluationQuestion(
    questionsInfo: ICreateEvaluationQuestions[],
  ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
    return await evaluationAxios.post('/evaluationQuestions/update-multiple', {
      questions: questionsInfo,
    });
  }

  public async createEvaluationSettings(
    settings: IEvaluationApproval,
  ): Promise<AxiosResponse<Response<IEvaluationApproval>>> {
    return await evaluationAxios.post(
      '/evaluationApprovals/addApprovalToEvaluation',
      settings,
    );
  }
  public async fetchEvaluationsByInstructorAndAcademy(
    academy: string,
    instructor: string,
  ): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
    return await evaluationAxios.get(
      `/evaluations/getEvaluationsByAcademy/${academy}/narrowByInstructor/${instructor}`,
    );
  }

  public async fetchEvaluationsByModule(
    module: string,
  ): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
    return await evaluationAxios.get(`/evaluations/getEvaluationsByModule/${module}`);
  }
  public async fetchEvaluationsBySubject(
    subject: string,
  ): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
    return await evaluationAxios.get(`/evaluations/getEvaluationsBySubject/${subject}`);
  }
  public async fetchEvaluationsCollectionBySubject(
    subject: string,
  ): Promise<AxiosResponse<Response<IEvaluationInfoCollected>>> {
    return await evaluationAxios.get(
      `/evaluations/getEvaluationsBySubject/${subject}/studentNarrower`,
    );
  }

  public async fetchEvaluationsByStudent(
    subject: string,
  ): Promise<AxiosResponse<Response<IStudentEvaluationStart[]>>> {
    return await evaluationAxios.get(
      `/evaluations/getEvaluationsBySubject/${subject}/studentNarrower`,
    );
  }

  public async getEvaluationById(
    id: string,
  ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
    return await evaluationAxios.get(`/evaluations/getById/${id}`);
  }

  public async getStudentEvaluationByStudentIdAndEvaluationId(
    evaluationId: string,
    studentId: string,
  ): Promise<AxiosResponse<Response<any>>> {
    return await evaluationAxios.get(
      `/studentEvaluations/studentEvaluation/evaluation/${evaluationId}/student/${studentId}`,
    );
  }

  public async getEvaluationQuestions(
    id: string,
  ): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
    return await evaluationAxios.get(`/evaluationQuestions/getEvaluationQuestions/${id}`);
  }

  public async modifyEvaluation(
    evaluationInfo: IEvaluationCreate,
  ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
    return await evaluationAxios.put('/evaluations/modifyEvaluation', {
      ...evaluationInfo,
    });
  }

  public async getEvaluationWorkTime(
    studentEvaluationId: string,
  ): Promise<AxiosResponse<Response<any>>> {
    return await evaluationAxios.get(
      `studentEvaluations/studentEvaluation/getWorkTime/${studentEvaluationId}`,
    );
  }

  public async updateEvaluationWorkTime({
    studentEvaluationId = '',
    currentTime = '',
  }): Promise<void> {
    return await evaluationAxios.put(
      `/studentEvaluations/studentEvaluation/${studentEvaluationId}/currentWorkTime/${currentTime}`,
    );
  }

  public async addQuestionAnswer(
    answer: IStudentAnswer,
  ): Promise<AxiosResponse<Response<IStudentAnswer>>> {
    return await evaluationAxios.post('student-answers/add', answer);
  }

  public async submitEvaluation(studentEvaluationId: string): Promise<void> {
    return await evaluationAxios.put(
      `studentEvaluations/studentEvaluation/${studentEvaluationId}/submit`,
    );
  }
  public async autoSubmitEvaluation(studentEvaluationId: string): Promise<void> {
    return await evaluationAxios.put(
      `studentEvaluations/studentEvaluation/${studentEvaluationId}/auto_submit`,
    );
  }

  public async publishEvaluation(data: {
    evaluationId: string;
    status: string;
  }): Promise<void> {
    return await evaluationAxios.put(
      `/evaluations/evaluation/${data.evaluationId}/${data.status}`,
    );
  }

  public async studentEvaluationStart(
    student: IStudentEvaluationStart,
  ): Promise<AxiosResponse<Response<IStudentEvaluationStartInfo>>> {
    return await evaluationAxios.post('studentEvaluations/start', student);
  }
}

export const evaluationService = new EvaluationService();