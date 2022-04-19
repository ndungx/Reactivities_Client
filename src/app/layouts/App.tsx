import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import NavBar from '../../features/nav/NavBar';
import styled from 'styled-components';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const ContainerStyled = styled(Container)`
  margin-top: 7em;
`;

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent content='Loading activities...' />
  }

  return (
    <>
      <NavBar />
      <ContainerStyled>
        <ActivityDashboard />
      </ContainerStyled>
    </>
  );
}

export default observer(App);