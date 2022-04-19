import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import styled from 'styled-components';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agents from '../api/agents';
import LoadingComponent from './LoadingComponent';

const ContainerStyled = styled(Container)`
  margin-top: 7em;
`;

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const hanleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agents.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agents.Activities.update(activity)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agents.Activities.delete(id)
      .then(() => setActivities([...activities.filter(a => a.id !== id)]))
      .then(() => setSubmitting(false));
  }

  useEffect(() => {
    agents.Activities.list()
      .then((response) => {
        let activities: IActivity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity)
        });
        setActivities(activities)
      })
      .then(() => setLoading(false))
  }, []);

  if (loading) return <LoadingComponent content='Loading activities...' />

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <ContainerStyled>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={hanleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </ContainerStyled>
    </>
  );
}

export default App;