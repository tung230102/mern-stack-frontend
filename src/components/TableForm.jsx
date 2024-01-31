import { ExportOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Spinner from "./Spinner";

const StyledButton = styled(Button)`
  height: 80px;
  width: 80px;
  border-radius: 8px;
  border-style: dashed;
`;

const TableForm = ({
  columns,
  isLoading,
  dataSource,
  handleDeleteMany,
  ...rests
}) => {
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      {!!rowSelectedKeys.length && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <StyledButton onClick={exportExcel}>
        <ExportOutlined style={{ fontSize: 40 }} />
      </StyledButton>

      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        style={{ marginTop: 20 }}
        {...rests}
      />
    </>
  );
};
export default TableForm;
