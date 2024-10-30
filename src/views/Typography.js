import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import ReactPaginate from "react-paginate";
import "../assets/css/Table.css";

function MeasurementHistoryTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sensorData, setSensorData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const pageSizeOptions = [5, 10, 20];
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Tách riêng hàm fetchData
  const fetchData = async () => {
    const formatToLocalISO = (dateStr) => {
      const date = new Date(dateStr);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    };
  
    const formattedStartDate = startDate ? formatToLocalISO(startDate) : "";
    
    // Thêm một giây vào endDate
    const addOneSecond = (dateStr) => {
      const date = new Date(dateStr);
      date.setSeconds(date.getSeconds() + 1);
      return date.toISOString();
    };
  
    const formattedEndDate = endDate ? addOneSecond(formatToLocalISO(endDate)) : "";
  
    const endpoint = isSearch
      ? `http://localhost:5000/api/sensor-data/search?query=${searchQuery}&page=${currentPage + 1}&pageSize=${pageSize}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      : `http://localhost:5000/api/sensor-data?page=${currentPage + 1}&pageSize=${pageSize}`;
  
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      setSensorData(data.data);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };
  

  // Gọi fetchData khi currentPage, pageSize hoặc isSearch thay đổi
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, isSearch]);

  // Thay đổi khi tìm kiếm
  const handleSearch = () => {
    setIsSearch(true);
    fetchData();
  };

  const handlePageClick = (data) => setCurrentPage(data.selected);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
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
      return sortOrder === "desc" ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredAndSortedData = sortData(sensorData);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Lịch sử đo</CardTitle>
        <Input type="select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="temperature">Nhiệt độ</option>
          <option value="humidity">Độ ẩm</option>
          <option value="light">Ánh sáng</option>
        </Input>
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="date-filter">
          <Input
            type="text"
            placeholder="Từ ngày (YYYY-MM-DD HH:MM)"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <Input
            type="text"
            placeholder="Đến ngày (YYYY-MM-DD HH:MM)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
          <Button color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
            Tìm
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table responsive>
          <thead className="text-primary">
            <tr>
              <th onClick={() => handleSort("id")}>Id {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              {(filterType === "temperature" || filterType === "all") && (
                <th onClick={() => handleSort("temperature")}>
                  Nhiệt độ {sortField === "temperature" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              )}
              {(filterType === "humidity" || filterType === "all") && (
                <th onClick={() => handleSort("humidity")}>
                  Độ ẩm {sortField === "humidity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              )}
              {(filterType === "light" || filterType === "all") && (
                <th onClick={() => handleSort("light")}>
                  Ánh sáng {sortField === "light" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              )}
              <th onClick={() => handleSort("timestamp")} className="text-right">
                Thời gian {sortField === "timestamp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1 + currentPage * pageSize}</td>
                {(filterType === "temperature" || filterType === "all") && <td>{item.temperature}</td>}
                {(filterType === "humidity" || filterType === "all") && <td>{item.humidity}</td>}
                {(filterType === "light" || filterType === "all") && <td>{item.light}</td>}
                <td className="text-right">
                  {item.timestamp.split('T')[0]} {item.timestamp.split('T')[1].split('.')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalItems / pageSize)}
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
