import React, { Dispatch, SetStateAction } from 'react';
import { TextDecoration } from '../../../../types';
import { MarkingCorrection } from '../../../../types/services/marking.types';
import Icon from '../../../Atoms/custom/Icon';

interface PropTypes {
  data: any;
  full?: boolean;
  icon?: boolean;
  correction: MarkingCorrection[];
  totalMarks: number;
  updateQuestionPoints: (_answer_id: string, _marks: number) => void;
  createCreateNewCorrection: (
    _answer_id: string,
    _marks: number,
    _marked: boolean,
  ) => MarkingCorrection;
  setTotalMarks: Dispatch<SetStateAction<number>>;
  hoverStyle?: TextDecoration;
  className?: string;
}
export default function StudentAnswer({
  updateQuestionPoints,
  data,
  correction,
  createCreateNewCorrection,
}: PropTypes) {
  const correct: MarkingCorrection =
    correction.find((x) => x.answerId === data?.id) ||
    createCreateNewCorrection(data?.id, data.mark_scored, data.marked);
  return (
    <div className={`answer-card-molecule bg-main p-6 rounded-lg `}>
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">Question</p>
        <p className="text-sm font-semibold">{data?.evaluation_question?.mark} Marks</p>
      </div>
      <div className="">
        <p className="font-semibold">{data?.evaluation_question?.question}</p>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="rounded-md border-2 border-primary-500 px-2 py-2 answer-box text-primary-500">
          {data?.open_answer}
        </div>
        <div className="flex gap-2 h-12 items-center">
          <button
            className={
              !correct?.marked || correct?.markScored == 0
                ? 'normal-button'
                : 'right-button'
            }
            onClick={() => {
              updateQuestionPoints(data?.id, data?.evaluation_question?.mark);
            }}>
            <Icon
              name={'tick'}
              size={18}
              stroke={!correct?.marked || correct?.markScored == 0 ? 'none' : 'main'}
              fill={'none'}
            />
          </button>

          <button
            className={
              !correct?.marked || correct?.markScored != 0
                ? 'normal-button'
                : 'wrong-button'
            }
            onClick={() => {
              updateQuestionPoints(data?.id, 0);
            }}>
            <Icon
              name={'cross'}
              size={18}
              fill={!correct?.marked || correct?.markScored != 0 ? 'secondary' : 'main'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}