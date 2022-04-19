import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import styled from 'styled-components';

const ContainerStyled = styled(Container)`
  margin-top: 7em;
`;

const HomePage = () => {
  return (
    <ContainerStyled>
      <h1>Home page</h1>
      <h3>Go to <Link to='/activities'>Activities</Link></h3>
    </ContainerStyled>
  )
}

export default HomePage