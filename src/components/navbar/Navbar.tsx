import { Link } from "react-router-dom";
import { RowFlex } from "../../styles";
import { SearchSession } from "./SearchSession";
import styled from "styled-components";
import lh from "../../assets/lh-round-trans.png";
import { ChainSelect } from "./ChainSelect";
import { Card } from "components/Card";

export const Navbar = () => {
  return (
    <Container>

      <Content>
        <StyledLogo to="/">
          <img src={lh} alt="LH Logo" />
          <span>Liquidity Hub</span>
        </StyledLogo>
        <StyledRight>
          <SearchSession />
          <ChainSelect />
        </StyledRight>
      </Content>

    </Container>
  );
};

const StyledRight = styled(RowFlex)({
  flex: 1,
  justifyContent: "flex-end",
});

const StyledLogo = styled(Link)({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  justifyContent: "flex-start",
  img: {
    width: "40px",
    height: "40px",
  },
  span: {
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "'Orbitron', sans-serif",
    background: "linear-gradient(45deg, #8A2BE2, #9370DB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 10px rgba(138, 43, 226, 0.5)",
  },
});

const Container = styled(RowFlex)`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  z-index: 1;
  padding:0px 30px;
  background:#F8F9fb;

`;

const Content = styled(Card)({
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  display: "flex",
  alignItems: "center",
  height: "100%",
  padding:'20px 30px',
  marginTop: 10,
});
