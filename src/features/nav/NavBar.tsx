import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Menu, Image } from 'semantic-ui-react'
import styled from 'styled-components';
import { RootStoreContext } from '../../app/stores/rootStore';

const MenuStyled = styled(Menu)`
    background-image: linear-gradient( 
        135deg, 
        rgb(24, 42, 115) 0%, 
        rgb(33, 138, 174) 69%, 
        rgb(32, 167, 172) 89%
    ) !important;
`

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout } = rootStore.userStore;

    return (
        <MenuStyled fixed='top' inverted>
            <Container>
                <Menu.Item header exact as={NavLink} to='/'>
                    <img src='../assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities' />
                <Menu.Item>
                    <Button
                        as={NavLink} to='/createActivity'
                        positive
                        content='Create Activity'
                    />
                </Menu.Item>
                {
                    user && (
                        <Menu.Item position='right'>
                            <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
                            <Dropdown pointing='top left' text={user.displayName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        as={Link}
                                        to={`/profile/${user.username}`}
                                        text='My profile'
                                        icon='user'
                                    />
                                    <Dropdown.Item
                                        onClick={logout}
                                        text='Logout'
                                        icon='power'
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    )
                }
            </Container>
        </MenuStyled>
    )
}

export default observer(NavBar)