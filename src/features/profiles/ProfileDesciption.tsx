import { useContext, useState } from 'react'
import { Button, Grid, GridColumn, Header, Tab } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileEditForm from './ProfileEditForm';

const ProfileDesciption = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, updateProfile, isCurrentUser } = rootStore.profileStore;

    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={`About ${profile!.displayName}`}
                    />
                    {
                        isCurrentUser && (
                            <Button
                                floated='right'
                                basic
                                content={editMode ? 'Cancel' : 'Edit Profile'}
                                onClick={() => setEditMode(!editMode)}
                            />
                        )
                    }
                </Grid.Column>
                <GridColumn width={16}>
                    {
                        editMode ? (
                            <ProfileEditForm
                                updateProfile={updateProfile}
                                profile={profile!}
                            />
                        ) : (
                            <span>{profile!.bio}</span>
                        )
                    }
                </GridColumn>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileDesciption