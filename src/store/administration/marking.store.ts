import { useMutation, useQuery } from 'react-query';

import { markingService } from '../../services/administration/marking.service';

class MarkingStore {

finishMarking() {
    return useMutation(markingService.finishMarking);
}

getStudentEvaluationAnswers(id: string) {
    return useQuery(['studentEvaluation/answers', id], () =>
    markingService.getStudentEvaluationAnswers(id),
    );
}

getStudentEvaluationById(id: string) {
    return useQuery(['studentEvaluation', id], () => markingService.getStudentEvaluationById(id));
  }

}

export const markingStore = new MarkingStore();

