import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState } from "react";
import Switch from "react-switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

// Sample data for the charts
const data = [
  { name: "00:00", temperature: 22, humidity: 60, light: 300 },
  { name: "03:00", temperature: 21, humidity: 58, light: 280 },
  { name: "06:00", temperature: 23, humidity: 57, light: 350 },
  { name: "09:00", temperature: 24, humidity: 55, light: 400 },
  { name: "12:00", temperature: 26, humidity: 54, light: 450 },
  { name: "15:00", temperature: 27, humidity: 52, light: 500 },
  { name: "18:00", temperature: 25, humidity: 53, light: 420 },
  { name: "21:00", temperature: 23, humidity: 56, light: 380 },
];

function Dashboard() {
  const [isFanOn, setIsFanOn] = useState(true);
  const [isLEDOn, setIsLEDOn] = useState(true);
  const [isACOn, setIsACOn] = useState(true);

  return (
    <>
      <div className="content">
        <Row>
          {/* Hiển thị nhiệt độ, độ ẩm, ánh sáng đo được */}
          <Col md="12">
            <Card>
              <CardBody>
                <Row>
                  <Col md="4" className="text-center">
                    <div className="numbers">
                      <i className="fas fa-thermometer-half" style={{ fontSize: "50px", color: "orange" }}></i>
                      <p className="card-category" style={{ fontSize: "16px" }}>Nhiệt độ</p>
                      <CardTitle tag="h5" style={{ fontSize: "24px" }}>25°C</CardTitle>
                    </div>
                  </Col>
                  <Col md="4" className="text-center">
                    <div className="numbers">
                      <i className="fas fa-tint" style={{ fontSize: "50px", color: "blue" }}></i>
                      <p className="card-category" style={{ fontSize: "16px" }}>Độ ẩm</p>
                      <CardTitle tag="h5" style={{ fontSize: "24px" }}>60%</CardTitle>
                    </div>
                  </Col>
                  <Col md="4" className="text-center">
                    <div className="numbers">
                      <i className="fas fa-lightbulb" style={{ fontSize: "50px", color: "yellow" }}></i>
                      <p className="card-category" style={{ fontSize: "16px" }}>Ánh sáng</p>
                      <CardTitle tag="h5" style={{ fontSize: "24px" }}>350 lux</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="9">
            {/* Phần biểu đồ */}
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Nhiệt độ, Độ ẩm và Ánh sáng</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#FF6347" />
                    <Line type="monotone" dataKey="humidity" stroke="#4682B4" />
                    <Line type="monotone" dataKey="light" stroke="#32CD32" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            {/* Phần On/Off */}
            <Row>
              <Col md="12">
                <Card className="card-stats" style={{ height: '130px' }}>
                  <CardBody>
                    <Row>
                      <Col md="4">
                        <div className="icon-big text-center icon-warning">
                          <i className={`fas fa-fan`} style={{ fontSize: "50px", color: isFanOn ? "blue" : "gray" }}></i>
                        </div>
                      </Col>
                      <Col md="8">
                        <div className="numbers">
                          <p className="card-category" style={{ fontSize: "16px" }}>Quạt</p>
                          <div>
                            <Switch
                              onChange={() => setIsFanOn(!isFanOn)}
                              checked={isFanOn}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#FF6347"
                              offColor="#ccc"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col md="12">
                <Card className="card-stats" style={{ height: '130px' }}>
                  <CardBody>
                    <Row>
                      <Col md="4">
                        <div className="icon-big text-center icon-warning">
                          <i className="fas fa-lightbulb" style={{ fontSize: "50px", color: isLEDOn ? "yellow" : "gray" }}></i>
                        </div>
                      </Col>
                      <Col md="8">
                        <div className="numbers">
                          <p className="card-category" style={{ fontSize: "16px" }}>Đèn LED</p>
                          <div>
                            <Switch
                              onChange={() => setIsLEDOn(!isLEDOn)}
                              checked={isLEDOn}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#FF6347"
                              offColor="#ccc"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col md="12">
                <Card className="card-stats" style={{ height: '130px' }}>
                  <CardBody>
                    <Row>
                      <Col md="4">
                        <div className="icon-big text-center icon-warning">
                          <i className="fas fa-wind" style={{ fontSize: "50px", color: isACOn ? "lightblue" : "gray" }}></i>
                        </div>
                      </Col>
                      <Col md="8">
                        <div className="numbers">
                          <p className="card-category" style={{ fontSize: "16px" }}>Điều hòa</p>
                          <div>
                            <Switch
                              onChange={() => setIsACOn(!isACOn)}
                              checked={isACOn}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#FF6347"
                              offColor="#ccc"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
