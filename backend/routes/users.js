var express = require('express');
const { register, 
        getAccount, 
        createPost, 
        getAllAccounts, 
        addNewFriend, 
        getAllPosts, 
        commentPost, 
        getCommentPost, 
        getListChatFriend, 
        saveMessage, 
        getImageValidation } = require('../controllers/controllers');
var router = express.Router();

// Đăng kí
router.post('/register', register);
// Đăng nhập
router.post('/auth/login', getAccount);
// Đăng bài
router.post('/createPost', createPost);
// Lấy accounts để kết bạn  
router.get('/getAllAccounts', getAllAccounts);
// ket ban
router.post('/addNewFriend', addNewFriend);
// lay post cua minh va ban be
router.post('/getAllPosts', getAllPosts);
// save comment
router.post('/saveComment', commentPost);
// get comment
router.post('/getCommentOfPost', getCommentPost);
// get all friends
router.post('/getListChatFriend', getListChatFriend);
// save chat
router.post('/saveChat', saveMessage);
// Image validation
router.post('/getImageValidation', getImageValidation)
module.exports = router;
