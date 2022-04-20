import React from 'react';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import NavBar from '../../features/nav/NavBar';
import styled from 'styled-components';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';

const ContainerStyled = styled(Container)`
  margin-top: 7em;
`;

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
    <ToastContainer position="bottom-right" />
      <Route path='/' exact component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <NavBar />
          <ContainerStyled>
            <Switch>
              <Route path='/activities' exact component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route
                path={['/createActivity', '/manage/:id']}
                key={location.key}
                component={ActivityForm}
              />
              <Route component={NotFound} />
            </Switch>
          </ContainerStyled>
        </>
      )}
      />
    </>
  );
}

export default withRouter(observer(App));