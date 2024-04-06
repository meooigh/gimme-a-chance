var mysql = require('mysql2/promise');
const {spawn} = require('child_process');

const pool =  mysql.createPool({
    host: '127.0.0.2',
    user: 'root',
    password: '123@abc',
    database: 'badass',
    multipleStatements: true
})

const register = async function(req, res, next){
    const UserName = req.body.UserName;
    const Password = req.body.Password;
    const email = req.body.email;
    const name = req.body.name;
    const date = req.body.date;

    const connection = await pool.getConnection();
   try
   {

        await connection.beginTransaction();

        const [personInfor] = await connection.execute(
            'INSERT INTO Persons(NameOfUser, DateOfBirth, Email) VALUES(?, ?, ?)', 
            [name, date, email]);

        const personID = personInfor.insertId;
        
        await connection.execute(
            'INSERT INTO Accounts(UserName, Password, PersonID, NickName) VALUES(?, ?, ?, ?)',
        [UserName, Password, personID, name]);

        await connection.commit();
        
        await res.send({success: true, message: 'your account has been created.'})
   }catch(error){
        await connection.rollback();
        throw error;
   }finally{
         if (connection) {
           connection.release();
        }
   }
}

const getAccount = async function (req, res, next) {
    const UserName = req.body.username;
    const Password = req.body.password;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [results] = await connection.query(
            "SELECT * FROM Accounts WHERE UserName = ? AND Password = ?",
            [UserName, Password]
        );
        if (results.length > 0) {
            res.json({ success: true, message: 'You are now logged in', data: results[0] });
        } else {
            res.send({ success: false, message: 'Invalid username or password' });
        }

        await connection.commit();
        
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const createPost = async function(req, res, next) {
    const Title = req.body.Title;
    const Image = req.body.Image;
    const TimeOfPost = req.body.TimeOfPost;
    const Author = req.body.Author;

    const connection = await pool.getConnection();
    try {
        await connection.query("INSERT INTO Posts(Title, Image, LikesOfPost, CommentsOfPost, TimeOfPost, Author) VALUES(?, ?, ?, ?, ?, ?)"
        , [Title, Image.path, 0, 0, TimeOfPost, Author]);

        res.send({ success: true, message: 'You posted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const getAllAccounts = async function (req, res, next) {
    const rowLimit = 10;
    const page = req.query.page;
    const offset = (page - 1) * rowLimit;

    const connection = await pool.getConnection();

    try {
        const [results] = await connection.query('SELECT PersonID, AccountID, NameOfUser FROM Accounts INNER JOIN Persons USING(PersonID) LIMIT ?, ?', [offset, rowLimit]);
        res.send({ success: true, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const addNewFriend = async function(req, res, next) {
    const userID = req.body.userID;
    const friendID = req.body.friendID;
    const connection = await pool.getConnection();
    console.log(userID, friendID);

    try {
        await connection.beginTransaction();

        // Check if the friendship already exists
        const existingFriendship = await connection.query('SELECT * FROM Friends WHERE (UserID = ? AND FriendID = ?) OR (UserID = ? AND FriendID = ?)',
            [userID, friendID, friendID, userID]);

        if (existingFriendship.length > 0) {
            res.send({ success: false, message: 'Friendship already exists.' });
        } else {
            // If the friendship does not exist, then insert the new friendship
            const results = await connection.query('INSERT INTO Friends(UserID, FriendID) VALUES(?, ?)', [userID, friendID]);

            if (results.affectedRows > 0) {
                res.send({ success: true, message: 'You added a new friend.' });
            } else {
                res.send({ success: false, message: 'There is something wrong!' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const getAllPosts = async function(req, res, next){
    const UserID = req.body.UserID;
    const page = req.query.page;
    const rowLimit = 3;
    const offset = (page - 1)*rowLimit;

    const connection = await pool.getConnection();
    try{
        const [result] = await connection.query('CALL get_post_friends(?, ?, ?)',
        [UserID, offset, rowLimit])
        if(result.length > 0)
        {
            res.send({success: true, message: 'Get all posts successfully!', data: result[0]});
        }else{
            res.send({success: false, message: 'There is something wrong!' });
        }
    }catch(error)
    {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error '});
    }finally{
        connection.release()
    }
};

const increaseLikes = async function(res, req, next){
    const idOfPost = req.body.idOfPost;
    const connection = await pool.getConnection();
    try{
        const result = connection.query('CALL increase_likes(?)',
        [idOfPost]);
        if(result.affectedRows > 0 )
        {
            res.send({success: true})
        }else{
            res.send({success: false, message: 'There is something wrong with the increaseLikes function.'})
        }
    }catch(error)
    {
        console.error(error)
        res.status(500).json({success: false, message: 'Internal server error '});
    }finally{
        connection.release();
    }
};

const commentPost = async function(req, res, next){
    const {AccountID, ToAccountID, PostID, ContentOfComment} = req.body;
    const connection = await pool.getConnection();
    try{
        await connection.beginTransaction();

        const [commentInfor] = await connection.query("INSERT INTO Comments(ContentOfComment) VALUES(?)",
        [ContentOfComment])
        const CommentID = commentInfor.insertId;
      
        await connection.query("INSERT INTO CommentSend(AccountID, CommentID, PostID, ToAccountID) VALUES(?, ?, ?, ?)",
        [AccountID, CommentID, PostID, ToAccountID]);
        
        await connection.commit();
        
        await res.send({success: true, message: 'commentPost function working perfectly.'})
    }catch(error)
    {
        await connection.rollback();
        res.status(500).json({success: false, message: 'Internal server error '});
    }finally{
        connection.release();
    }
};
const getCommentPost = async function(req, res, next){
    const {PostID} = req.body
    const connection = await pool.getConnection();
    try{
       const [result] = await connection.query("CALL get_comment_of_post(?)", [PostID]);
       if(result.length > 0)
       {
           res.send({success: true, message: 'Get all comment of post successfully!', data: result[0]});
       }else{
           res.send({success: false, message: 'There is something wrong!' });
       }
    }catch(error){
        console.log(error);
        await connection.rollback();
        res.status(500).json({success: false, message: 'Internal server error '});
    }finally{
        connection.release();
    }
}
const getListChatFriend = async(req, res, next) =>{
    const UserID = req.body.UserID;
    const connection = await pool.getConnection();

    try{
        const [result] = await connection.query("CALL get_all_friends(?)", [UserID]);
        if(result.length > 0)
        {
            res.send({success: true, message: 'Get all friends successfully!', data: result[0]});
        }else{
            res.send({success: false, message: 'Get all friends wrong!' });
        }
     }catch(error){
         console.log(error);
         await connection.rollback();
         res.status(500).json({success: false, message: 'Internal server error '});
     }finally{
         connection.release();
     }
};

const saveMessage = async(req, res, next) =>{
    const {data} = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for(elem in data)
        {
            const [chatContent] = await connection.query('INSERT INTO ChatContent(ContentOfChat) VALUES(?)', 
            [elem.message]);
            const ChatContentID = chatContent.insertId;
            await connection.query('INSERT INTO ChatContentSend(AccountID, ChatContentID, ToAccountID,) VALUES(?, ?, ?)',
            [elem.AccountID, ChatContentID, elem.ToAccountID])
        }
        console.log('Messages saved successfully.');
        await connection.commit();
        
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getImageValidation = async(req, res, next) =>{
    const ImageValidation = req.body.imageValidation;

    console.log(ImageValidation.data)

    const pythonProcess = spawn('python', ['D:\\project\\facial_recognition\\predict_face.py']);
    
    pythonProcess.stdin.write(JSON.stringify(ImageValidation.data));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data);
        console.log(result);
    });

}

module.exports ={
    register,
    getAccount,
    getAllAccounts,
    createPost,
    addNewFriend,
    getAllPosts,
    increaseLikes,
    commentPost,
    getCommentPost,
    getListChatFriend,
    saveMessage,
    getImageValidation
}