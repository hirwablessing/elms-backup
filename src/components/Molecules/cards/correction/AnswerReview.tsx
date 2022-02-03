import React from 'react';

import { TextDecoration } from '../../../../types';
import ContentSpan from '../../../../views/evaluation/ContentSpan';
import Icon from '../../../Atoms/custom/Icon';
import Heading from '../../../Atoms/Text/Heading';

interface PropTypes {
  data: any;
  index: number;
  full?: boolean;
  icon?: boolean;
  hoverStyle?: TextDecoration;
  className?: string;
}
export default function AnswerReview({ data, index }: PropTypes) {
  return (
    <div className={`answer-card-molecule bg-main p-6 rounded-lg `}>
      <div className="mt-3 flex justify-between">
        <ContentSpan title={`Question ${index + 1}`} className="gap-3">
          {data.evaluation_question?.question}
        </ContentSpan>

        <Heading fontWeight="semibold" fontSize="sm">
          {data.evaluation_question?.mark} marks
        </Heading>
      </div>
      <div className="flex gap-4 mt-2 items-center">
        <div>
          {data.evaluation_question?.question_type == 'MULTIPLE_CHOICE' ? (
            <div>
              <div className="flex my-4">
                <div
                  className={`w-14 h-12 border-primary-400 text-lg border-primary-500' border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center`}>
                  *
                </div>
                <div
                  className={`w-auto h-12 border-2 border-primary-400 rounded-tr-md rounded-br-md flex items-center px-4`}
                  style={{ minWidth: '20rem' }}>
                  {data.multiple_choice_answer.answer_content}
                </div>
              </div>
              {data.evaluation_question?.multiple_choice_answers?.map(
                (choice: any) =>
                  choice.id != data?.multiple_choice_answer?.id && (
                    <div className="flex my-4">
                      <div
                        className={`w-14 h-12 text-lg border-primary-500' border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center`}>
                        *
                      </div>
                      <div
                        className={`w-auto h-12 border-2 rounded-tr-md rounded-br-md flex items-center px-4`}
                        style={{ minWidth: '20rem' }}>
                        {choice.answer_content}
                      </div>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div className="min-h-8 rounded-md border-2 border-primary-500 px-2 py-3 mt-4 answer-box text-primary-500">
              {data?.open_answer}
            </div>
          )}
        </div>

        <div className="flex gap-2 h-12 items-center mt-4 self-start">
          {data.mark_scored != 0 ? (
            <button
              className={
                !data.marked || data.mark_scored == 0 ? 'normal-button' : 'right-button'
              }>
              <Icon
                name={'tick'}
                size={18}
                stroke={!data.marked || data.mark_scored == 0 ? 'none' : 'main'}
                fill={'none'}
              />
            </button>
          ) : (
            <button
              className={
                !data.marked || data.mark_scored != 0 ? 'normal-button' : 'wrong-button'
              }>
              <Icon
                name={'cross'}
                size={18}
                fill={!data?.marked || data?.mark_scored != 0 ? 'secondary' : 'main'}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
