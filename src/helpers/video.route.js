import express from 'express';
import {
  pullAllVideos,
  getAllVideos,
  getVideo,
  deleteVideo,
} from './video.controller.js';

const videoRoutes = express.Router();

videoRoutes.route('/pullAllVideos').get(pullAllVideos);
videoRoutes.route('/getAllVideos').get(getAllVideos);
videoRoutes.route('/getVideo/:id').get(getVideo).delete(deleteVideo);

export default videoRoutes;
