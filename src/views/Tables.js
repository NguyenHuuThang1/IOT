import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import ReactPaginate from "react-paginate";
import "../assets/css/Table.css";  // CSS cho phân trang

function HistoryToggleTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const data = [
    { id: "01", name: "Máy đo độ ẩm", status: "On", time: "2023-09-01 12:00" },
    { id: "02", name: "Máy đo độ ẩm", status: "Off", time: "2023-09-01 12:30" },
    { id: "03", name: "Máy đo nhiệt độ", status: "On", time: "2023-09-01 15:00" },
    { id: "04", name: "Máy đo nhiệt độ", status: "Off", time: "2023-09-01 16:00" },
    { id: "05", name: "Máy đo ánh sáng", status: "On", time: "2023-09-01 18:00" },
    { id: "06", name: "Máy đo ánh sáng", status: "Off", time: "2023-09-01 20:00" },
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
      item.time.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Lịch sử bật/tắt</CardTitle>
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
              <th>Tên thiết bị</th>
              <th>Trạng thái</th>
              <th onClick={() => handleSort("time")} className="text-right">
                Thời gian {sortField === "time" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginate(filteredAndSortedData, currentPage).map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td className="text-right">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Phần phân trang */}
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
          {/* Dropdown chọn số trang */}
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="page-size-dropdown">
            <DropdownToggle caret>
              {pageSize}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setPageSize(1)}>1</DropdownItem>
              <DropdownItem onClick={() => setPageSize(5)}>5</DropdownItem>
              <DropdownItem onClick={() => setPageSize(10)}>10</DropdownItem>
              <DropdownItem onClick={() => setPageSize(20)}>20</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
}

export default HistoryToggleTable;
