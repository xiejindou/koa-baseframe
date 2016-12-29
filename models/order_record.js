'use strict';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order_record', {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement:true,
            type: DataTypes.INTEGER
        },
        num: { //订单号
            allowNull: false,
            type: DataTypes.STRING
        },
        name: {　//客户姓名
            allowNull: false,
            type: DataTypes.STRING
        },
        tel: {　//　电话
            allowNull: false,
            type: DataTypes.STRING
        },
        products: {　//　购买商品
            allowNull: true,
            type: DataTypes.STRING
        },
        amount: { // 金额
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2)
        },
        remarks: {  // 备注信息
            allowNull: true,
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        underscored: true,
        freezeTableName: false,
        tableName: 'order_record',
        indexes: [
            {
                fields: ["num"]
            }
        ],
        classMethods: {
            
        }
    });
};
