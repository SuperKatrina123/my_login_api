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
        return res.send({msg: '该用户已经存在，请直接登录！'})
    }else {
        const user = await User.create({username, password:bcryptjs.hashSync(password, 5)});
        console.log(user.dataValues);
        res.send({msg: '注册成功！'});
    }
})

// 登录
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    const model = await User.findOne({where: {username: username}});
    console.log(model);

    if (!model) {
        return res.send({msg: '该用户不存在，请先注册！'})
    } else {
        // 如果存在username就要进行密码校验
        const passwordValid = bcryptjs.compareSync(password, model.dataValues.password);

        if (!passwordValid) {
            return res.send({msg: '密码错误！'})
        } else {
            // 生成token
            const token = jwt.sign({username}, 'ccken');
            res.send({token})
        }
    }
})


// 权限校验
router.post('/auth', async (req, res) => {
    // 获取token，token是在请求头里面的
    const token =  String(req.headers.authorization).split(' ').pop();
    // 如果没有token说明前面没有登录过或者是登录已经失效
    if (!token) return res.send({msg: '请登录！'})
    // 根据密钥和字段解析token
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