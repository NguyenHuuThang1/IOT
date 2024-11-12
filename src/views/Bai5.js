import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import "../assets/css/Table.css";

function Dashboard() {
  const [windSpeed, setWindSpeed] = useState(0); // State để hiển thị tốc độ gió
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWindSpeed = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensor-data/get');
        const result = await response.json(); 
        setWindSpeed(result.data[0]?.speed || 0); // Lấy tốc độ gió mới nhất
      } catch (error) {
        console.error("Error fetching wind speed: ", error);
      }
    };

    const fetchRecentData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensor-data/recent');
        const result = await response.json();
        // Đảo ngược thứ tự để hiển thị từ cũ nhất đến mới nhất
        setData(result.data.reverse());
      } catch (error) {
        console.error("Error fetching recent data: ", error);
      }
    };

    // Gọi hàm fetchRecentData và fetchWindSpeed ngay khi component được mount
    fetchWindSpeed();
    fetchRecentData();

    // Thiết lập interval để cập nhật mỗi 5 giây
    const interval = setInterval(() => {
      fetchWindSpeed();
      fetchRecentData();
    }, 5000);

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content">
      {/* Hiển thị biểu đồ dữ liệu */}
      <Row>
        <Col md="9">
          <Card>
            <CardBody>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="speed" stroke="#FF6347" dot={true} /> {/* Hiển thị dữ liệu tốc độ gió */}
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>

        {/* Hiển thị icon cảnh báo và tốc độ gió */}
        <Col md="3">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4">
                  <div className="icon-big text-center">
                    <i 
                      className={`fas fa-exclamation-triangle ${windSpeed > 60 ? "blinking-icon" : ""}`} 
                      style={{ fontSize: "50px", color: "red" }}
                    ></i>
                  </div>
                </Col>
                <Col md="8">
                  <div className="numbers">
                    <p className="card-category" style={{ fontSize: "16px" }}>Tốc độ gió</p>
                    <CardTitle tag="h5" style={{ fontSize: "24px" }}>{windSpeed} m/s</CardTitle>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
