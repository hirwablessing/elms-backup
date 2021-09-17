import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ComponentsUseCase from './components/Organisms/ComponentsUseCase';
import RegistrationControl from './components/Organisms/registrationControl/RegistrationControl';
import SignUpForm from './components/Organisms/signup/SignUpForm';
import Dashboard from './layout/Dashboard';
import Academies from './views/academies/Academies';
import NewAcademy from './views/academies/NewAcademy';
import FacultiesView from './views/faculties/Faculties';
import Modules from './views/modules';
import NotFound from './views/NotFound';
import Popup from './views/Popup';
import Signin from './views/signin/Signin';
import Subjects from './views/subjects';
import NewInstructorView from './views/users/NewInstructor';
import NewStudentsView from './views/users/NewStudent';
import UsersView from './views/users/Users';

const App = () => {
  const Homepage = () => {
    return (
      <Dashboard>
        <ComponentsUseCase />
      </Dashboard>
    );
  };

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />

          <Route exact path="/register" component={SignUpForm} />
          <Route path="/login" component={Signin} />

          <Route exact path="/academies" component={Academies} />
          <Route exact path="/academies/new" component={NewAcademy} />
          <Route exact path="/users" component={UsersView} />
          <Route exact path="/popup" component={Popup} />
          <Route exact path="/modules" component={Modules} />
          <Route exact path="/subjects" component={Subjects} />
          <Route exact path="/registration-control" component={RegistrationControl} />
          <Route exact path="/users/students/new" component={NewStudentsView} />
          <Route exact path="/users/instructors/new" component={NewInstructorView} />
          <Route exact path="/faculties" component={FacultiesView} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
