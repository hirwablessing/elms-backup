/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CardHeadMolecule from '../../components/Molecules/CardHeadMolecule';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import Tooltip from '../../components/Molecules/Tooltip';
import NewIntake from '../../components/Organisms/intake/NewIntake';
import UpdateIntake from '../../components/Organisms/intake/UpdateIntake';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import enrollmentStore from '../../store/administration/enrollment.store';
import { getIntakesByAcademy } from '../../store/administration/intake.store';
import {
  getIntakeProgramsByStudent,
  getStudentShipByUserId,
} from '../../store/administration/intake-program.store';
import registrationControlStore from '../../store/administration/registrationControl.store';
import instructordeploymentStore from '../../store/instructordeployment.store';
import { CommonCardDataType, Link as LinkType, Privileges, ValueType } from '../../types';
import { StudentApproval } from '../../types/services/enrollment.types';
import { InstructorProgram } from '../../types/services/instructor.types';
import { ExtendedIntakeInfo } from '../../types/services/intake.types';
import { StudentIntakeProgram } from '../../types/services/intake-program.types';
import { UserType } from '../../types/services/user.types';
import { advancedTypeChecker } from '../../utils/getOption';
import IntakePrograms from '../intake-program/IntakePrograms';
import LevelPerformance from '../performance/LevelPerformance';

interface IntakeCardType extends CommonCardDataType {
  registrationControlId: string;
}

