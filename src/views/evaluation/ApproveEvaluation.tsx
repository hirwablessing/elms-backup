import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import EvaluationContent from '../../components/Organisms/evaluation/EvaluationContent';
import useAuthenticator from '../../hooks/useAuthenticator';
import { queryClient } from '../../plugins/react-query';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ValueType } from '../../types';
import {
  IEvaluationOwnership,
  UpdateEvaluationApprovalStatusEnum,
} from '../../types/services/evaluation.types';

interface IProps {
  evaluationId: string;
}

export default function ApproveEvaluation({ evaluationId }: IProps) {
  const history = useHistory();
  const { user } = useAuthenticator();

  const evaluationApprovals =
    evaluationStore.getEvaluationApprovalByEvaluationAndInstructor(
      evaluationId,
      user?.id + '',
    ).data?.data.data;

  const [remarks, setRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const { mutateAsync } = evaluationStore.approveEvaluation();

  const approve = () => {
    setOpen(true);
    let udpateEvaluationStatus = {
      evaluation_id: evaluationId,
      evaluation_approval_status:
        action === 'approve'
          ? UpdateEvaluationApprovalStatusEnum.APPROVED
          : UpdateEvaluationApprovalStatusEnum.REJECTED,
      instructor_id: user?.id + '',
      remarks: remarks,
    };

    if ((remarks && action === 'reject') || action === 'approve') {
      mutateAsync(udpateEvaluationStatus, {
        onSuccess: () => {
          toast.success('Evaluation has been approveed');
          queryClient.invalidateQueries([
            'evaluations',
            user?.id,
            IEvaluationOwnership.FOR_APPROVING,
          ]);
          history.goBack();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error('A remark is needed when rejecting!');
  };

  function changeAction(action: string) {
    setOpen(true);
    setAction(action);
  }

  function closePopup() {
    setOpen(false);
    setRemarks('');
  }

  return (
    <>
      <EvaluationContent
        evaluationId={evaluationId}
        showSetQuestions={false}
        actionType="approvals">
        <Button
          disabled={evaluationApprovals?.evaluation_approval_status + '' !== 'PENDING'}
          onClick={() => changeAction('approve')}>
          Mark as approved
        </Button>
        <Button
          disabled={evaluationApprovals?.evaluation_approval_status + '' !== 'PENDING'}
          styleType="outline"
          onClick={() => changeAction('reject')}>
          Mark as rejected
        </Button>
      </EvaluationContent>

      <PopupMolecule open={open} title="Evaluation Feedback" onClose={closePopup}>
        <TextAreaMolecule
          required
          name="remarks"
          value={remarks}
          handleChange={(e: ValueType) => setRemarks(e.value + '')}>
          Remarks {action === 'approve' && '(Optional)'}
          <div></div>
        </TextAreaMolecule>
        <Button onClick={approve}>Save</Button>
      </PopupMolecule>
    </>
  );
}
