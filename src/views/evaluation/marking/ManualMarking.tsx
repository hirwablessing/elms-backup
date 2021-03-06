import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Badge from '../../../components/Atoms/custom/Badge';
import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import InputMolecule from '../../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../../components/Molecules/input/SelectMolecule';
import { statusColors } from '../../../global/global-vars';
import { useClasses } from '../../../hooks/useClasses';
import { getStudentsByClass } from '../../../store/administration/class.store';
import { markingStore } from '../../../store/administration/marking.store';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { Color, Status, ValueType } from '../../../types';
import { StudentsInClass } from '../../../types/services/class.types';
import { IEvaluationStatus } from '../../../types/services/evaluation.types';
import { IManualMarking } from '../../../types/services/marking.types';

type PropsType = {
  evaluationId: string;
};

export default function ManualMarking({ evaluationId }: PropsType) {
  const [currentClassId, setCurrentClassId] = useState<string>('');
  const [students, setStudents] = useState<IManualMarking[]>([]);
  const [finalStudents, setFinalStudents] = useState<StudentsInClass[]>([]);
  const [rankedStudents, setRankedStudents] = useState<StudentsInClass[]>([]);
  const [unrankedStudents, setUnrankedStudents] = useState<StudentsInClass[]>([]);

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};

  const { data: studentsData, isLoading } = getStudentsByClass(currentClassId) || [];

  useEffect(() => {
    setRankedStudents(
      studentsData?.data.data.filter((stud) => stud.student.user.person?.current_rank) ||
        [],
    );
  }, [studentsData?.data.data]);

  useEffect(() => {
    setUnrankedStudents(
      studentsData?.data.data.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
      ) || [],
    );
  }, [rankedStudents, studentsData?.data.data]);

  rankedStudents.sort(function (a, b) {
    if (a.student.user.person && b.student.user.person) {
      return (
        a.student.user.person.current_rank?.priority -
        b.student.user.person.current_rank?.priority
      );
    } else {
      return 0;
    }
  });

  const { data: manualMarkingData } = markingStore.getManualMarkingMarks(
    evaluationId,
    currentClassId,
  );

  const [classes, setclasses] = useState(
    evaluationInfo?.intake_level_class_ids.split(','),
  );
  const { t } = useTranslation();
  const { mutate } = markingStore.manualMarking();

  function handleClassChange(e: ValueType) {
    setCurrentClassId(e.value.toString());
  }

  function handleMarksChange(e: ValueType, id: string) {
    if (students.length > 0) {
      let studentsClone = [...students];
      let studentMark = studentsClone.find((student) => student.student_id === id);

      if (studentMark) {
        studentMark.marks = parseFloat(e.value.toString()) || 0;
        setStudents(studentsClone);
      }
    }
  }

  function handleSubmit() {
    mutate(students, {
      onSuccess: () => {
        toast.success('Marked');
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  useEffect(() => {
    setFinalStudents(rankedStudents.concat(unrankedStudents));
  }, [rankedStudents, unrankedStudents]);
  useEffect(() => {
    setFinalStudents(rankedStudents.concat(unrankedStudents));
  }, [rankedStudents, unrankedStudents]);

  useEffect(() => {
    setclasses(evaluationInfo?.intake_level_class_ids.split(',') || ['']);
  }, [evaluationInfo?.intake_level_class_ids]);

  useEffect(() => {
    classes && setCurrentClassId(classes[0]);
  }, [classes]);

  useEffect(() => {
    let newState: IManualMarking[] = [];

    if (manualMarkingData && manualMarkingData?.data.data.length > 0) {
      newState =
        manualMarkingData?.data.data.map((mark) => ({
          student_id: mark.student.admin_id,
          evaluation_id: evaluationInfo?.id || '',
          marks: mark.obtained_mark,
          marking_status: mark.marking_status,
        })) || [];
    } else {
      newState =
        finalStudents.map((std) => ({
          student_id: std.student.id.toString(),
          evaluation_id: evaluationInfo?.id || '',
          marking_status: IEvaluationStatus.UNMARKED,
          marks: 0,
        })) || [];
    }
    setStudents(newState);
  }, [evaluationInfo?.id, finalStudents, manualMarkingData]);

  //   console.log(students);

  //   useEffect(() => {
  //     let tempStuds: UserTypes[] = [];
  //     studentsData?.data.data.forEach((stud) => {
  //       tempStuds.push({
  //         id: stud.id.toString(),
  //         username: stud.student.user.username,
  //         firstname: stud.student.user.first_name,
  //         lastName: stud.student.user.last_name,
  //       });
  //     });
  //     setStudents(tempStuds);
  //   }, [studentsData?.data.data]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Heading fontWeight="medium" fontSize="sm">
          Select {t('Class')}
        </Heading>
        <SelectMolecule
          width="80"
          className=""
          value={currentClassId}
          handleChange={handleClassChange}
          name={'type'}
          placeholder={'Select ' + t('Class')}
          options={classes?.map((cl) => useClasses(cl)) || []}
        />
      </div>

      {/* {classes.map((cl, index) => (
        <EvaluationClasses
          key={cl}
          classId={cl}
          isLast={index === classes.length - 1}
          handleChange={handleClassChange}
        />
      ))} */}
      {isLoading && <Loader />}
      {!isLoading && !currentClassId && (
        <NoDataAvailable
          title={'No selected ' + t('Class')}
          description={'Select ' + t('Class') + ' to view '}
        />
      )}
      {finalStudents && currentClassId && !isLoading && (
        <div>
          {finalStudents.length <= 0 ? (
            <NoDataAvailable
              showButton={false}
              icon="user"
              buttonLabel="Add new student"
              title={'No students available'}
              description="It looks like there aren't any students who are not marked for this evaluation"
            />
          ) : (
            <table className="table-auto border-collapse font-medium bg-main w-2/3">
              <thead>
                <tr className="text-left text-txt-secondary border-b border-silver">
                  <th className="px-4 py-5 text-sm font-semibold">Rank</th>
                  <th className="px-4 py-5 text-sm font-semibold">First name</th>
                  <th className="px-4 py-5 text-sm font-semibold">Last name</th>
                  <th className="px-4 py-5 text-sm font-semibold">Obtained</th>
                  <th className="px-4 py-5 text-sm font-semibold">Out&nbsp;of</th>
                  <th className="px-4 py-5 text-sm font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {finalStudents.map((stud, i) => (
                  <tr key={stud.id}>
                    <td className="px-4 py-5 text-sm font-semibold">
                      {stud.student.user.person?.current_rank?.name || ''}
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      {stud.student.user.first_name}
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      {stud.student.user.last_name}
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      <InputMolecule
                        name="marks"
                        style={{ width: '4rem', height: '2.5rem' }}
                        value={students[i]?.marks}
                        handleChange={(e) => handleMarksChange(e, stud.id.toString())}
                        onBlur={handleSubmit}
                      />
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      {evaluationInfo?.total_mark}
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      <Badge
                        className="cursor-pointer"
                        badgecolor={
                          statusColors[
                            students &&
                              (students[i]?.marking_status?.toLowerCase() as Status)
                          ] as Color
                        }
                        badgetxtcolor={
                          statusColors[
                            students &&
                              (students[i]?.marking_status?.toLowerCase() as Status)
                          ] as Color
                        }>
                        {students?.[i]?.marking_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
