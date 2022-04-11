import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { moduleService } from '../../../services/administration/modules.service';
import { evaluationService } from '../../../services/evaluation/evaluation.service';
import { IEvaluationInfo, IModules } from '../../../types/services/evaluation.types';
import Button from '../../Atoms/custom/Button';
import Loader from '../../Atoms/custom/Loader';
import PopupMolecule from '../../Molecules/Popup';
import TabNavigation, { TabType } from '../../Molecules/tabs/TabNavigation';
import ModuleSubjectQuestion from './ModuleSubjectQuestion';

interface IProps {
  evaluation: IEvaluationInfo;
  showSetQuestions: boolean;
  showActions?: boolean;
}

export default function EvaluationContentSectionBased({
  evaluation,
  showSetQuestions,
  showActions,
}: IProps) {
  const { path, url } = useRouteMatch();
  const [showPopup, setShowPopup] = useState(false);
  const [modules, setModules] = useState<IModules[]>([]);
  const [tabs, setTabs] = useState<TabType[]>([]);

  const [isLoadingModule, setIsLoadingModules] = useState(true);

  useEffect(() => {
    async function createTabs() {
      if (modules.length < 1) return;

      setIsLoadingModules(true);

      let allTabs: TabType[] = [];

      try {
        for (const mod of modules) {
          const subjects = await evaluationService.getEvaluationModuleSubjectsByModule(
            evaluation.id,
            mod.id,
          );

          allTabs.push({
            label: `${mod.module}`,
            href: `${url}/${mod.id}/${subjects.data.data[0].subject_academic_year_period}`,
          });
        }
      } catch (error) {
        return;
      }

      // remove duplicated from tabs base on tab.label
      allTabs = allTabs.filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.label === value.label && t.href === value.href),
      );

      setTabs(allTabs);
      setIsLoadingModules(false);
    }
    createTabs();
  }, [evaluation.id, modules]);

  useEffect(() => {
    let filteredModules: IModules[] = [];

    async function getModules() {
      if (
        evaluation?.evaluation_module_subjects &&
        evaluation.evaluation_module_subjects.length > 0
      ) {
        for (const subj of evaluation.evaluation_module_subjects) {
          const moduleData = await moduleService.getModuleById(
            subj.intake_program_level_module.toString(),
          );

          let temp = {
            id: '',
            module: '',
          };
          temp.module = moduleData.data.data.name;
          temp.id = moduleData.data.data.id.toString();
          filteredModules.push(temp);
        }

        setModules(filteredModules);
      }
    }

    getModules();
  }, [evaluation?.evaluation_module_subjects]);

  return (
    <div className="py-4">
      {/* tabs here */}
      {isLoadingModule ? (
        <Loader />
      ) : modules.length != 0 ? (
        <TabNavigation tabs={tabs}>
          <Switch>
            <Route
              exact
              path={`${path}/:moduleId/:subjectId`}
              render={() => (
                <ModuleSubjectQuestion
                  showSetQuestions={showSetQuestions}
                  showActions={showActions}
                />
              )}
            />
          </Switch>
        </TabNavigation>
      ) : (
        <p>No sections available in this evaluation</p>
      )}

      <PopupMolecule
        open={showPopup}
        title="Add private attendee"
        onClose={() => setShowPopup(false)}>
        {evaluation?.private_attendees && evaluation?.private_attendees.length > 0 ? (
          evaluation?.private_attendees.map((attendee) => (
            <p className="py-2" key={attendee.id}>
              Attendees will go here
            </p>
          ))
        ) : (
          <p className="py-2">No private attendees</p>
        )}
        <Button onClick={() => setShowPopup(false)}>Done</Button>
      </PopupMolecule>
    </div>
  );
}
