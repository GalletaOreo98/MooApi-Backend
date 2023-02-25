const { Router } = require('express');

var VideoController = require('../controllers/videos-controller');

const router = Router();

router.get('/videos', VideoController.getVideos);

module.exports = router;