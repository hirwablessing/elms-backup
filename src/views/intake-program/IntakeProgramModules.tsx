import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import AddCard from '../../components/Molecules/cards/AddCard';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import { moduleStore } from '../../store/modules.store';
import { CommonCardDataType } from '../../types';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import { advancedTypeChecker } from '../../utils/getOption';
import NewIntakeProgramLevel from './NewIntakeProgramLevel';

function IntakeProgramModules() {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const [programModules, setProgramModules] = useState<CommonCardDataType[]>([]);
  const { id, intakeProg } = useParams<IntakeProgParam>();

  const getAllModuleStore = moduleStore.getModulesByProgram(id);

  useEffect(() => {
    let newModules: CommonCardDataType[] = [];
    getAllModuleStore.data?.data.data.forEach((module) => {
      newModules.push({
        status: {
          type: advancedTypeChecker(module.generic_status),
          text: module.generic_status.toString(),
        },
        id: module.id,
        code: module.code,
        title: module.name,
        description: module.description,
        subTitle: `total subject: ${module.total_num_subjects || 'None'}`,
      });
    });

    setProgramModules(newModules);
  }, [getAllModuleStore.data?.data.data, id]);
  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={() => {
          return (
            <Tabs>
              <Tab label="Overview">
                <div className="text-right">
                  <Link to={`${url}/${id}/${intakeProg}/add-level`}>
                    <Button>Add Level</Button>
                  </Link>
                </div>
                <section className="mt-4 flex flex-wrap justify-start gap-4">
                  {programModules.length <= 0 ? (
                    <NoDataAvailable
                      buttonLabel="Add new modules"
                      title={'No Modules available in this program'}
                      handleClick={() => history.push(`${url}/modules/add`)}
                      description="And the web just isnt the same without you. Lets get you back online!"
                    />
                  ) : (
                    <>
                      <AddCard
                        title={'Add new module'}
                        onClick={() =>
                          history.push(`/dashboard/programs/${id}/modules/add`)
                        }
                      />
                      {programModules?.map((module) => (
                        <ModuleCard course={module} key={module.code} />
                      ))}
                    </>
                  )}
                </section>
              </Tab>
              <Tab label="Level 1">
                <section className="mt-4 flex flex-wrap justify-start gap-4">
                  {programModules.length <= 0 ? (
                    <NoDataAvailable
                      buttonLabel="Add new modules"
                      title={'No Modules available in this program'}
                      handleClick={() => history.push(`${url}/modules/add`)}
                      description="And the web just isnt the same without you. Lets get you back online!"
                    />
                  ) : (
                    <>
                      <AddCard
                        title={'Add new module'}
                        onClick={() =>
                          history.push(`/dashboard/programs/${id}/modules/add`)
                        }
                      />
                      {programModules?.map((module) => (
                        <ModuleCard course={module} key={module.code} />
                      ))}
                    </>
                  )}
                </section>
              </Tab>
            </Tabs>
          );
        }}
      />
      <Route
        exact
        path={`${path}/:id/:intakeProg/add-level`}
        render={() => (
          <PopupMolecule
            title="Add levels to program intake"
            open
            closeOnClickOutSide={false}
            onClose={history.goBack}>
            <NewIntakeProgramLevel />
          </PopupMolecule>
        )}
      />
    </Switch>
  );
}

export default IntakeProgramModules;