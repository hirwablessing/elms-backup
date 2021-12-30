import React, { useEffect } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CardHeadMolecule from '../../components/Molecules/CardHeadMolecule';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import Tooltip from '../../components/Molecules/Tooltip';
import {
  getProgramsByIntake,
  intakeStore,
} from '../../store/administration/intake.store';
import { Link as LinkList } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';
import { IProgramData } from '../programs/AcademicPrograms';
import AddAcademicProgramToIntake from '../programs/AddAcademicProgramToIntake';
import NewAcademicProgram from '../programs/NewAcademicProgram';
import UpdateAcademicProgram from '../programs/UpdateAcademicProgram';
import IntakeProgramDetails from './IntakeProgramDetails';
import NewIntakeLevelModule from './NewIntakeLevelModule';
import NewIntakeProgramLevel from './NewIntakeProgramLevel';

export interface ParamType {
  intakeId: string;
}

function IntakePrograms() {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const { intakeId } = useParams<ParamType>();
  const location = useLocation();
  const list: LinkList[] = [
    { to: 'home', title: 'home' },
    { to: 'intakes', title: 'intakes' },
    { to: `${url}`, title: 'Programs' },
  ];

  const { data, refetch, isLoading } = getProgramsByIntake(intakeId);

  const programInfo = data?.data.data || [];

  const intake = intakeId ? intakeStore.getIntakeById(intakeId!, true) : null;

  useEffect(() => {
    if (location.pathname === path || location.pathname === `${path}/`) {
      refetch();
    }
  }, [location]);

  let programs: IProgramData[] = [];

  programInfo?.map((pg) => {
    let prog = pg.program;
    let program: IProgramData = {
      id: prog.id,
      status: {
        type: advancedTypeChecker(prog.generic_status),
        text: prog.generic_status.toString(),
      },
      code: prog.code,
      title: prog.name,
      subTitle: prog.type.replaceAll('_', ' '),
      description: prog.description,
      department: prog.department,
      total_num_modules: prog.total_num_modules,
      // incharge: prog.incharge && prog.incharge.user.username,
    };

    programs.push(program);
  });

  function submited() {
    refetch();
    history.goBack();
  }

  return (
    <main className="px-4">
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={() => {
            return (
              <>
                <section>
                  <BreadCrumb list={list} />
                </section>
                <section>
                  <TableHeader
                    totalItems={programs.length}
                    title={`${intakeId ? intake?.data?.data.data.title : 'Programs'}`}
                    showSearch={false}>
                    <Link to={`${url}/add-program-to-intake?intakeId=${intakeId}`}>
                      <Button>Add Program To Intake</Button>
                    </Link>
                  </TableHeader>
                </section>
                <section className="flex flex-wrap justify-start gap-2 mt-2">
                  {programs.length === 0 && isLoading ? (
                    <Loader />
                  ) : programs.length > 0 ? (
                    programs.map((Common, index: number) => (
                      <Tooltip
                        key={Common.code}
                        trigger={
                          <div className="p-1 mt-3">
                            <CommonCardMolecule
                              className="cursor-pointer"
                              data={Common}
                              handleClick={() =>
                                history.push(
                                  `${url}/${Common.id}/${programInfo[index].id}`,
                                )
                              }
                            />
                          </div>
                        }
                        open>
                        <div className="w-96">
                          <CardHeadMolecule
                            title={Common.title}
                            code={Common.code}
                            status={Common.status}
                            description={''}
                          />

                          {/* first column */}

                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                {Common.department.division_type}
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.department.name}
                              </Heading>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                Modules
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.total_num_modules || 0}
                              </Heading>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                Program Type
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.subTitle}
                              </Heading>
                            </div>
                            {/* <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                Instructor in charge
                              </Heading>
                              <div className="flex items-center">
                                <div className="">
                                  <Avatar
                                    size="24"
                                    alt="user1 profile"
                                    className=" rounded-full  border-2 border-main transform hover:scale-125"
                                    src="https://randomuser.me/api/portraits/men/1.jpg"
                                  />
                                </div>
                                <Heading fontSize="sm" fontWeight="semibold">
                                  {Common.incharge}
                                </Heading>
                              </div>
                            </div> */}
                          </div>

                          {/* remarks section */}
                          <div className="flex flex-col mt-8 gap-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Remarks
                            </Heading>
                            <Heading fontSize="sm" color="txt-secondary">
                              {Common.description}
                            </Heading>
                          </div>
                          <div className="my-4">
                            <Link
                              to={`/dashboard/schedule/programs/${intakeId}/${Common.id}/edit`}>
                              <Button styleType="text">View schedule</Button>
                            </Link>
                          </div>
                          <div className="space-x-4">
                            <Link
                              to={`/dashboard/intakes/programs/${intakeId}/${Common.id}/edit`}>
                              <Button>Edit program</Button>
                            </Link>
                            <Button styleType="outline">Change Status</Button>
                          </div>
                        </div>
                      </Tooltip>
                    ))
                  ) : (
                    <NoDataAvailable
                      icon="program"
                      buttonLabel="Add new program to intake"
                      title={'No program available in this intake'}
                      handleClick={() =>
                        history.push(`${url}/add-program-to-intake?intakeId=${intakeId}`)
                      }
                      description="There are no programs added yet, click on the below button to add some!"
                    />
                  )}
                </section>
              </>
            );
          }}
        />
        {/* add academic program to intake*/}
        <Route
          exact
          path={`${url}/add-program-to-intake`}
          render={() => {
            return (
              <PopupMolecule title="Programs" open={true} onClose={history.goBack}>
                <AddAcademicProgramToIntake submited={submited} />
              </PopupMolecule>
            );
          }}
        />

        {/* create academic program */}
        <Route
          exact
          path={`${path}/add`}
          render={() => {
            return <NewAcademicProgram />;
          }}
        />
        {/* add levels to intake program */}
        <Route
          exact
          path={`${path}/:id/:intakeProg/add-level`}
          render={() => <NewIntakeProgramLevel />}
        />
        {/* add module to intake program level */}
        <Route
          exact
          path={`${path}/:id/:intakeProg/:level/add-module`}
          render={() => <NewIntakeLevelModule />}
        />

        {/* modify academic program */}
        <Route path={`${path}/:id/edit`} render={() => <UpdateAcademicProgram />} />

        {/* show intake academic program details */}
        <Route path={`${path}/:id/:intakeProg`} render={() => <IntakeProgramDetails />} />
      </Switch>
    </main>
  );
}

export default IntakePrograms;
