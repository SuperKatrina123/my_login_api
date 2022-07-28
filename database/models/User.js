const { Op, Model, DataTypes } = require('sequelize');
const { Sequelize, sequelize } = require('../init.js');

const User = sequelize.define('users_infos', {
    // 应用属性： 禁止null 唯一约束 验证器
    username: {
        type: DataTypes.STRING,  
        allowNull: false,   // 1. 禁止 null 值
        unique: true,   // 2. 唯一约束
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {    // 3. 验证器
        //     is: /^[0-9a-f]/i
        // }
    }
});

// 将模型与数据库同步
/*
    注意：如果表已经存在，使用{force: true}将该表删除 
*/ 
(async () => {
    await User.sync().then(() => {
        console.log('user表模型已经同步');
    })
})();


module.exports = User;



