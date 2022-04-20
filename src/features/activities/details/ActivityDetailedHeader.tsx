import { observer } from 'mobx-react-lite';
import React from 'react'
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import styled from 'styled-components';
import { IActivity } from '../../../app/models/activity';

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
                                <p>{activity.date}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </SegmentStyled>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal'>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button color='orange' floated='right'>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    )
}

export default observer(ActivityDetailedHeader)