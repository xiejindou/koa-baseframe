'use strict';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('logs', {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement:true,
            type: DataTypes.INTEGER
        },
        time: { //日志记录的时间
            allowNull: false,
            type: DataTypes.DATE
        },
        tag: { //标签，用以区别该日志的类型或者类别
            allowNull: false,
            type: DataTypes.STRING
        },
        message: {  // 日志的具体信息
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: false,
        tableName: 'logs',
        indexes: [
            {
                fields: ["time"]
            }
        ],
        classMethods: {
            common: function* (msg,tag) {
                var tg = tag || "common";
                return yield this.build({
                    time:new Date(),
                    tag: tg,
                    message: msg
                }).save();
            },
        }
    });
};
