import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewVenue from '../../components/Organisms/schedule/venue/NewVenue';
import useAuthenticator from '../../hooks/useAuthenticator';
import { getAllVenues } from '../../store/timetable/venue.store';
import { UserType } from '../../types/services/user.types';

export default function Venues() {
  const history = useHistory();
  const { path } = useRouteMatch();

  const { user } = useAuthenticator();

  const handleClose = () => {
    history.goBack();
  };

  const { data, isLoading } = getAllVenues(user?.academy.id + '');
  const venues = data?.data.data;

  return (
    <div>
      <TableHeader totalItems={0} title={'Venues'} showBadge={false}>
        {user?.user_type != UserType.STUDENT && (
          <Link to={`/dashboard/schedule/venues/new`}>
            <Button>New venue</Button>
          </Link>
        )}
      </TableHeader>
      {isLoading ? (
        <Loader />
      ) : venues?.length === 0 ? (
        <NoDataAvailable
          title={'No venues registered'}
          description={
            'No venues registered so far. Please register one with button below'
          }
          buttonLabel="New venue"
          handleClick={() => history.push(`${path}/new`)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues?.map((event) => (
            <div
              key={event.id}
              className="bg-main rounded-md p-4 border-1 border-transparent hover:border-primary-500 cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="semibold">
                {event.venue_type}
              </Heading>
              <Heading className="pt-6" fontSize="sm" fontWeight="bold">
                {event.name}
              </Heading>
            </div>
          ))}
        </div>
      )}
      <Switch>
        <Route
          exact
          path={`${path}/new`}
          render={() => (
            <PopupMolecule title="New venue" open onClose={handleClose}>
              <NewVenue />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
