import { Link } from 'react-router-dom'
import { Button, Container, Header, Segment, Image } from 'semantic-ui-react'
import styled from 'styled-components';

const SegmentStyled = styled(Segment)`
  display: flex;
  align-items: center;
  background-image: linear-gradient( 135deg, rgb(24, 42, 115) 0%, rgb(33, 138, 174) 69%, rgb(32, 167, 172) 89%) !important;
  height: 100vh;
`

const HeaderOneStyled = styled(Header)`
  font-size: 4em;
  font-weight: normal;
`

const HeaderTwoStyled = styled(Header)`
  font-size: 1.7em;
  font-weight: normal;
`

const HomePage = () => {
  return (
    <SegmentStyled inverted textAlign='center' vertical className='masthead' >
      <Container text>
        <HeaderOneStyled inverted>
          <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
          Reactivities
        </HeaderOneStyled>
        <HeaderTwoStyled inverted content='Welcome to Reactivities' />
        <Button as={Link} to='/activities' size='huge' inverted style={{ maginLeft: '0.5em' }}>
          Take me to the activities!
        </Button>
      </Container>
    </SegmentStyled>
  )
}

export default HomePage