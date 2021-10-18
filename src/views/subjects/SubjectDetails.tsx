import React from 'react';
import {
  Link as BrowserLink,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Panel from '../../components/Atoms/custom/Panel';
import Heading from '../../components/Atoms/Text/Heading';
import Accordion from '../../components/Molecules/Accordion';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import NewLessonForm from '../../components/Organisms/forms/subjects/NewLessonForm';
import { lessonStore } from '../../store/lesson.store';
import { subjectStore } from '../../store/subject.store';
import { Link } from '../../types';

interface ParamType {
  id: string;
  subjectId: string;
}

export default function SubjectDetails() {
  const { id, subjectId } = useParams<ParamType>();
  const { url } = useRouteMatch();
  const history = useHistory();

  const subjectData = subjectStore.getSubject(subjectId);
  const { data, isLoading } = lessonStore.getLessonsBySubject(subjectId);
  const lessons = data?.data.data || [];

  const list: Link[] = [
    { to: 'home', title: 'home' },
    { to: 'programs', title: 'Programs' },
    { to: 'modules', title: 'Modules' },
    { to: id, title: 'Modules details' },
    { to: '/', title: 'Subjects' },
    {
      to: subjectData.data?.data.data.id + '',
      title: subjectData.data?.data.data.title + '',
    },
  ];

  const goBack = () => {
    history.goBack();
  };

  return (
    <main className="px-4">
      <section>
        <BreadCrumb list={list} />
      </section>
      <div className="md:flex pt-4 md:pt-11">
        <div className="w-44">
          <button className="outline-none" onClick={goBack}>
            <Icon name={'back-arrow'} bgColor="gray" />
          </button>
        </div>
        <div className="pt-4 md:pt-0">
          <Heading fontSize="2xl" fontWeight="semibold">
            {subjectData.data?.data.data.title}
          </Heading>
          <Heading fontSize="base" color="gray" className="py-4" fontWeight="medium">
            {lessons.length + ' lessons'}
          </Heading>
          <p className="w-10/12 text-base">{subjectData.data?.data.data.content}</p>
          <div className="py-6">
            {isLoading ? (
              <Loader />
            ) : lessons.length === 0 ? (
              <NoDataAvailable
                title={'No lessons available'}
                description={
                  'A lesson or class is a structured period of time where learning is intended to occur. It involves one or more students being taught by a teacher or instructor.'
                }
                handleClick={() => history.push(`${url}/add-lesson`)}
              />
            ) : (
              <>
                <div className="flex justify-between">
                  <Heading
                    fontWeight="semibold"
                    color="primary"
                    fontSize="base"
                    className="underline">
                    Lessons ({lessons.length})
                  </Heading>
                  <BrowserLink to={`${url}/add-lesson`}>
                    <Button>New lesson</Button>
                  </BrowserLink>
                </div>
                <Heading fontSize="base" className="mb-6" fontWeight="semibold">
                  Ongoing Lessons
                </Heading>
                <Accordion>
                  {lessons.map((les) => {
                    return (
                      <Panel bgColor="main" key={les.id} title={les.title}>
                        <div className="md:w-10/12 lg:w-2/3">
                          <p className="font-medium text-gray-600 text-sm">
                            {les.content}
                          </p>
                        </div>
                      </Panel>
                    );
                  })}
                </Accordion>
              </>
            )}
          </div>
        </div>
      </div>
      <Switch>
        {/* add lesson popup */}
        <Route
          exact
          path={`${url}/add-lesson`}
          render={() => {
            return (
              <PopupMolecule title="Add lesson" open onClose={goBack}>
                <NewLessonForm />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </main>
  );
}