export default function Intakes() {
  const [intakes, setIntakes] = useState<IntakeCardType[]>([]);
  const { user } = useAuthenticator();

  const { t } = useTranslation();

  const list: LinkType[] = [
    { to: 'home', title: 'Institution Admin' },
    { to: 'faculty', title: t('Faculty') },
    { to: 'programs', title: t('Program') },
    { to: 'intakes', title: 'Intakes' },
  ];

  const history = useHistory();
  const { url, path } = useRouteMatch();
  const { search } = useLocation();
  const registrationControlId = new URLSearchParams(search).get('regId');

  const {
    data: regControl,
    refetch,
    isLoading: regLoading,
    isSuccess: regSuccess,
  } = registrationControlStore.fetchRegControlById(registrationControlId!, false);

  if (registrationControlId && !regSuccess && !regLoading) refetch();

  const authUserId = user?.id;
  const instructorInfo = instructordeploymentStore.getInstructorByUserId(authUserId + '')
    .data?.data.data[0];

  const studentInfo =
    getStudentShipByUserId(
      authUserId + '',
      !!authUserId && user?.user_type === UserType.STUDENT,
    ).data?.data.data || [];

  const picked_role = usePickedRole();
  const {
    isSuccess,
    isError,
    data,
    isLoading,
    refetch: refetchIntakes,
  } = user?.user_type === UserType.STUDENT
    ? getIntakeProgramsByStudent(
        studentInfo[0]?.id.toString() || '',
        !!studentInfo[0]?.id,
      )
    : user?.user_type === UserType.INSTRUCTOR
    ? enrollmentStore.getInstructorIntakePrograms(instructorInfo?.id + '')
    : getIntakesByAcademy(
        registrationControlId || picked_role?.academy_id + '',
        !!registrationControlId,
        true,
      );

  useEffect(() => {
    if (isSuccess && data?.data) {
      let loadedIntakes: IntakeCardType[] = [];
      data?.data.data.forEach((intk) => {
        if (user?.user_type === UserType.STUDENT) {
          let intake = intk as StudentIntakeProgram;
          if (intake && intake.enrolment_status === StudentApproval.APPROVED) {
            let prog: IntakeCardType = {
              id: intake.intake_program.intake.id,
              status: {
                type: advancedTypeChecker(intake.intake_program.intake.intake_status),
                text: intake.intake_program.intake.intake_status.toString(),
              },
              code: intake.intake_program.intake.title,
              title: intake.intake_program.intake.title,
              description: intake.intake_program.intake.description,
              footerTitle: intake.intake_program.intake.total_num_students,
              registrationControlId:
                intake.intake_program.intake.registration_control?.id + '',
            };
            if (!loadedIntakes.find((pg) => pg.id === prog.id)?.id) {
              loadedIntakes.push(prog);
            }
          }
        } else if (user?.user_type === UserType.INSTRUCTOR) {
          let intake = intk as InstructorProgram;
          let prog: IntakeCardType = {
            id: intake.intake_program.intake.id,
            status: {
              type: advancedTypeChecker(intake.intake_program.intake.intake_status),
              text: intake.intake_program.intake.intake_status.toString(),
            },
            code: intake.intake_program.intake.title,
            title: intake.intake_program.intake.description,
            description: intake.intake_program.intake.description,
            footerTitle: intake.intake_program.intake.total_num_students,
            registrationControlId:
              intake.intake_program.intake.registration_control?.id + '',
          };
          if (!loadedIntakes.find((pg) => pg.id === prog.id)?.id) {
            loadedIntakes.push(prog);
          }
        } else {
          let intake = intk as ExtendedIntakeInfo;
          let cardData: IntakeCardType = {
            id: intake.id,
            code: intake.title.toUpperCase(),
            description: `${intake.expected_start_date.toString().split(' ')[0]} - ${
              intake.expected_end_date.toString().split(' ')[0]
            }`,
            title: intake.description || ``,
            status: {
              type: advancedTypeChecker(intake.intake_status),
              text: intake.intake_status.toString(),
            },
            footerTitle: intake.total_num_students,
            registrationControlId: intake.registration_control.id + '',
          };
          loadedIntakes.push(cardData);
        }
      });
      setIntakes(loadedIntakes);
    } else if (isError) toast.error('error occurred when loading intakes');
  }, [user?.user_type, data, isError, isSuccess]);

  function handleSearch(_e: ValueType) {}
  function handleClose() {
    history.goBack();
  }

  function regControlName() {
    return `${moment(regControl?.data.data.expected_start_date).format(
      'MMM D YYYY',
    )} - ${moment(regControl?.data.data.expected_end_date).format('MMM D YYYY')}`;
  }

  function intakeCreated() {
    refetchIntakes();
    history.goBack();
  }

  const goToEdit = (e: Event, intakeId: string, IntakeRegId: string) => {
    e.stopPropagation();
    e.preventDefault();

    history.push(`${url}/${intakeId}/edit/${IntakeRegId}`);
  };

  return (
    <Switch>
      <Route
        path={`${path}/programs/:intakeId`}
        render={() => {
          return <IntakePrograms />;
        }}
      />
      <Route
        path={`${path}/peformance/:levelId`}
        render={() => {
          return <LevelPerformance />;
        }}
      />
      <Route
        path={`${path}`}
        render={() => {
          return (
            <div>
              <BreadCrumb list={list} />
              <TableHeader
                title={`${registrationControlId ? regControlName() : 'Intakes'}`}
                totalItems={
                  registrationControlId
                    ? `${intakes.length} intakes`
                    : `${intakes.length}`
                }
                showSearch={false}
                handleSearch={handleSearch}>
                {registrationControlId && (
                  <Permission privilege={Privileges.CAN_CREATE_INTAKE}>
                    <Link to={`${url}/${registrationControlId}/add-intake`}>
                      <Button>Add Intake</Button>
                    </Link>
                  </Permission>
                )}
              </TableHeader>

              <section className="flex flex-wrap justify-start gap-4 mt-2">
                {intakes.map((intake) => (
                  <div key={intake.code + Math.random() * 10} className="p-1 mt-3">
                    <Tooltip
                      key={intake.code + Math.random() * 10}
                      trigger={
                        <div className="p-1 mt-3">
                          <CommonCardMolecule
                            data={intake}
                            handleClick={
                              () =>
                                // privileges?.includes(
                                //   Privileges.CAN_ACCESS_PROGRAMS_IN_INTAKE,
                                // )
                                // ?
                                history.push(`${url}/programs/${intake.id}`)
                              // : {}
                            }>
                            <div className="flex flex-col gap-6">
                              <div className="flex gap-2">
                                {/* <Heading color="txt-secondary" fontSize="sm">
                                  Total Students Enrolled:
                                </Heading> */}
                                {/* <Heading fontSize="sm" fontWeight="semibold">
                                  {intake.footerTitle}
                                </Heading> */}
                              </div>
                            </div>
                            <Permission privilege={Privileges.CAN_MODIFY_INTAKE}>
                              <div className="mt-4 space-x-4 z-30">
                                <Link
                                  //@ts-ignore
                                  onClick={(e: Event) =>
                                    goToEdit(
                                      e,
                                      intake.id + '',
                                      intake.registrationControlId,
                                    )
                                  }>
                                  <Button>Edit Intake</Button>
                                </Link>
                                {/* <Button styleType="outline">Change Status</Button> */}
                              </div>
                            </Permission>
                          </CommonCardMolecule>
                        </div>
                      }
                      open>
                      <div className="w-96">
                        <CardHeadMolecule
                          title={intake.title}
                          code={intake.code}
                          status={intake.status}
                          description={intake.description}
                        />
                        {/* <div className="flex gap-2 mt-4">
                          <Heading color="txt-secondary" fontSize="sm">
                            Total Students Enrolled:
                          </Heading>
                          <Heading fontSize="sm" fontWeight="semibold">
                            {intake.footerTitle}
                          </Heading>
                        </div> */}
                      </div>
                    </Tooltip>
                  </div>
                ))}

                {isLoading ? (
                  <Loader />
                ) : (
                  intakes.length <= 0 && (
                    <NoDataAvailable
                      fill={false}
                      icon="academy"
                      buttonLabel={
                        registrationControlId
                          ? 'Add Intake '
                          : 'Go to registration period'
                      }
                      title={
                        registrationControlId
                          ? 'No intake available in this registration Period'
                          : 'No intake available'
                      }
                      privilege={Privileges.CAN_CREATE_INTAKE}
                      handleClick={() => {
                        if (registrationControlId)
                          history.push(`${url}/${registrationControlId}/add-intake`);
                        else history.push('/dashboard/registration-periods');
                      }}
                      description={`${
                        user?.user_type === UserType.STUDENT
                          ? 'You have not been approved to any intake yet!'
                          : user?.user_type === UserType.INSTRUCTOR
                          ? 'You have not been enrolled to teach any intake yet!'
                          : "There haven't been any intakes added yet! try adding some from the button below."
                      }`}
                    />
                  )
                )}
              </section>

              <Switch>
                {/* add intake to reg control */}
                <Route
                  exact
                  path={`${path}/:id/add-intake`}
                  render={() => {
                    return (
                      <PopupMolecule
                        closeOnClickOutSide={false}
                        title="New intake"
                        open
                        onClose={handleClose}>
                        <NewIntake handleSuccess={intakeCreated} />
                      </PopupMolecule>
                    );
                  }}
                />
                <Route
                  exact
                  path={`${path}/:id/edit/:regid`}
                  render={() => {
                    return (
                      <PopupMolecule
                        closeOnClickOutSide={false}
                        title="Update intake"
                        open
                        onClose={handleClose}>
                        <UpdateIntake handleSuccess={handleClose} />
                      </PopupMolecule>
                    );
                  }}
                />
              </Switch>
            </div>
          );
        }}
      />
    </Switch>
  );
}
