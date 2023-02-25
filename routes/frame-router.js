const { Router } = require('express');

var FrameController = require('../controllers/frame-controller');

const router = Router();

router.get('/frame/:numeroFrame', FrameController.getFrame);
router.get('/frame/gallery/:numeroPagina', FrameController.getPage);
router.get('/frame/size/gallery', FrameController.getGallerySize);

module.exports = router;