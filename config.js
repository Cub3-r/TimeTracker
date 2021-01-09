var config = {};
config.db = {};
config.db.name = 'timeTrackdb.sqlite';
config.db.recTab = 'TimeTrack';
config.db.recTabCreate = `CREATE TABLE IF NOT EXISTS TimeTrack(ID INTEGER PRIMARY KEY AUTOINCREMENT, TOPIC TEXT, USER TEXT,COMMENT TEXT, START INTEGER, END INTEGER)`;
config.db.recTabInsertStart = 'INSERT INTO TimeTrack (TOPIC, USER, START) VALUES(?,?,?)';
config.db.recTabUpdateEndEntry = 'UPDATE TimeTrack SET END=? WHERE ID=?';
config.db.recTabUpdateGenericEntry = 'UPDATE TimeTrack SET COLSVALS WHERE ID=?';
config.db.recTabSelect = 'SELECT * FROM TimeTrack';

module.exports = config;