import { Link } from "react-router-dom";
import { RowFlex } from "../../styles";
import { SearchSession } from "./SearchSession";
import styled from "styled-components";
export const Navbar = () => {
  return (
    <Container>
        <Link to='/'>Home</Link>
      <SearchSession />
    </Container>
  );
};


const Container = styled(RowFlex)`
    justify-content: space-between;
`
