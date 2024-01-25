import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Space } from "antd";
import Title from "antd/es/typography/Title";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import DrawerForm from "../../../components/DrawerForm";
import * as Message from "../../../components/Message";
import TableForm from "../../../components/TableForm";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserService from "../../../services/UserService";
import Spinner from "../../../ui/Spinner";
import { getBase64 } from "../../../utils/helper";
import AdminFormUser from "./AdminFormUser";

const initialValue = () => ({
  name: "",
  email: "",
  phone: "",
  isAdmin: false,
  avatar: "",
  address: "",
});

function AdminUser() {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);

  const [form] = Form.useForm();

  const [stateUserDetails, setStateUserDetails] = useState(initialValue());

  //  Add user
  async function getAllUsers() {
    const res = await UserService.getAllUser();
    return res;
  }

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { isLoading, data: users } = queryUser;

  // End add user

  // Table
  // eslint-disable-next-line no-unused-vars
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

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
            onClick={() => setIsModalOpenDelete(true)}
          />
          <EditOutlined
            style={{ color: "orange", fontSize: 24, cursor: "pointer" }}
            onClick={() => setIsOpenDrawer(true)}
          />
        </Space>
      ),
    },
  ];
  // End Table

  // Details
  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (isOpenDrawer) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails, isOpenDrawer]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  function handleChangeDetails(e) {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUploadDetails({ fileList }) {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  }
  // End details

  // Update
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
  } = mutationUpdate;

  function onUpdateUser() {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  }

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetails(initialValue());
    form.resetFields();
  }, [setIsOpenDrawer, form]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      Message.success();
      // handleCancelDrawer();
    } else if (isSuccessUpdated && dataUpdated?.status === "ERR") {
      Message.error();
    }
  }, [isSuccessUpdated, dataUpdated, handleCancelDrawer]);
  // End update

  // Delete
  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
  } = mutationDeleted;

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      Message.success();
      setIsModalOpenDelete(false);
    } else if (isSuccessDeleted && dataDeleted?.status === "ERR") {
      Message.error();
    }
  }, [isSuccessDeleted, dataDeleted]);

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  // End delete

  // Delete many
  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const {
    data: dataDeletedMany,
    isPending: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
  } = mutationDeletedMany;

  const handleDeleteManyUsers = (ids) => {
    console.log(ids);
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      Message.success();
    } else if (isSuccessDeletedMany && dataDeletedMany?.status === "ERR") {
      Message.error();
    }
  }, [isSuccessDeletedMany, dataDeletedMany]);
  // End delete many

  return (
    <div>
      <Title level={4}>AdminUser</Title>

      {isLoadingDeletedMany ? (
        <Spinner />
      ) : (
        <TableForm
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          dataSource={dataTable}
          isLoading={isLoading}
          onRow={(record) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      )}

      <DrawerForm
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      >
        <AdminFormUser
          onFinish={onUpdateUser}
          form={form}
          state={stateUserDetails}
          onChange={handleChangeDetails}
          onUpLoad={handleUploadDetails}
          disabled={isLoadingUpdate || isLoadingUpdated}
          onCancel={() => setIsOpenDrawer(false)}
        />
      </DrawerForm>

      <Modal
        forceRender
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteUser}
      >
        {isLoadingDeleted ? (
          <Spinner />
        ) : (
          <div>Bạn có muốn xóa người dung này không?</div>
        )}
      </Modal>
    </div>
  );
}

export default AdminUser;
