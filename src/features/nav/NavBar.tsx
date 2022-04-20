import { observer } from 'mobx-react-lite';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'
import styled from 'styled-components';

const MenuStyled = styled(Menu)`
    background-image: linear-gradient( 
        135deg, 
        rgb(24, 42, 115) 0%, 
        rgb(33, 138, 174) 69%, 
        rgb(32, 167, 172) 89%
    ) !important;
`

const NavBar: React.FC = () => {
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
            </Container>
        </MenuStyled>
    )
}

export default observer(NavBar)