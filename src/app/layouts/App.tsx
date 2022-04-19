import React from 'react';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import NavBar from '../../features/nav/NavBar';
import styled from 'styled-components';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const ContainerStyled = styled(Container)`
  margin-top: 7em;
`;

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <Route path='/' exact component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <NavBar />
          <ContainerStyled>
            <Route path='/activities' exact component={ActivityDashboard} />
            <Route path='/activities/:id' component={ActivityDetails} />
            <Route
              path={['/createActivity', '/manage/:id']}
              key={location.key}
              component={ActivityForm}
            />
          </ContainerStyled>
        </>
      )}
      />
    </>
  );
}

export default withRouter(observer(App));