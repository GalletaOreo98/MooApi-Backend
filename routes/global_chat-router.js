const { Router } = require('express');
const authJwt = require('../middlewares/authJwt');

var GlobalChatController = require('../controllers/global_chat-controller');


const router = Router();

router.get('/chatglobal', authJwt.verifyToken, GlobalChatController.getChat);
router.post('/chatglobal', authJwt.verifyToken, GlobalChatController.postChat);

module.exports = router;