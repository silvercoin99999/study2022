const express = require("express");
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "video/mp4") {
    cb(null, true);
  } else {
    cb({ msg: "mp4 파일만 업로드 가능합니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

//=================================
//             Video
//=================================

// 클라이언트에서 가져온 비디오를 서버에 저장한다.
router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.json({
        success: true,
        filePath: res.req.file.path,
        fileName: res.req.file.filename,
      });
    }
  });
});

// 썸네일 생성하고 비디오 러닝타임도 가져오기
router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  // 비디오 러닝타임 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      console.log(filenames);

      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.log(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
});

// 비디오 정보들을 몽고DB에 저장한다.
router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

// 비디오를 DB에서 가져와서 클라이언트에 보낸다.
router.get("/getVideos", (req, res) => {
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

// 비디오 디테일 정보를 DB에서 가져와서 클라이언트에 보낸다.
router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

// 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
router.post("/getSubscriptionVideos", (req, res) => {
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);
      let subscribedUser = [];

      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 찾은 사람들의 비디오를 가지고 온다.
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

module.exports = router;
