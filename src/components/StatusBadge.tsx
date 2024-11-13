import { swapStatusText } from "helpers";
import { styled } from "styled-components";
import { Check, X } from "react-feather";


const getBg = (swapStatus?: string) => {
  if (swapStatus === "success") return "#F0AD4E";
  if (swapStatus === "failed") return "red";
  return "transparent";
}

export const StatusBadge = ({ swapStatus, className = '' }: { swapStatus?: string, className?: string  }) => {

  return (
    <Container style={{ background: getBg(swapStatus) }} className={className}>
     <span>{swapStatusText(swapStatus)}</span>
    </Container>
  );
};

export const MobileStatusBadge = ({ swapStatus, className = '' }: { swapStatus?: string, className?: string  }) => {

  return (
    <MobileContainer style={{ background: getBg(swapStatus) }} className={className}>
     {swapStatus === 'success' ? <Check /> :swapStatus === 'failed' ? <X /> : null}
    </MobileContainer>
  );
};

const MobileContainer = styled("div")({
  padding: "5px",
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: {
    color:'white',
    width: 14,
    height: 14,
  }
});


const Container = styled("div")({
  padding: "6px 10px",
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p :{
    lineHeight: 'normal',
  },
  span: {
    color: "white",
    fontSize: 12,

  },
});
