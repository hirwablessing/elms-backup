import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../hooks/useAuthenticator';
import { subjectService } from '../../../services/administration/subject.service';
import { evaluationService } from '../../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import instructordeploymentStore from '../../../store/instructordeployment.store';
import { ValueType } from '../../../types';
import { IEvaluationStatus } from '../../../types/services/evaluation.types';
import { SubjectInfo } from '../../../types/services/subject.types';
import { getDropDownOptions } from '../../../utils/getOption';
import Button from '../../Atoms/custom/Button';
import SelectMolecule from '../../Molecules/input/SelectMolecule';

type IEvaluationSubjectsProps = { evaluationId: string; action: string };

export default function EvaluationSubjects({
  evaluationId,
  action,
}: IEvaluationSubjectsProps) {
  const userInfo = useAuthenticator();
  const instructorInfo = instructordeploymentStore.getInstructorByUserId(
    userInfo?.user?.id + '',
  ).data?.data.data[0];

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationByIdAndInstructor(evaluationId, instructorInfo?.id + '')
      .data?.data || {};
  const history = useHistory();

  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [isLoading, setIsloading] = useState(true);
  const [subjectId, setSubjectId] = useState('');

  useEffect(() => {
    let filteredInfo: SubjectInfo[] = [];

    async function get() {
      if (evaluationInfo?.evaluation_module_subjects) {
        //   alert('we fetched');
        for (let [index, subj] of evaluationInfo.evaluation_module_subjects.entries()) {
          // request one
          const subjectData = await subjectService.getSubject(
            subj.subject_academic_year_period.toString(),
          );

          let temp = {
            id: '',
            subject: '',
            section: '',
            instructor: '',
            status: IEvaluationStatus.ACCEPTED,
          };
          temp.subject = subjectData.data.data.title;
          temp.section = `section ${index + 1}`;
          temp.status = subj.questionaire_setting_status;
          temp.id = subj.subject_academic_year_period.toString();
          //@ts-ignore
          filteredInfo.push(temp);
        }

        setSubjects(filteredInfo);
        setIsloading(false);
      }
    }
    get();
    setIsloading(false);
  }, [evaluationInfo?.evaluation_module_subjects]);

  function handleChange(e: ValueType) {
    console.log(evaluationInfo?.evaluation_module_subjects);
    console.log(e.value);
    setSubjectId(
      evaluationInfo?.evaluation_module_subjects.find(
        (mod) => mod.subject_academic_year_period == e.value.toString(),
      )?.id || '',
    );
  }

  function handleAction() {
    if (action == 'finish_setting') {
      evaluationService
        .updateEvaluationModuleSubject(subjectId, IEvaluationStatus.COMPLETED)
        .then(() => {
          toast.success('Marked setting status to completed');
          history.goBack();
        })
        .catch((err) => {
          toast.error(err);
        });
    } else if (action == 'add_questions') {
      alert(
        `/dashboard/evaluations/details/${evaluationId}/section/${subjectId}/add-questions`,
      );
      history.push(
        `/dashboard/evaluations/details/${evaluationId}/section/${subjectId}/add-questions`,
      );
    } else {
      return;
    }
  }

  return (
    <>
      <SelectMolecule
        handleChange={handleChange}
        loading={isLoading}
        name="subjectId"
        placeholder="select subject"
        options={getDropDownOptions({ inputs: subjects, labelName: ['subject'] })}>
        Select subject
      </SelectMolecule>

      <div className="py-6">
        {/* <Link
          to={`/dashboard/evaluations/details/${evaluationId}/section/${subjectId}/add-questions`}> */}
        <Button onClick={handleAction} disabled={!subjectId}>
          Continue
        </Button>
        {/* </Link> */}
      </div>
    </>
  );
}
