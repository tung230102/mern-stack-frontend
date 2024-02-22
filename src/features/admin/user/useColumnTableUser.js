import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Space } from "antd";
import useColumnSearch from "../useColumnSearch";

const useColumnTableUser = ({ users, handleOpenModal, handleOpenDrawer }) => {
  const getColumnSearchProps = useColumnSearch();

  const dataTable = users?.data?.map((user) => ({
    ...user,
    key: user._id,
    isAdmin: user.isAdmin ? "True" : "False",
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },

    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "120px",
      render: () => (
        <Space>
          <DeleteOutlined
            style={{ color: "red", fontSize: 24, cursor: "pointer" }}
            onClick={handleOpenModal}
          />
          <EditOutlined
            style={{ color: "orange", fontSize: 24, cursor: "pointer" }}
            onClick={handleOpenDrawer}
          />
        </Space>
      ),
    },
  ];

  return { dataTable, columns };
};

export default useColumnTableUser;
