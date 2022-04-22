import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';

const ActivityList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { activitiesByDate } = rootStore.activityStore;

    return (
        <>
            {
                activitiesByDate.map(([group, activities]) => (
                    <Fragment key={group} >
                        <Label size='large' color='blue'>
                            {format(Date.parse(group), 'eeee do MMMM')}
                        </Label>
                        <Item.Group divided>
                            {
                                activities.map((activity) => (
                                    <ActivityListItem key={activity.id} activity={activity} />
                                ))
                            }
                        </Item.Group>
                    </Fragment>
                ))
            }
        </>

    )
}

export default observer(ActivityList)