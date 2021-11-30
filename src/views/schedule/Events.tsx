import React from 'react';
import Badge from '../../components/Atoms/custom/Badge';
import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewEvent from '../../components/Organisms/calendar/NewEvent';
import { eventStore } from '../../store/timetable/event.store';

import { Route, Link, Switch, useHistory, useRouteMatch } from 'react-router-dom';

export default function Events() {
  const events = eventStore.getAllEvents().data?.data.data;
  const history = useHistory();
  const { path } = useRouteMatch();

  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <TableHeader totalItems={0} title={'Events'} showBadge={false}>
        <Link to={`${path}/new`}>
          <Button>New Event</Button>
        </Link>
      </TableHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div
            key={event.id}
            className="bg-main rounded-md py-5 px-6 border-2 border-transparent hover:border-primary-500 cursor-pointer">
            <div className="flex justify-between">
              <Badge badgecolor={'info'}>
                <span className="text-primary-500">{event.event_category}</span>
              </Badge>
              <Heading color="primary" fontWeight="bold" fontSize="sm">
                #{event.code}
              </Heading>
            </div>
            <div className="pt-6">
              <Heading fontSize="base" fontWeight="bold">
                {event.name}
              </Heading>
              <p className="py-2 text-sm text-txt-secondary font-medium">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Switch>
        <Route
          exact
          path={`${path}/new`}
          render={() => (
            <PopupMolecule title="New Event" open onClose={handleClose}>
              <NewEvent />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}