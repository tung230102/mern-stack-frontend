import { Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import React, { useMemo, useState } from "react";
import Spinner from "../ui/Spinner";

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

      <button onClick={exportExcel}>Export Excel</button>

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
