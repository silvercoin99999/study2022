import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import {
  LikeOutlined,
  LikeTwoTone,
  DislikeOutlined,
  DislikeTwoTone,
} from "@ant-design/icons";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((response) => {
      // console.log("getLikes", response.data);

      if (response.data.success) {
        // 얼마나 많은 좋아요가 있는지
        setLikes(response.data.likes.length);

        // 내가 이미 좋아요를 했는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Likes의 정보를 가져오는데 실패했습니다.");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((response) => {
      console.log("getDislike", response.data);
      if (response.data.success) {
        // 얼마나 많은 싫어요가 있는지
        setDislikes(response.data.dislikes.length);

        // 내가 이미 싫어요를 했는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("DisLike의 정보를 가져오는데 실패했습니다.");
      }
    });
  }, []);

  // 좋아요, 좋아요 취소
  const onLike = () => {
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          // 싫어요가 되있는 상태라면
          if (DisLikeAction !== null) {
            setDisLikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("좋아요 up을 실패했습니다.");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("좋아요 취소를 실패했습니다.");
        }
      });
    }
  };

  const onDisLike = () => {
    if (DisLikeAction !== null) {
      Axios.post("/api/like/unDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDisLikeAction(null);
        } else {
          alert("Failed to decrease dislike");
        }
      });
    } else {
      Axios.post("/api/like/upDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDisLikeAction("disliked");

          // 좋아요가 되있는 상태라면
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("Failed to increase dislike");
        }
      });
    }
  };

  return (
    <React.Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          {LikeAction === "liked" ? (
            <LikeTwoTone onClick={onLike} />
          ) : (
            <LikeOutlined onClick={onLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          {DisLikeAction === "disliked" ? (
            <DislikeTwoTone onClick={onDisLike} />
          ) : (
            <DislikeOutlined onClick={onDisLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
      </span>
    </React.Fragment>
  );
}

export default LikeDislikes;
