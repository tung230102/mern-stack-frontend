import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Space } from "antd";
import Title from "antd/es/typography/Title";

import DrawerForm from "../../../components/DrawerForm";
import * as Message from "../../../components/Message";
import Spinner from "../../../components/Spinner";
import TableForm from "../../../components/TableForm";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as ProductService from "../../../services/ProductService";
import {
  convertCurrencyStringToNumber,
  convertPrice,
  getBase64,
  renderOptions,
} from "../../../utils/helper";
import AdminFormProduct from "./AdminFormProduct";

const StyledButton = styled(Button)`
  height: 80px;
  width: 80px;
  border-radius: 8px;
  border-style: dashed;
  margin-right: 900px;
`;

const initialValue = () => ({
  name: "",
  price: "",
  description: "",
  rating: "",
  image: "",
  type: "",
  countInStock: "",
  newType: "",
  discount: "",
});

function AdminProduct() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);

  const [form] = Form.useForm();

  const [stateProduct, setStateProduct] = useState(initialValue());
  const [stateProductDetails, setStateProductDetails] = useState(
    initialValue()
  );

  const mutation = useMutationHook((data) => {
    const {
      countInStock,
      description,
      image,
      name,
      price,
      rating,
      type,
      sold,
      discount,
    } = data;
    const res = ProductService.createProduct({
      countInStock,
      description,
      image,
      name,
      price,
      rating,
      type,
      sold,
      discount,
    });
    return res;
  });
  const { data, isPending, isSuccess } = mutation;

  //  Add product
  async function getAllProducts() {
    const res = await ProductService.getAllProduct();
    return res;
  }

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { isLoading, data: products } = queryProduct;

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateProduct(initialValue());
    form.resetFields();
  }, [setIsModalOpen, form]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
      handleCancel();
    } else if (isSuccess && data?.status === "ERR") {
      Message.error();
    }
  }, [isSuccess, data, handleCancel]);

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  function handleChange(e) {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpload({ fileList }) {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  }
  // End add product

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

  const dataTable = products?.data?.map((product) => ({
    ...product,
    price: convertPrice(product.price),
    key: product._id,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => {
        return (
          convertCurrencyStringToNumber(a.price) -
          convertCurrencyStringToNumber(b.price)
        );
      },
      filters: [
        {
          text: ">= 20.000.000",
          value: ">=",
        },
        {
          text: "<= 20.000.000",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        const price = convertCurrencyStringToNumber(record.price);
        if (value === ">=") {
          return price >= 20000000;
        }
        return price <= 20000000;
      },
      filterSearch: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        }
        return Number(record.rating) <= 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
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
  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initialValue());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  function handleChangeDetails(e) {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUploadDetails({ fileList }) {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  }
  // End details

  // Update
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
  } = mutationUpdate;

  function onUpdateProduct() {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  }

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateProductDetails(initialValue());
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
    const res = ProductService.deleteProduct(id, token);
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

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  // End delete

  // Delete many
  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const {
    data: dataDeletedMany,
    isPending: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
  } = mutationDeletedMany;

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
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

  // Type products
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  // End type products

  return (
    <div>
      <Title level={4}>AdminUser</Title>
      <StyledButton onClick={() => setIsModalOpen(true)}>
        <PlusOutlined style={{ fontSize: 40 }} />
      </StyledButton>
      <Modal
        forceRender
        title="Tạo sản phẩm"
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <AdminFormProduct
          onFinish={onFinish}
          form={form}
          state={stateProduct}
          onChange={handleChange}
          onUpload={handleUpload}
          onSelected={handleChangeSelect}
          disabled={isPending}
          options={renderOptions(typeProduct?.data?.data)}
          onCancel={handleCancel}
        />
      </Modal>

      {isLoadingDeletedMany ? (
        <Spinner />
      ) : (
        <TableForm
          handleDeleteMany={handleDeleteManyProducts}
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
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      >
        <AdminFormProduct
          onFinish={onUpdateProduct}
          form={form}
          state={stateProductDetails}
          onChange={handleChange}
          onUpload={handleUpload}
          onSelected={handleChangeSelect}
          options={renderOptions(typeProduct?.data?.data)}
          disabled={isLoadingUpdate || isLoadingUpdated}
          onCancel={() => setIsOpenDrawer(false)}
        />
      </DrawerForm>
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteProduct}
      >
        {isLoadingDeleted ? (
          <Spinner />
        ) : (
          <div>Bạn có muốn xóa sản phầm này không?</div>
        )}
      </Modal>
    </div>
  );
}

export default AdminProduct;
