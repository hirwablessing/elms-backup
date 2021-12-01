import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { EnrollInstructorLevel } from '../../types/services/enrollment.types';
import { IntakeLevelParam } from '../../types/services/intake-program.types';
import { UserView } from '../../types/services/user.types';

function EnrollInstructorToLevel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id, intakeId, level: levelId } = useParams<IntakeLevelParam>();

  const instructorsInProgram =
    intakeProgramStore.getInstructorsByIntakeProgram(id, intakeId).data?.data.data || [];

  const level = intakeProgramStore.getIntakeLevelById(levelId).data?.data.data;

  const [instructors, setInstructors] = useState<UserView[]>([]);
  useEffect(() => {
    let instructorsView: UserView[] = [];
    instructorsInProgram?.forEach((inst) => {
      let instructorView: UserView = {
        id: inst.id,
        first_name: inst.instructor.user.first_name,
        last_name: inst.instructor.user.last_name,
        image_url: inst.instructor.user.image_url,
      };
      instructorsView.push(instructorView);
    });
    setInstructors(instructorsView);
  }, [instructorsInProgram]);

  const { mutate } = enrollmentStore.enrollInstructorToLevel();

  function add(data?: string[]) {
    data?.map((inst_id) => {
      let newInstructor: EnrollInstructorLevel = {
        academicProgramLevelId: level?.academic_program_level.id + '',
        academicYearId: level?.academic_year.id + '',
        intakeProgramInstructorId: parseInt(inst_id),
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructors/intakeprogram']);
          setSidebarOpen(false);
        },
        onError: () => {
          toast.error('something wrong happened while enrolling student to level');
        },
      });
    });
  }
  return (
    <div className="cursor-pointer">
      <Button styleType="outline" onClick={() => setSidebarOpen(true)}>
        Enroll instructor
      </Button>
      <RightSidebar
        open={sidebarOpen}
        handleClose={() => setSidebarOpen(false)}
        label="Enroll instructor to program"
        data={instructors}
        selectorActions={[
          {
            name: 'enroll instructors',
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={'Instructors in this program'}
      />
    </div>
  );
}

export default EnrollInstructorToLevel;
