import { Tab } from 'semantic-ui-react'
import ProfileActivities from './ProfileActivities';
import ProfileDesciption from './ProfileDesciption';
import ProfileFollowings from './ProfileFollowing';
import ProfilePhotos from './ProfilePhotos';

const panes = [
    { menuItem: 'About', render: () => <ProfileDesciption /> },
    { menuItem: 'Photos', render: () => <ProfilePhotos /> },
    { menuItem: 'Activities', render: () => <ProfileActivities /> },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> },
];

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default ProfileContent