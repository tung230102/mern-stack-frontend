import styled from "styled-components";

import Title from "antd/es/typography/Title";
import { useMoveBack } from "../hooks/useMoveBack";
import { Button } from "antd";

const StyledPageNotFound = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 3.2rem;
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <StyledPageNotFound>
      <Box>
        <Title level={2}>
          The page you are looking for could not be found 😢
        </Title>
        <Button onClick={moveBack} size="large">
          &larr; Go back
        </Button>
      </Box>
    </StyledPageNotFound>
  );
}

export default PageNotFound;
