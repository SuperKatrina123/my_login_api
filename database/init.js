const { Sequelize } = require('sequelize');

const sequelize= new Sequelize('test_login', 'root', 'yyy674531', {
    host: 'localhost',
    // @ts-ignore
    port: '3306',
    dialect: 'mysql'
})


// 测试连接
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}


module.exports  = {Sequelize, sequelize};