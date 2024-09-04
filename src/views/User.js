import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function User() {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/mike.jpg")}
                      style={{
                        borderRadius: '50%',
                        width: '150px',  // Điều chỉnh kích thước theo nhu cầu
                        height: '150px', // Điều chỉnh kích thước theo nhu cầu
                        objectFit: 'cover', // Đảm bảo ảnh không bị méo
                      }}
                    />
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <FormGroup>
                        <label>Họ và Tên</label>
                        <Input
                          defaultValue="Nguyễn Hữu Thắng"
                          disabled
                          placeholder="Nguyễn Hữu Thắng"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="3">
                      <FormGroup>
                        <label>Mã Sinh Viên</label>
                        <Input
                          defaultValue="B21DCCN667"
                          placeholder="B21DCCN667"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                        Lớp
                        </label>
                        <Input placeholder="D21CNPM4" type="D21CNPM4" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Git</label>
                        <Input
                          defaultValue="Link..."
                          placeholder=""
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>API docs</label>
                        <Input
                          defaultValue="link..."
                          placeholder=""
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;