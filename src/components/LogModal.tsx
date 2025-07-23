/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Modal } from "antd";
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
      <Tag onClick={() => setIsModalOpen(true)}>{title}</Tag>
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
        <div className="w-full max-h-[80vh] overflow-y-auto flex flex-col gap-2">
          {Object.keys(log).map((key) => {
            return (
              <div key={key}>
                <strong>{key}:</strong> {handleValue(log[key])}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};


