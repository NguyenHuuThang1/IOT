import '@fortawesome/fontawesome-free/css/all.min.css';
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardBody, CardFooter, CardTitle, Row, Col, Button } from "reactstrap";

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
  return (
    <>
      <div className="content">
        <Row>
          <Col lg="4" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
  <i className="fas fa-thermometer-half" style={{ fontSize: "40px", color: "orange" }}></i>
</div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Nhiệt độ</p>
                      <CardTitle tag="p">25°C</CardTitle>
                      <p />
                      <div>
                        <Button color="success" size="sm">On</Button>{' '}
                        <Button color="danger" size="sm">Off</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
  <i className="fas fa-tint" style={{ fontSize: "40px", color: "red" }}></i>
</div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> Độ ẩm</p>
                      <CardTitle tag="p">60%</CardTitle>
                      <p />
                      <div>
                        <Button color="success" size="sm">On</Button>{' '}
                        <Button color="danger" size="sm">Off</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
  <i className="fas fa-lightbulb" style={{ fontSize: "40px", color: "green" }}></i>
</div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Ánh sáng</p>
                      <CardTitle tag="p">350 lux</CardTitle>
                      <p />
                      <div>
                        <Button color="success" size="sm">On</Button>{' '}
                        <Button color="danger" size="sm">Off</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Nhiệt độ</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#FF6347" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Độ ẩm</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="humidity" stroke="#4682B4" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Ánh sáng</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="light" stroke="#32CD32" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
