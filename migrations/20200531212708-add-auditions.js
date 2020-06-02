'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('auditions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    userId: {
      type: 'int',
      foreignKey: {
        name: 'audition_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    project: 'string',
    role: 'string',
    date: 'string',
    castingDirector: 'string',
    coaching: 'string',
    productionCompany: 'string',
    medium: 'string',
    source: 'string',
    method: 'string',
    notes: 'string',
    callback: 'string'
  })
};

exports.down = function(db) {
  return db.dropTable('auditions')
}


exports._meta = {
  "version": 1
};
