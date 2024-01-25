import { Checkbox, Rate } from "antd";
import styled from "styled-components";

export const StyledLabelText = styled.h4`
  color: rgb(56, 56, 61);
  font-size: 14px;
  font-weight: 500;
`;

export const StyledTextValue = styled.span`
  color: rgb(56, 56, 61);
  font-size: 12px;
  font-weight: 400;
`;

export const StyledContent = styled.div`
  display: flex;
  // align-items: center;
  flex-direction: column;
  gap: 12px;
`;

export const StyledTextPrice = styled.div`
  padding: 4px;
  color: rgb(56, 56, 61);
  border-radius: 10px;
  background-color: rgb(238, 238, 238);
  width: fit-content;
`;

function NavBar() {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => {
          return <StyledTextValue key={index}>{option}</StyledTextValue>;
        });

      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option, index) => {
              return (
                <Checkbox
                  key={index}
                  style={{ marginLeft: 0 }}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <Rate
                style={{ fontSize: "12px" }}
                disabled
                defaultValue={option}
              />
              <span> {`tu ${option}  sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option, index) => {
          return <StyledTextPrice key={index}>{option}</StyledTextPrice>;
        });
      default:
        return {};
    }
  };

  return (
    <div>
      <StyledLabelText>Nav</StyledLabelText>
      <StyledContent>
        {renderContent("text", ["Tu lanh", "TV", "MAYGIAT"])}
        {renderContent("checkbox", [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ])}
        {renderContent("star", [1, 2, 3, 4, 5])}
        {renderContent("price", ["100000", "200000", "300000"])}
      </StyledContent>
    </div>
  );
}

export default NavBar;
