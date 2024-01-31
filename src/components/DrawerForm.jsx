import { Drawer } from "antd";

function DrawerForm({
  title = "Basic Drawer",
  placement,
  isOpen = false,
  children,
  ...rests
}) {
  return (
    <Drawer
      width="50%"
      placement={placement}
      open={isOpen}
      key={placement}
      {...rests}
    >
      {children}
    </Drawer>
  );
}

export default DrawerForm;
