import React, { useState } from "react";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CatogoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" },
];

function UploadVideoPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onChangeTitle = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onChangeDecsription = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onChangePrivate = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onChangeCategory = (event) => {
    setCategory(event.currentTarget.value);
  };

  const onDrop = (files) => {
    console.log(files);
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          url: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.fileName);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("썸네일 생성에 실패 했습니다.");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      catogory: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        message.success("성공적으로 업로드를 했습니다.");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        alert("비디오 업로드에 실패 했습니다.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {ThumbnailPath !== "" && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="썸네일"
              />
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onChangeTitle} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onChangeDecsription} value={Description} />
        <br />
        <br />

        <select onChange={onChangePrivate}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <select onChange={onChangeCategory}>
          {CatogoryOptions.map((item, index) => (
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          전송
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
