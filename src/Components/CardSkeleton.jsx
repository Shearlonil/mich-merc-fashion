import React from "react";
import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const CardSkeleton = () => {
  /*  refs: WITH REACT SUSPENSE
        https://www.youtube.com/watch?v=g74Q0wRc6BQ
        https://github.com/gitdagray/react-suspense/tree/main
        https://www.youtube.com/watch?v=OpHbSHp8PcI
        https://www.youtube.com/watch?v=1_dLaSjzOMY
        https://www.youtube.com/watch?v=nS5qbSJLGx8
        */
  return (
    <div>
      <Card
        style={{ height: "450px" }}
        className="gap-2 m-2 border-0 rounded-1 bg-light"
      >
        <Card.Img className="rounded-0" variant="top" height={"200px"} />
        <Card.Header>
          <h4 className="fw-bold" style={{ color: "#050580" }}>
            <Skeleton count={1} />
          </h4>
        </Card.Header>
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title className="">
            <h4>
              <span>
                <Skeleton count={1} />
              </span>
            </h4>
          </Card.Title>
          <Card.Text>
            <Skeleton count={1} />
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardSkeleton;
