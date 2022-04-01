import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import usePickedRole from '../../hooks/usePickedRole';
import academyStore from '../../store/administration/academy.store';
import { classStore } from '../../store/administration/class.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { Privileges } from '../../types';
import { usePicture } from '../../utils/file-util';
import { calculateGrade } from '../../utils/school-report';

interface IParamType {
  levelId: string;
  classId: string;
  studentId: string;
  periodId: string;
}

const sections = [
  'Introduction',
  'Written Work',
  'Oral work',
  'Attitude to Work',
  'Practical Ability',
  'Extra-Curricular Activities',
  'Summary',
];

const comments = [
  'Intellectual Competence',
  'Professional Competence',
  'Personal Qualities',
];

const gradedExercises = [
  { name: 'Fast Track (FTX)', hpm: 20.0, ob: 10 },
  {
    name: 'Intnl Study Tour',
    hpm: 40.0,
    ob: 10,
  },
  {
    name: 'Campaign Analysis',
    hpm: 20.0,
    ob: 15,
  },
  {
    name: 'College Research Paper',
    hpm: 50.0,
    ob: 35,
  },
  {
    name: 'Op Estimate',
    hpm: 30.0,
    ob: 30,
  },
  {
    name: 'Final Exam',
    hpm: 30,
    ob: 30,
  },
];

