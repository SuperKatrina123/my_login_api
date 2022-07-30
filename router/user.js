const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const User = require('../database/models/User');

// 注册
router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    // console.log(username);  // postman测试能够拿到username信息

    // 用户查询
    const model = await User.findOne({where: {username: username}});

    if (model) {
        return res.send({msg: 'The user already exists'})
    }else {
        const user = await User.create({username, password:bcryptjs.hashSync(password, 5)});
        // console.log(user.dataValues);
        res.send({msg: 'Registration success'});
    }
})

// 登录
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const model = await User.findOne({where: {username: username}});
    if (!model) {
        return res.send({msg: 'User does not exist'});
    } else {
        // 如果存在username就要进行密码校验
        // @ts-ignore
        const passwordValid = bcryptjs.compareSync(password, model.dataValues.password);

        if (!passwordValid) {
            return res.send({msg: 'Wrong password'});
        } else {
            // 生成token
            const token = jwt.sign({username}, 'ccken');
            // 把token设置到cookie
            res.setHeader('Set-Cookie', [`${username}=${token}`]);
            res.send({msg: 'Cookie set success!'});
        }
    }
})


// 权限校验
router.post('/auth', async (req, res) => {
    // 获取token，token是在请求头里面的
    const token =  String(req.headers.authorization).split(' ').pop();
    console.log(token);
    // 如果没有token说明前面没有登录过或者是登录已经失效
    if (!token) return res.send({msg: '请登录！'})
    // 根据密钥和字段解析token
    // @ts-ignore
    const {username} = jwt.verify(token, 'ccken');   // 之前使用username进行注册的
    // 对解析结果进行校验查询
    const model = User.findOne({where: {username: username}});
    if (!model) {
        return res.send({msg: '请注册！'});
    } else {
        res.send({msg: '权限校验成功！'})
    }
})

module.exports = router;