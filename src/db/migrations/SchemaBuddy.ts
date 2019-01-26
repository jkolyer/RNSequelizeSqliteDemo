import * as SQLite from 'react-native-sqlite-storage';

import * as migrations from './migrations.json'

export default class SchemaBuddy {
  dbVersion: number
  database: SQLite.SQLiteDatabase | undefined
  
  constructor() {
    this.dbVersion = 0
  }

  public loadMigrations() {
    return migrations
  }

  public async processMigrations(database: SQLite.SQLiteDatabase) {
    this.database = database
    this.dbVersion = await this.getDatabaseVersion(this.database);

    for (let versionIdx = 0; versionIdx <= this.dbVersion; versionIdx++) {
      const dbStatements: Array<string> = migrations[versionIdx]
      if (!dbStatements) {
        break
      }
      let numStmt = dbStatements.length
      
      for (let stmtIdx = 0; stmtIdx < numStmt; stmtIdx++) {
        const stmt = dbStatements[stmtIdx]
        
        await database.transaction((transaction: SQLite.Transaction) => {
          transaction.executeSql(stmt)
          
        }).catch((error: any) => {
          console.log(`Transaction failed (${stmt}). Details: ${error}`);
          return 0;
        });
      }
    }
  }

  // Get the version of the database, as specified in the Version table
  public getDatabaseVersion(database: SQLite.SQLiteDatabase): Promise<number> {
    // Select the highest version number from the version table
    return database
      .executeSql('SELECT version FROM DbVersion ORDER BY version DESC LIMIT 1;')
      .then(([results]: Array<any>) => {
        if (results.rows && results.rows.length > 0) {
          const version = results.rows.item(0).version;
          return version;
        } 
        return 0;
      })
      .catch((error: any) => {
        console.log(`No version set. Returning 0. Details: ${error}`);
        return 0;
      });
  }

}
