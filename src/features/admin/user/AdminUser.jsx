import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Form, Modal } from "antd";
import Title from "antd/es/typography/Title";

import DrawerForm from "../../../components/DrawerForm";
import * as Message from "../../../components/Message";
import Spinner from "../../../components/Spinner";
import TableForm from "../../../components/TableForm";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserService from "../../../services/UserService";
import { getBase64 } from "../../../utils/helper";
import useUser from "../useUser";
import AdminFormUser from "./AdminFormUser";
import useColumnTableUser from "./useColumnTableUser";

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
  const queryUser = useUser();

  const { isLoading, data: users } = queryUser;

  // End add user

  // Table
  function handleOpenModal() {
    setIsModalOpenDelete(true);
  }
  function handleOpenDrawer() {
    setIsOpenDrawer(true);
  }
  const { columns, dataTable } = useColumnTableUser({
    users,
    handleOpenModal,
    handleOpenDrawer,
  });
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

  function handleUpdateUser() {
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
      handleCancelDrawer();
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
          onFinish={handleUpdateUser}
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
        title="Delete User"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteUser}
      >
        {isLoadingDeleted ? (
          <Spinner />
        ) : (
          <div>Do you want to delete this user?</div>
        )}
      </Modal>
    </div>
  );
}

export default AdminUser;
