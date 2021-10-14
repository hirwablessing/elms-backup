import React from 'react';

import Heading from '../../components/Atoms/Text/Heading';
import ContentSpan from './ContentSpan';

export default function EvaluationContent() {
  return (
    <div className="block pr-24 pb-8 w-11/12">
      <Heading fontWeight="semibold" className="pt-8">
        Evaluation info
      </Heading>
      <div className="bg-main px-7 mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-3 pt-5">
        <div>
          {/* first column */}
          <div className="flex flex-col gap-4">
            <ContentSpan title="Evaluation name">
              Quiz on the basics of the nervous system.
            </ContentSpan>

            <ContentSpan title="Time Limit" subTitle="2h 30 mins" />

            <div className="flex flex-col gap-4">
              <Heading color="txt-secondary" fontSize="base">
                Eligible Class
              </Heading>
              <div className="flex flex-col gap-2">
                <div className="flex gap-9">
                  <div>class A</div>
                  <div>class B</div>
                </div>

                <div className="flex gap-9">
                  <div>class A</div>
                  <div>class B</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* second column */}
        <div className="flex flex-col gap-4">
          <ContentSpan title="Evaluation type" subTitle="Quiz" />

          <div className="flex flex-col gap-4">
            <ContentSpan title="Time Limit" subTitle="2h 30 mins" />
          </div>
        </div>

        {/* tjird column */}
        <div className="flex flex-col gap-4">
          <ContentSpan title="Evaluation type" subTitle="Quiz" />

          <ContentSpan title="Time Limit" subTitle="2h 30 min" />
        </div>

        {/* tjird column */}
        <div className="flex flex-col gap-4">
          <ContentSpan title="Evaluation type" subTitle="Quiz" />

          <ContentSpan title="Time Limit" subTitle="2h 30 mins" />
        </div>
      </div>

      {/* questions */}
      <div className="bg-main px-16 pt-5 flex flex-col gap-4 mt-8 w-12/12 pb-5">
        <div className="mt-7 flex justify-between">
          <ContentSpan title="Question 1" className="gap-3">
            What is the nervous system?
          </ContentSpan>

          <Heading fontWeight="semibold" fontSize="sm">
            5 marks
          </Heading>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex">
            <div className="w-14 h-14 bg-lightblue text-primary-500 border-primary-500 border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center">
              A
            </div>
            <div className="w-80 h-14 bg-lightblue text-primary-500 border-primary-500 border-2 rounded-tr-md rounded-br-md flex items-center px-4">
              This is the first answer
            </div>
          </div>
          <div className="flex">
            <div className="w-14 h-14 border-primary-500 border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center">
              B
            </div>
            <div className="w-80 h-14 border-primary-500 border-2 rounded-tr-md rounded-br-md flex items-center px-4">
              This is the second answer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
