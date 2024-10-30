import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import "../assets/css/Table.css";

function HistoryToggleTable() {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isSearch, setIsSearch] = useState(false); // Thêm state để kiểm tra có đang tìm kiếm hay không

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Fetch dữ liệu từ API khi component được mount hoặc khi currentPage, pageSize thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/led-history?page=${currentPage + 1}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
        setTotalItems(result.totalItems);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, [currentPage, pageSize, isSearch]); // Thêm isSearch vào dependency

  // Fetch dữ liệu tìm kiếm
  const fetchSearchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/led-history/search?query=${searchQuery}&page=${currentPage + 1}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result.data);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error("Error fetching search data: ", err);
      setError("Không thể tải dữ liệu");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleSearch = () => {
    fetchSearchData(); // Gọi hàm tìm kiếm khi nhấn nút
    setIsSearch(true); // Đánh dấu là đang tìm kiếm
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aValue = new Date(a[sortField]);
      const bValue = new Date(b[sortField]);
      return sortOrder === "desc" ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredAndSortedData = sortData(data); // Chỉ sắp xếp dữ liệu mà không cần lọc

  return (
    <Card>
      <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardTitle tag="h4">Lịch sử bật/tắt</CardTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginRight: '10px' }} // Thêm khoảng cách giữa Input và Button
          />
          <Button color="primary" onClick={handleSearch}>
            Tìm
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {error && <div className="alert alert-danger">{error}</div>}
        <Table responsive>
          <thead className="text-primary">
            <tr>
              <th>ID</th>
              <th onClick={() => handleSort("led_name")}>
                Tên thiết bị{" "}
                {sortField === "led_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("action")}>
                Trạng thái{" "}
                {sortField === "action" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("timestamp")} className="text-right">
                Thời gian{" "}
                {sortField === "timestamp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item, index) => (
              <tr key={index}>
                <td>{(currentPage * pageSize) + index + 1}</td>
                <td>{item.led_name}</td>
                <td>{item.action}</td>
                <td className="text-right">
                  {item.timestamp.split("T")[0]}{" "}
                  {item.timestamp.split("T")[1].split(".")[0]}
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
            <DropdownToggle caret>{pageSize}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handlePageSizeChange(5)}>5</DropdownItem>
              <DropdownItem onClick={() => handlePageSizeChange(10)}>10</DropdownItem>
              <DropdownItem onClick={() => handlePageSizeChange(20)}>20</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
}

export default HistoryToggleTable;
