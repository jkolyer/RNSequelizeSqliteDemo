import reactNativeSqliteStorage from 'react-native-sqlite-storage';

import * as migrations from './migrations.json'

export default class SchemaBuddy {
  public dbVersion: number
  private database: reactNativeSqliteStorage.SQLiteDatabase | undefined
  
  constructor() {
    this.dbVersion = 0
  }

  public loadMigrations() {
    return migrations
  }

  public async processMigrations(database: reactNativeSqliteStorage.SQLiteDatabase) {
    this.database = database
    this.dbVersion = await this.getDatabaseVersion(this.database);
    console.log(`*** processMigrations:  this.dbVersion = ${this.dbVersion}`)

    for (let versionIdx = 0; versionIdx <= this.dbVersion; versionIdx+=1) {
      const dbStatements: string[] = migrations[versionIdx]
      if (!dbStatements) {
        break
      }
      const numStmt = dbStatements.length
      
      for (let stmtIdx = 0; stmtIdx < numStmt; stmtIdx+=1) {
        const stmt = dbStatements[stmtIdx]
        console.log(`*** processMigrations:  ${stmt}`)
        
        await database.transaction((transaction: reactNativeSqliteStorage.Transaction) => {
          transaction.executeSql(stmt)
          
        }).catch((error: any) => {
          console.log(`Transaction failed (${stmt}). Details: ${error}`);
          return 0;
        });
        console.log(`*** processMigrations:  ${stmt} complete`)
      }
    }
  }

  // Get the version of the database, as specified in the Version table
  public getDatabaseVersion(database: reactNativeSqliteStorage.SQLiteDatabase): Promise<number> {
    // Select the highest version number from the version table
    return database
      .executeSql('SELECT version FROM DbVersion ORDER BY version DESC LIMIT 1;')
      .then(([results]: any[]) => {
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
