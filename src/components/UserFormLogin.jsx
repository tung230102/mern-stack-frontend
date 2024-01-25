import { Form } from "antd";
import Title from "antd/es/typography/Title";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import SpinnerButton from "../ui/SpinnerButton";
import ButtonFullWidth from "./ButtonFullWidth";

const StyledApp = styled.div`
  border: 1px solid #ccc;
  width: 480px;
  margin: 40px auto 0;
  padding: 20px;
  border-radius: 8x;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.8);
`;

const StyledLink = styled.span`
  color: #1677ff;
  cursor: pointer;
  &:hover {
    color: #4096ff;
  }
`;

export function UserFormLogin({
  children,
  onFinish,
  isPending,
  text,
  data,
  onNavigate,
  spanLink,
  textLink,
}) {
  const navigate = useNavigate();

  return (
    <StyledApp>
      <Form onFinish={onFinish}>
        <Form.Item style={{ textAlign: "center" }}>
          <Title level={2}>{text}</Title>
        </Form.Item>

        {/* input */}
        {children}

        <Form.Item>
          <SpinnerButton isPending={isPending}>
            <ButtonFullWidth>{text}</ButtonFullWidth>
          </SpinnerButton>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <p style={{ paddingTop: "8px" }}>
            {spanLink}
            <StyledLink onClick={() => navigate(onNavigate)}>
              {textLink}
            </StyledLink>
          </p>
        </Form.Item>
      </Form>
    </StyledApp>
  );
}
