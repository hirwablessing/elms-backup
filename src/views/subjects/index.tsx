import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';

import Button from '../../components/Atoms/custom/Button';
import Cacumber from '../../components/Molecules/Cacumber';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewLessonForm from '../../components/Organisms/forms/subjects/NewLessonForm';
import NewSubjectForm from '../../components/Organisms/forms/subjects/NewSubjectForm';
import { subjectStore } from '../../store/subject.store';
import { CommonCardDataType, Link } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';

export default function Subjects() {
  const [subjects, setSubjects] = useState<CommonCardDataType[]>([]);
  const { path } = useRouteMatch();
  const history = useHistory();

  const { isSuccess, data } = subjectStore.getSubjects();

  useEffect(() => {
    if (isSuccess && data?.data) {
      let loadedSubjects: CommonCardDataType[] = [];
      data.data.data.forEach((subject) => {
        let cardData: CommonCardDataType = {
          code: subject.title,
          description: subject.content,
          title: subject.module.name || `Subject ${subject.title}`,
          status: {
            type: advancedTypeChecker(subject.generic_status),
            text: subject.generic_status.toString(),
          },
        };
        loadedSubjects.push(cardData);
      });

      setSubjects(loadedSubjects);
    }
  }, [data]);

  function handleSearch() {}
  function handleClose() {
    history.goBack();
  }

  const list: Link[] = [
    { to: 'home', title: 'home' },
    { to: 'modules', title: 'modules' },
    { to: 'subjects', title: 'subjects' },
  ];

  return (
    <>
      <main className="px-4">
        <section>
          <Cacumber list={list}></Cacumber>
        </section>
        <section className="">
          <TableHeader totalItems={4} title="Subjects" handleSearch={handleSearch}>
            <Button onClick={() => history.push(`${path}/add`)}>Add Subject</Button>
          </TableHeader>
        </section>
        <section className="flex flex-wrap justify-between mt-2">
          {subjects.map((subject) => (
            <div key={subject.code} className="p-1 mt-3">
              <CommonCardMolecule
                data={subject}
                to={{ title: 'module', to: 'modules/id' }}
              />
            </div>
          ))}
        </section>

        <Switch>
          {/* add module popup */}
          <Route
            exact
            path={`${path}/add`}
            render={() => {
              return (
                <PopupMolecule title="New Subject" open onClose={handleClose}>
                  <NewSubjectForm />
                </PopupMolecule>
              );
            }}
          />

          {/* add prerequesite popup */}
          <Route
            exact
            path={`${path}/:id/add-lesson`}
            render={() => {
              return (
                <PopupMolecule title="Add lesson" open onClose={handleClose}>
                  <NewLessonForm />
                </PopupMolecule>
              );
            }}
          />
        </Switch>
      </main>
    </>
  );
}
