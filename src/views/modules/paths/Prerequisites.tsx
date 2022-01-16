import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router';

import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import ModuleCard from '../../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import { authenticatorStore } from '../../../store/administration';
import { moduleStore } from '../../../store/administration/modules.store';
import { CommonCardDataType, ParamType } from '../../../types';
import { UserType } from '../../../types/services/user.types';
import { advancedTypeChecker } from '../../../utils/getOption';
import NewModuleMaterial from '../../module-material/NewModuleMaterial';
import NewModuleMaterialAttach from '../../module-material/NewModuleMaterialAttach';

function Prerequisites() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { data: modulePrereqs, isLoading } = moduleStore.getModulePrereqsByModule(id);
  const [prerequisiteModule, setPrerequisiteModule] = useState<CommonCardDataType[]>([]);

  const authUser = authenticatorStore.authUser().data?.data.data;

  useEffect(() => {
    let newPrereqs: CommonCardDataType[] = [];
    modulePrereqs?.data.data.forEach((prereq) => {
      newPrereqs.push({
        status: {
          type: advancedTypeChecker(prereq.prerequisite.generic_status),
          text: prereq.prerequisite.generic_status.toString(),
        },
        id: prereq.prerequisite.id,
        code: prereq.prerequisite.code,
        title: prereq.prerequisite.name,
        description: prereq.description,
        subTitle: `total subject: ${prereq.prerequisite.total_num_subjects || 'None'}`,
      });
    });

    setPrerequisiteModule(newPrereqs);
  }, [modulePrereqs?.data.data]);

  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={() => (
          <div className="flex flex-col gap-4 z-0 pt-6">
            <div className="flex justify-between items-center">
              <Heading fontSize="base" fontWeight="semibold">
                Module Prerequisites ({modulePrereqs?.data.data.length || 0})
              </Heading>
            </div>

            {isLoading ? (
              <Loader />
            ) : prerequisiteModule.length === 0 ? (
              <NoDataAvailable
                showButton={authUser?.user_type === UserType.INSTRUCTOR}
                icon="subject"
                title={'No prerequisites are available'}
                description={'There are no prerequisites currently added on this module'}
                handleClick={() => history.push(`/dashboard/modules/${id}/add-prereq`)}
              />
            ) : (
              <section className="flex flex-wrap justify-start gap-2">
                {prerequisiteModule.map((prereq) => (
                  <ModuleCard key={prereq.id} course={prereq} />
                ))}
              </section>

              // <div className="pt-3 w-2/5">
              //   <Accordion>
              //     {modulePrerequisites.map((prereq) => {
              //       return (
              //         <Panel
              //           width="w-full"
              //           bgColor="main"
              //           key={prereq.id}
              //           title={prereq.prerequisite.name}
              //           //   badge={{
              //           //     text: prereq.type,
              //           //     type: MaterialType[prereq.type],
              //           //   }}
              //         >
              //           <div className="font-medium text-gray-600 text-sm py-4">
              //             <Tiptap
              //               editable={false}
              //               viewMenu={false}
              //               handleChange={() => {}}
              //               content={
              //                 prereq.prerequisite.description + ' ' + prereq.description
              //               }
              //             />
              //           </div>
              //         </Panel>
              //       );
              //     })}
              //   </Accordion>
              // </div>
            )}
          </div>
        )}
      />
      {/* show module details */}
      <Route
        exact
        path={`${path}/add-material`}
        render={() => {
          return <NewModuleMaterial />;
        }}
      />
      {/* show module details */}
      <Route
        exact
        path={`${path}/add-material/:materialId`}
        render={() => {
          return <NewModuleMaterialAttach />;
        }}
      />
    </Switch>
  );
}

export default Prerequisites;
