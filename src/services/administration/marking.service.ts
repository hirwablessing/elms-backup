import { AxiosResponse } from 'axios';

import { evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { IEvaluationSectionBasedInfo } from '../../types/services/evaluation.types';
import {
  IManualMarking,
  IManualMarkingInfo,
  MarkAllEvaluationQuestions,
  SingleFieldStudentMarker,
  StudentAnswerMarkInfo,
  StudentEvaluationInfo,
  StudentMarkingAnswer,
} from '../../types/services/marking.types';

class MarkingService {
  public async finishMarking(
    markInfo: MarkAllEvaluationQuestions,
  ): Promise<AxiosResponse<Response<String>>> {
    const correction = markInfo.correction;
    return await evaluationAxios.put(
      `/student-answers/markStudentEvaluation/${markInfo.studentEvaluation}`,
      { correction },
    );
  }

  public async updateStudentAnswer(
    markInfo: StudentAnswerMarkInfo,
  ): Promise<AxiosResponse<Response<String>>> {
    return await evaluationAxios.put(
      `/student-answers/student-answer/${markInfo.answer_id}/markAnswer`,
      {
        marks: markInfo.marks,
      },
    );
  }

  public async fieldMarkingFinish(
    markInfo: SingleFieldStudentMarker,
  ): Promise<AxiosResponse<Response<String>>> {
    return await evaluationAxios.post(`/studentEvaluations/marking/single-field-marker`, {
      ...markInfo,
    });
  }

  public async publishResults(data: {
    evaluationId: string;
  }): Promise<AxiosResponse<Response<String>>> {
    return await evaluationAxios.put(
      `/studentEvaluations/evaluation/${data.evaluationId}/publishResults`,
    );
  }

  public async addManualMarking(
    data: IManualMarking[],
  ): Promise<AxiosResponse<Response<IManualMarking[]>>> {
    return await evaluationAxios.post(`/studentEvaluations/marking/manual-marking`, {
      student_evaluations: data,
    });
  }

  public async getManualMarkingMarks(
    evaluationId: string,
    classId: string,
  ): Promise<AxiosResponse<Response<IManualMarkingInfo[]>>> {
    return await evaluationAxios.get(
      `/studentEvaluations/evaluation/${evaluationId}/class/${classId}`,
    );
  }

  public async publishResult(data: {
    studentEvaluationId: string;
  }): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
    return await evaluationAxios.put(
      `/studentEvaluations/studentEvaluation/${data.studentEvaluationId}/publish`,
    );
  }

  public async finalizaMarkingWithRemarks(data: {
    studentEvaluationId: string;
    body: any;
  }): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
    return await evaluationAxios.post(
      `/studentEvaluations/studentEvaluation/${data.studentEvaluationId}/addRemark`,
      data.body,
    );
  }

  public async getStudentEvaluationById(
    id: string,
  ): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
    return await evaluationAxios.get(`/studentEvaluations/getById/${id}`);
  }

  public async getStudentEvaluationAnswers(
    id: string,
  ): Promise<AxiosResponse<Response<StudentMarkingAnswer[]>>> {
    return await evaluationAxios.get(`/student-answers/getAllByStudentEvaluation/${id}`);
  }

  public async getEvaluationMarkingModules(
    id: string,
  ): Promise<AxiosResponse<Response<IEvaluationSectionBasedInfo[]>>> {
    return await evaluationAxios.get(
      `/evaluation-module-subjects/getByEvaluation/${id}/marker`,
    );
  }

  public async getAllStudentEvaluationsByEvaluation(
    id: string,
  ): Promise<AxiosResponse<Response<StudentEvaluationInfo[]>>> {
    return await evaluationAxios.get(`studentEvaluations/getByEvaluation/${id}`);
  }
}
export const markingService = new MarkingService();
