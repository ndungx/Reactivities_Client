import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import styled from 'styled-components';
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityImageStyled = styled(Image)`
    filter: brightness(30%)
`

const SegmentStyled = styled(Segment)`
    position: absolute !important;
    bottom: 5%;
    left: 3%;
    width: 100%;
    height: auto;
    color: white;
`

const ActivityDetailedHeader: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const rootStore = useContext(RootStoreContext);
    const { attendActivity, cancelAttendance, loading } = rootStore.activityStore;
    const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <ActivityImageStyled src={`../assets/categoryImages/${activity.category}.jpg`} fluid />
                <SegmentStyled basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date, 'eeee do MMMM')}</p>
                                <p>
                                    Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </SegmentStyled>
            </Segment>
            <Segment clearing attached='bottom'>
                {
                    activity.isHost ? (
                        <Button as={Link} to={`/manage/${activity.id}`} color='orange' floated='right'>
                            Manage Event
                        </Button>
                    ) : activity.isGoing ? (
                        <Button
                            loading={loading}
                            onClick={cancelAttendance}
                        >
                            Cancel attendance
                        </Button>
                    ) : (
                        <Button
                            loading={loading}
                            onClick={attendActivity}
                            color='teal'
                        >
                            Join Activity
                        </Button>
                    )
                }
            </Segment>
        </Segment.Group>
    )
}

export default observer(ActivityDetailedHeader)