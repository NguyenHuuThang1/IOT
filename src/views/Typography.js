import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import ReactPaginate from "react-paginate";
import "../assets/css/Table.css";  // CSS cho phân trang

function MeasurementHistoryTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pageSizeOptions = [1, 5, 10, 20];

  const data = [
    { id: "01", temperature: "20", humidity: "50", light: "50", time: "2023-09-01 20:00" },
    { id: "02", temperature: "21", humidity: "51", light: "55", time: "2023-09-01 20:30" },
    { id: "03", temperature: "19", humidity: "49", light: "52", time: "2023-09-01 21:00" },
    { id: "04", temperature: "22", humidity: "52", light: "58", time: "2023-09-01 21:30" },
    { id: "05", temperature: "20", humidity: "50", light: "50", time: "2023-09-01 22:00" },
    { id: "06", temperature: "21", humidity: "51", light: "53", time: "2023-09-01 22:30" },
    { id: "07", temperature: "23", humidity: "53", light: "56", time: "2023-09-01 23:00" },
  ];

  const paginate = (data, pageNumber) => {
    const start = pageNumber * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aValue = new Date(a[sortField]);
      const bValue = new Date(b[sortField]);
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredAndSortedData = sortData(
    data.filter(item =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.temperature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.humidity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.light.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset page number on page size change
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Lịch sử đo</CardTitle>
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <CardBody>
        <Table responsive>
          <thead className="text-primary">
            <tr>
              <th onClick={() => handleSort("id")}>
                Id {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("temperature")}>
                Nhiệt độ {sortField === "temperature" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("humidity")}>
                Độ ẩm {sortField === "humidity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("light")}>
                Ánh sáng {sortField === "light" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("time")} className="text-right">
                Thời gian {sortField === "time" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginate(filteredAndSortedData, currentPage).map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.temperature}</td>
                <td>{item.humidity}</td>
                <td>{item.light}</td>
                <td className="text-right">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(filteredAndSortedData.length / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="page-size-dropdown">
            <DropdownToggle caret className="dropdown-toggle">
              {pageSize}
            </DropdownToggle>
            <DropdownMenu>
              {pageSizeOptions.map((size) => (
                <DropdownItem key={size} onClick={() => handlePageSizeChange(size)}>
                  {size}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
}

export default MeasurementHistoryTable;
