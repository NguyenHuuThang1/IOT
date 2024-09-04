import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import "../assets/css/Table.css";  // Tạo file CSS để định dạng cho phân trang

function Tables() {
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [sortField1, setSortField1] = useState("time");
  const [sortOrder1, setSortOrder1] = useState("asc");
  const [sortField2, setSortField2] = useState("time");
  const [sortOrder2, setSortOrder2] = useState("asc");
  const pageSize = 5;

  const data1 = [
    { id: "01", name: "Máy đo độ ẩm", status: "On", time: "2023-09-01 12:00" },
    { id: "02", name: "Máy đo độ ẩm", status: "Off", time: "2023-09-01 12:30" },
    { id: "03", name: "Máy đo nhiệt độ", status: "On", time: "2023-09-01 15:00" },
    { id: "04", name: "Máy đo nhiệt độ", status: "Off", time: "2023-09-01 16:00" },
    { id: "05", name: "Máy đo ánh sáng", status: "On", time: "2023-09-01 18:00" },
    { id: "06", name: "Máy đo ánh sáng", status: "Off", time: "2023-09-01 20:00" },
  ];

  const data2 = [
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

  const handlePageClick1 = (data) => {
    setCurrentPage1(data.selected);
  };

  const handlePageClick2 = (data) => {
    setCurrentPage2(data.selected);
  };

  const handleSort1 = (field) => {
    const newSortOrder = sortField1 === field && sortOrder1 === "asc" ? "desc" : "asc";
    setSortField1(field);
    setSortOrder1(newSortOrder);
  };

  const handleSort2 = (field) => {
    const newSortOrder = sortField2 === field && sortOrder2 === "asc" ? "desc" : "asc";
    setSortField2(field);
    setSortOrder2(newSortOrder);
  };

  const sortData1 = (data) => {
    return [...data].sort((a, b) => {
      const aValue = new Date(a[sortField1]);
      const bValue = new Date(b[sortField1]);
      return sortOrder1 === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const sortData2 = (data) => {
    return [...data].sort((a, b) => {
      const aValue = new Date(a[sortField2]);
      const bValue = new Date(b[sortField2]);
      return sortOrder2 === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredAndSortedData1 = sortData1(
    data1.filter(item =>
      item.id.toLowerCase().includes(searchQuery1.toLowerCase()) ||
      item.time.toLowerCase().includes(searchQuery1.toLowerCase())
    )
  );

  const filteredAndSortedData2 = sortData2(
    data2.filter(item =>
      item.id.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      item.temperature.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      item.humidity.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      item.light.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      item.time.toLowerCase().includes(searchQuery2.toLowerCase())
    )
  );

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Lịch sử bật/tắt</CardTitle>
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                />
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th onClick={() => handleSort1("id")}>
                        Id {sortField1 === "id" ? (sortOrder1 === "asc" ? "↑" : "↓") : ""}
                      </th>
                      <th>Tên thiết bị</th>
                      <th>Trạng thái</th>
                      <th onClick={() => handleSort1("time")} className="text-right">
                        Thời gian {sortField1 === "time" ? (sortOrder1 === "asc" ? "↑" : "↓") : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(filteredAndSortedData1, currentPage1).map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.status}</td>
                        <td className="text-right">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(filteredAndSortedData1.length / pageSize)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick1}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Lịch sử đo</CardTitle>
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                />
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th onClick={() => handleSort2("id")}>
                        Id {sortField2 === "id" ? (sortOrder2 === "asc" ? "↑" : "↓") : ""}
                      </th>
                      <th onClick={() => handleSort2("temperature")}>
                        Nhiệt độ {sortField2 === "temperature" ? (sortOrder2 === "asc" ? "↑" : "↓") : ""}
                      </th>
                      <th onClick={() => handleSort2("humidity")}>
                      Độ ẩm {sortField2 === "humidity" ? (sortOrder2 === "asc" ? "↑" : "↓") : ""}
                      </th>
                      <th onClick={() => handleSort2("light")}>
                        Ánh sáng {sortField2 === "light" ? (sortOrder2 === "asc" ? "↑" : "↓") : ""}
                      </th>
                      <th onClick={() => handleSort2("time")} className="text-right">
                        Thời gian {sortField2 === "time" ? (sortOrder2 === "asc" ? "↑" : "↓") : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(filteredAndSortedData2, currentPage2).map((item, index) => (
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
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(filteredAndSortedData2.length / pageSize)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick2}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;

