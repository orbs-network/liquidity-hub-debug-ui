import styled from "styled-components";
import _ from "lodash";
import { ColumnFlex } from "styles";
import { Tag, Modal, Typography } from "antd";
import { useState } from "react";

const handleValue = (value: any) => {
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return "";
    }
  }

  return value;
};

export const LogModal = ({
  log,
  title,
}: {
  title: string;
  log: { [key: string]: any };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <StyledTag onClick={() => setIsModalOpen(true)}>{title}</StyledTag>
      <Modal
      title={title}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        style={{ top:40 }}
        
      >
        <Container>
          {Object.keys(log).map((key) => {
            return (
              <StyledModalRowTitle key={key}>
                <strong>{key}:</strong> {handleValue(log[key])}
              </StyledModalRowTitle>
            );
          })}
        </Container>
      </Modal>
    </>
  );
};

const Container = styled(ColumnFlex)`
  width: 100%;
  max-height: 80vh;
  justify-content: flex-start;
  overflow-y: auto;
`;

const StyledTag = styled(Tag)`
  cursor: pointer;
`;

const StyledModalRowTitle = styled(Typography)`
  width: 100%;
  strong {
    font-weight: 600;
  }
`;
