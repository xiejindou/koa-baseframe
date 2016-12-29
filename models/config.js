'use strict';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('config', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING
        },
        value: {
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: false,
        tableName: 'config',
        indexes: [
            {
                fields: ["id"]
            }
        ],
        classMethods: {
            insertToken: function* (token) {
                var row = this.build({id: 'token', value: token});
                return yield row.save();
            },
            insertHookToken: function*(token) {
                var row = this.build({id: 'web_hook_token', value: token});
                return yield row.save();
            },
            findToken: function*() {
                var row = yield this.findOne({where: {id: 'token'}, raw: true});
                return row ? row.value : null;
            },
            findHookToken: function*() {
                var row = yield this.findOne({where: {id: 'web_hook_token'}, raw: true});
                return row ? row.value : null;
            }
        }
    });
};
