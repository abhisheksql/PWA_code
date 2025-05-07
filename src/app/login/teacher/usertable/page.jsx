"use client"
import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";

// Filter for ID column
const IdFilter = ({ filterValue, setFilter }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Filter by ID...`}
  />
);

// Filter for Name column
const NameFilter = ({ filterValue, setFilter }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Filter by Name...`}
  />
);

// Table component definition
const AdvancedTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: { sortBy: [{ id: "id", desc: false }] }, // Pre-sort by 'id' column ascending
      },
      useSortBy // Hook to handle sorting
    );

  return (
    <table
      {...getTableProps()}
      style={{
        border: "solid 1px black",
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{ padding: "10px" }}
                key={column.id}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? " 🔽"
                      : " 🔼"
                    : column.id === "id" || column.id === "age"
                    ? " 🔼"
                    : ""}
                </span>
                {column.canFilter ? column.render("Filter") : null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  style={{ padding: "10px", border: "solid 1px gray" }}
                  key={cell.column.id}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Main Page Component
const HomePage = () => {
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  // Data and columns setup
  const columns = [
    {
      Header: "ID",
      accessor: "id",
      Filter: IdFilter, // Add filter for ID column
    },
    {
      Header: "Name",
      accessor: "name",
      Filter: NameFilter, // Add filter for Name column
    },
    {
      Header: "Age",
      accessor: "age",
    },
  ];

  const data = [
    { id: 1, name: "John", age: 28 },
    { id: 2, name: "Jane", age: 22 },
    { id: 3, name: "Doe", age: 32 },
    { id: 1, name: "John", age: 28 },
    { id: 2, name: "Jane", age: 22 },
    { id: 3, name: "Doe", age: 32 },
    { id: 1, name: "John", age: 28 },
    { id: 2, name: "Jane", age: 22 },
    { id: 3, name: "Doe", age: 32 },
    { id: 1, name: "John", age: 28 },
    { id: 2, name: "Jane", age: 22 },
    { id: 3, name: "Doe", age: 32 },
  ];

  // Apply filters to data
  const filteredData = data.filter(
    (item) =>
      item.id.toString().includes(idFilter) &&
      item.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  return (
    <div>
      <h1>Advanced Table</h1>
      {/* Filter Input for ID */}
      <input
        value={idFilter}
        onChange={(e) => setIdFilter(e.target.value)}
        placeholder="Filter by ID"
        style={{
          marginBottom: "10px",
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          display: "block",
        }}
      />
      {/* Filter Input for Name */}
      <input
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        placeholder="Filter by Name"
        style={{
          marginBottom: "10px",
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          display: "block",
        }}
      />
      <AdvancedTable columns={columns} data={filteredData} />
    </div>
  );
};

export default HomePage;
