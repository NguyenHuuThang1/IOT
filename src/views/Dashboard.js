import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

function Dashboard() {
  const [isFanOn, setIsFanOn] = useState(false);
  const [isLEDOn, setIsLEDOn] = useState(false);
  const [isACOn, setIsACOn] = useState(false);
  const [isFanSwitchOn, setIsFanSwitchOn] = useState(false); // Trạng thái riêng của switch
  const [isLEDSwitchOn, setIsLEDSwitchOn] = useState(false);
  const [isACSwitchOn, setIsACSwitchOn] = useState(false);

  const [data, setData] = useState([]);
  const [latestValues, setLatestValues] = useState({ temperature: 0, humidity: 0, light: 0 });

  useEffect(() => {
    // Hàm fetch dữ liệu từ API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensor-data');
        const result = await response.json(); 
        setData(result.data);
        const latest = result.data[result.data.length - 1];
        setLatestValues({
          temperature: latest.temperature,
          humidity: latest.humidity,
          light: latest.light
        });
  
        const fanState = latest.fanState === 'ON';
        const ledState = latest.ledState === 'ON';
        const acState = latest.acState === 'ON';
        
        setIsFanOn(fanState);
        setIsLEDOn(ledState);
        setIsACOn(acState);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    // Gọi hàm fetch dữ liệu khi component được render
    fetchData();
    const savedStates = JSON.parse(localStorage.getItem('deviceStates') || '{}');
  setIsFanSwitchOn(savedStates.Fan || false);
  setIsLEDSwitchOn(savedStates.LED || false);
  setIsACSwitchOn(savedStates.AC || false);
    // Kết nối tới WebSocket để nhận lệnh MQTT từ server
    // const socket = new WebSocket('ws://localhost:8080');

  // socket.onmessage = (event) => {
  //   const message = event.data;

  //   if (message.includes('LED1')) {
  //     setIsFanOn(message.includes('ON'));  // Chỉ cập nhật icon quạt dựa trên led_status
  //   } else if (message.includes('LED2')) {
  //     setIsLEDOn(message.includes('ON'));  // Chỉ cập nhật icon LED
  //   } else if (message.includes('LED3')) {
  //     setIsACOn(message.includes('ON'));   // Chỉ cập nhật icon điều hòa
  //   }
  // };

  // return () => {
  //   socket.close();
  // };
  const interval = setInterval(() => {
    fetch('http://localhost:5000/api/device-status')
      .then(response => response.json())
      .then(data => {
        setIsFanOn(data.fan);
        setIsLEDOn(data.led);
        setIsACOn(data.ac);
      })
      .catch(error => console.error('Error fetching device status:', error));
  }, 2000);
  return () => clearInterval(interval);
  }, []);
  

  const handleToggle = (device, state) => {
    const deviceMapping = {
      Fan: { topic: 'LED1' },
      LED: { topic: 'LED2' },
      AC: { topic: 'LED3' },
    };
  
    const { topic } = deviceMapping[device];
    const actionValue = state ? 'ON' : 'OFF';
    const payload = `${topic}: ${actionValue}`;
  
    console.log(`Sending command... Topic: ${topic}, Payload: ${payload}`); 
  
    // Gửi lệnh đến backend để publish MQTT
    fetch('http://localhost:5000/send-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: 'led_control', payload }), 
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Command sent: ${data}`);
    })
    .catch(error => {
      console.error('Error sending command:', error);
    });
    const updatedStates = {
      ...JSON.parse(localStorage.getItem('deviceStates') || '{}'),
      [device]: state,
    };
    localStorage.setItem('deviceStates', JSON.stringify(updatedStates));
  };
  
  

  return (
    <div className="content">
      {/* Hiển thị thông tin về nhiệt độ, độ ẩm, ánh sáng */}
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Row>
                <Col md="4" className="text-center">
                  <div className="numbers">
                    <i className="fas fa-thermometer-half" style={{ fontSize: "50px", color: "orange" }}></i>
                    <p className="card-category" style={{ fontSize: "16px" }}>Nhiệt độ</p>
                    <CardTitle tag="h5" style={{ fontSize: "24px" }}>{latestValues.temperature}°C</CardTitle>
                  </div>
                </Col>
                <Col md="4" className="text-center">
                  <div className="numbers">
                    <i className="fas fa-tint" style={{ fontSize: "50px", color: "blue" }}></i>
                    <p className="card-category" style={{ fontSize: "16px" }}>Độ ẩm</p>
                    <CardTitle tag="h5" style={{ fontSize: "24px" }}>{latestValues.humidity}%</CardTitle>
                  </div>
                </Col>
                <Col md="4" className="text-center">
                  <div className="numbers">
                    <i className="fas fa-lightbulb" style={{ fontSize: "50px", color: "yellow" }}></i>
                    <p className="card-category" style={{ fontSize: "16px" }}>Ánh sáng</p>
                    <CardTitle tag="h5" style={{ fontSize: "24px" }}>{latestValues.light} lux</CardTitle>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Hiển thị biểu đồ dữ liệu */}
      <Row>
        <Col md="9">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Nhiệt độ, Độ ẩm và Ánh sáng</CardTitle>
            </CardHeader>
            <CardBody>
            <ResponsiveContainer width="100%" height={400}>
  <LineChart data={data.slice(-80)}> {/* Không cần filter */}
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" /> {/* Đảm bảo rằng `time` tồn tại trong data */}
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="temperature" stroke="#FF6347" dot={true} /> {/* Thêm dot */}
    <Line type="monotone" dataKey="humidity" stroke="#4682B4" dot={true} /> {/* Thêm dot */}
    <Line type="monotone" dataKey="light" stroke="#32CD32" dot={true} /> {/* Thêm dot */}
  </LineChart>
</ResponsiveContainer>

            </CardBody>
          </Card>
        </Col>

        {/* Điều khiển thiết bị với switch */}
        <Col md="3">
          <Row>
            <Col md="12">
              <Card className="card-stats" style={{ height: '130px' }}>
                <CardBody>
                  <Row>
                    <Col md="4">
                      <div className="icon-big text-center icon-warning">
                        <i className={`fas fa-fan ${isFanOn ? "icon-spin" : ""}`} style={{ fontSize: "50px", color: isFanOn ? "blue" : "gray" }}></i>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="numbers">
                        <p className="card-category" style={{ fontSize: "16px" }}>Quạt</p>
                        <div>
                        <Switch
                          onChange={() => {
                            setIsFanSwitchOn(!isFanSwitchOn); // Cập nhật ngay lập tức trạng thái switch
                            handleToggle('Fan', !isFanSwitchOn); // Gửi lệnh điều khiển nhưng không chờ phản hồi
                          }}
                          checked={isFanSwitchOn}  // Luôn gạt ngay lập tức theo trạng thái switch
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
                            onChange={() => {
                              setIsLEDSwitchOn(!isLEDSwitchOn); // Cập nhật ngay lập tức trạng thái switch
                              handleToggle('LED', !isLEDSwitchOn); // Gửi lệnh điều khiển nhưng không chờ phản hồi
                            }}
                            
                            checked={isLEDSwitchOn}
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
                        <i className="fas fa-snowflake" style={{ fontSize: "50px", color: isACOn ? "cyan" : "gray" }}></i>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="numbers">
                        <p className="card-category" style={{ fontSize: "16px" }}>Điều hòa</p>
                        <div>
                          <Switch
                            onChange={() => {
                              setIsACSwitchOn(!isACSwitchOn); // Cập nhật ngay lập tức trạng thái switch
                              handleToggle('AC', !isACSwitchOn); // Gửi lệnh điều khiển nhưng không chờ phản hồi
                            }}
                            checked={isACSwitchOn}
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
  );
}

export default Dashboard;
