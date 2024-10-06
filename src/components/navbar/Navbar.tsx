import { Link } from "react-router-dom";
import { RowFlex } from "../../styles";
import { SearchSession } from "./SearchSession";
import styled from "styled-components";
import lh from '../../assets/lh-round-trans.png';
export const Navbar = () => {
  return (
    <Container>
      <div style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
        <img src={lh} alt="LH Logo" style={{ height: '64px' }} />
        <span style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          fontFamily: "'Orbitron', sans-serif",
          background: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginLeft: '15px',
          textShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
        }}>
          Liquidity Hub
        </span>
        </div>
        <Link to='/' style={{ height: '80px', display: 'flex', alignItems: 'center' }}>🏠</Link>
        <Link to='/public' style={{ height: '80px', display: 'flex', alignItems: 'center' }}>👥</Link>
        <SearchSession />
    </Container>
  );
};


const Container = styled(RowFlex)`
    justify-content: space-between;
`
