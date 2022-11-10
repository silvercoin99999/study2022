import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Card, Avatar, Col, Typography, Row } from "antd";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/video/getSubscriptionVideos", subscriptionVariables).then(
      (response) => {
        if (response.data.success) {
          console.log(response.data.videos);
          setVideo(response.data.videos);
        } else {
          alert("비디오 가져오기를 실패 했습니다.");
        }
      }
    );
  }, []);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div key={index} className="duration-wrap">
        <Col lg={6} md={8} xs={24}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
          <br />
          <Meta
            avatar={<Avatar src={video.writer.image} />}
            title={video.title}
          />
          <div className="video-info">
            <div>{video.writer.name}</div>
            <div>{video.views}</div>
            <div>{moment(video.createdAt).format("MMM Do YY")}</div>
          </div>
        </Col>
      </div>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
