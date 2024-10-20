import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import IMAGES from "../images/images";

const Dashboard = () => {
  return (
    <div className="container">
      <h1 className="text-center">ADMIN DASHBOARD</h1>
      <Row>
        <Col className="p-3" xs={"12"} md={"6"}>
          <Link className=" text-decoration-none" to={"create-items"}>
            <Card className="bg-light d-flex align-items-center">
              <img
                style={{ maxWidth: "300px", width: "100%", height: "300px" }}
                src={IMAGES.createItemsSvg}
                alt=""
              />
              <div className="bg-light p-3 d-flex justify-content-center align-items-center">
                <h5 className="text-dark">Create Items</h5>
              </div>
            </Card>
          </Link>
        </Col>
        <Col className="p-3" xs={"12"} md={"6"}>
          <Link className=" text-decoration-none" to={"view-items"}>
            <Card className="bg-warning-subtle d-flex align-items-center">
              <img
                style={{ maxWidth: "300px", width: "100%", height: "300px" }}
                src={IMAGES.viewItemsSvg}
                alt=""
              />
              <div className="p-3 d-flex justify-content-center align-items-center">
                <h5 className="text-dark">View Items</h5>
              </div>
            </Card>
          </Link>
        </Col>
        <Col className="p-3" xs={"12"} md={"6"}>
          <Link className=" text-decoration-none" to={"orders"}>
            <Card className="bg-success-subtle d-flex align-items-center">
              <img
                style={{ maxWidth: "300px", width: "100%", height: "300px" }}
                src={IMAGES.orders}
                alt=""
              />
              <div className="p-3 d-flex justify-content-center align-items-center">
                <h5 className="text-dark">Orders</h5>
              </div>
            </Card>
          </Link>
        </Col>
        <Col className="p-3" xs={"12"} md={"6"}>
          <Link className=" text-decoration-none" to={"pw"}>
            <Card className="bg-danger-subtle d-flex align-items-center">
              <img
                style={{ maxWidth: "300px", width: "100%", height: "300px" }}
                src={IMAGES.changePw}
                alt=""
              />
              <div className="p-3 d-flex justify-content-center align-items-center">
                <h5 className="text-dark">Change Password</h5>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