export default function EndTermForm() {
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);

  const picked_role = usePickedRole();
  const { data: role_academy } = academyStore.getAcademyById(
    picked_role?.academy_id + '',
  );

  //path params
  const { classId, studentId, periodId } = useParams<IParamType>();

  const { data: classInfo } = classStore.getClassById(classId);
  const { data: studentInfo } = intakeProgramStore.getStudentById(studentId);

  const handlePrint = useReactToPrint({
    content: () => report.current,
    bodyClass: 'bg-white',
    documentTitle: 'student-end-term-report',
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
  });

  return (
    <div className="max-w-4xl">
      <div className="text-right mb-5">
        <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
          <Button disabled={isPrinting} onClick={() => handlePrint()}>
            Download form
          </Button>
        </Permission>
      </div>
      <div
        ref={report}
        className="px-10 py-10 bg-white mx-auto max-w-4xl border border-gray-300 print:border-none">
        <div className="provider">
          <Heading fontWeight="medium" fontSize="lg" className="text-center uppercase">
            {role_academy?.data.data.name}
          </Heading>
          <img
            src={usePicture(
              role_academy?.data.data.logo_attachment_id,
              role_academy?.data.data.id,
              '/images/rdf-logo.png',
              'logos',
            )}
            alt="Institution logo"
            className=" mx-auto w-32 object-cover block my-5"
          />
        </div>
        <h1 className="text-center font-bold underline my-8 text-base">END TERM FORM</h1>
        {/* Part one */}
        <div className="part-one">
          <Heading className="underline uppercase" fontSize="base" fontWeight="semibold">
            Part 1
          </Heading>
          <div className="my-4">
            <div className="flex">
              <div className="border border-black py-1 text-center w-40">Term</div>
              <div className="border border-black py-1 text-center w-32">1</div>
            </div>
            <div className="flex">
              <div className="border border-black py-1 text-center w-40">Syndicate</div>
              <div className="border border-black py-1 text-center w-32">
                {classInfo?.data.data.class_name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5">
            <div className="border border-black py-1 px-2">Army/service</div>
            <div className="border border-black py-1 px-2">Rank</div>
            <div className="border border-black py-1 px-2">Surname</div>
            <div className="border border-black py-1 px-2">Initials</div>
            <div className="border border-black py-1 px-2">First Name</div>
            <div className="border border-black py-1 px-2">
              {studentInfo?.data.data.user.academy.institution.short_name}
            </div>
            <div className="border border-black py-1 px-2">
              {studentInfo?.data.data.user.person.current_rank.name}
            </div>
            <div className="border border-black py-1 px-2 capitalize">
              {studentInfo?.data.data.user.last_name}
            </div>
            <div className="border border-black py-1 px-2"></div>
            <div className="border border-black py-1 px-2 capitalize">
              {studentInfo?.data.data.user.first_name}
            </div>
          </div>
        </div>
        {/* Part 2 */}
        <div className="part-two py-10">
          <Heading
            className="underline mb-8 uppercase"
            fontSize="base"
            fontWeight="semibold">
            Part 2
          </Heading>
          {sections.map((section, index) => (
            <div key={index}>
              <Heading className="underline" fontSize="sm" fontWeight="semibold">
                {`${index + 1}. ${section}.`}
              </Heading>
              <div className="h-48"></div>
            </div>
          ))}
          <Heading className="underline" fontSize="sm" fontWeight="semibold">
            8. Overall grading: C+
          </Heading>
        </div>

        {/* Part 3 */}
        <div className="part-two py-10">
          <Heading
            className="underline mb-8 uppercase"
            fontSize="base"
            fontWeight="semibold">
            PART 3: ASSESSED EXERCISES
          </Heading>
          <div className="grid grid-cols-12">
            {/* table header */}
            <div className="p-1 border border-black text-sm font-bold">Sr</div>
            <div className="py-1 px-4 col-span-5 border border-black text-sm font-bold">
              GRADED EXERCISES
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              HIGHEST POSSIBLE MARKS
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              STUDENT&apos;S MARKS
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              GRADE
            </div>
            {/* table body */}
            {gradedExercises.map((exercise, index) => (
              <React.Fragment key={index}>
                <div className="px-4 py-2 text-sm border border-black">{index + 1}</div>
                <div className="px-4 py-2 text-sm border border-black col-span-5">
                  {exercise.name}
                </div>
                <div className="px-4 py-2 text-sm border border-black col-span-2">
                  {exercise.hpm}
                </div>
                <div className="px-4 py-2 text-sm border border-black col-span-2">
                  {exercise.ob}
                </div>
                <div className="px-4 py-2 text-sm border border-black col-span-2">
                  {calculateGrade(exercise.ob, exercise.hpm)}
                </div>
              </React.Fragment>
            ))}
            {/* total */}
            <div className="border border-black" />
            <div className="px-4 py-2 text-sm border border-black uppercase col-span-5 font-bold">
              Total
            </div>
            <div className="px-4 py-2 text-sm border border-black col-span-2">
              {gradedExercises.reduce((acc, curr) => acc + curr.hpm, 0)}
            </div>
            <div className="px-4 py-2 text-sm border border-black col-span-2">
              {gradedExercises.reduce((acc, curr) => acc + curr.ob, 0)}
            </div>
            <div className="px-4 py-2 text-sm border border-black col-span-2">
              {calculateGrade(
                gradedExercises.reduce((acc, curr) => acc + curr.ob, 0),
                gradedExercises.reduce((acc, curr) => acc + curr.hpm, 0),
              )}
            </div>
          </div>
        </div>

        {/* Part 5 */}
        <div className="part-two py-10">
          <Heading
            className="underline mb-8 uppercase"
            fontSize="base"
            fontWeight="semibold">
            PART 5: TERM ASSESSMENT
          </Heading>

          <div className="grid grid-cols-12">
            {/* table header */}
            <div className="p-1 border border-black text-sm font-bold">Sr</div>
            <div className="py-1 px-4 col-span-5 border border-black text-sm font-bold">
              GRADED EXERCISES
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              DS ASSESSMENT
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              TOTAL MARK AS % OF HPM
            </div>
            <div className="p-2 col-span-2 border border-black text-sm font-bold">
              OVERALL GRADE FOR TERM
            </div>
            {/* table body */}
            <div className="h-8 border border-black"></div>
            <div className="h-8 border border-black col-span-5"></div>
            <div className="h-8 border border-black col-span-2"></div>
            <div className="h-8 border border-black col-span-2"></div>
            <div className="h-8 border border-black col-span-2"></div>
          </div>

          <Heading
            className="underline my-8 uppercase"
            fontSize="sm"
            fontWeight="semibold">
            DS COMMENTS
          </Heading>
          {comments.map((comment, index) => (
            <div key={index}>
              <Heading className="underline" fontSize="sm" fontWeight="semibold">
                {`${index + 1}. ${comment}.`}
              </Heading>
              <div className="h-32"></div>
            </div>
          ))}
        </div>
        {/* approval */}
        <div className="grid grid-cols-3">
          <p className="text-sm">Date: {new Date().toDateString()}</p>
          <p className="text-sm">Names: Lt. Col. Bugingo Jean</p>
          <div className="h-12 px-4 flex">
            <p className="text-sm">Signature</p>
            <img
              src="https://i.stack.imgur.com/eUcfI.gif"
              alt="signature"
              className="block max-w-full max-h-12"
            />
          </div>
        </div>
        {/* chief instructor */}
        <Heading className="underline py-2" fontSize="sm" fontWeight="semibold">
          Chief Instructor
        </Heading>
        <div className="grid grid-cols-3 pt-4">
          <p className="text-sm">Date: {new Date().toDateString()}</p>
          <p className="text-sm">Names: Lt. Col. Bugingo Jean</p>
          <div className="h-12 px-4 flex">
            <p className="text-sm">Signature</p>
            <img
              src="https://i.stack.imgur.com/eUcfI.gif"
              alt="signature"
              className="block max-w-full max-h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
