const express = require('express')
const {protect}= require('../middlewares/authMiddleware')
const {accessChats, fetchChats,createGroupChats,renameGroup,addtoGroup,removeFromGroup} = require('../controllers/chatControllers');
const router= express.Router();

router.route('/').post(protect,accessChats)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect,createGroupChats)
router.route('/grouprename').put(protect,renameGroup)
router.route('/groupadd').put(protect,addtoGroup)
router.route('/groupremove').put(protect,removeFromGroup)
 module.exports =router;