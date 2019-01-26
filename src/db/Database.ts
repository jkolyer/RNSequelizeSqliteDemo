/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
import SQLite from "react-native-sqlite-storage";
import { SchemaBuddy } from "./migrations/SchemaBuddy";
import { User } from "../types/User";
import { JsonData } from "../types/JsonData";
import { DropboxDatabaseSync } from "../sync/dropbox/DropboxDatabaseSync";

const DB_FILE_NAME = "SequelizeSQLiteDemo.db"

export interface Database {
  open(): Promise<SQLite.SQLiteDatabase>;
  close(): Promise<void>;
  // Create
  createUser(newUserTitle: string): Promise<void>;
  addJsonData(text: string, user: User): Promise<void>;
  // Read
  getAllUsers(): Promise<User[]>;
  getJsonDatas(user: User): Promise<JsonData[]>;
  // Update
  updateJsonData(jsonData: JsonData): Promise<void>;
  // Delete
  deleteUser(user: User): Promise<void>;
}

class DatabaseImpl implements Database {
  private database: SQLite.SQLiteDatabase | undefined;
  private databaseSync: DropboxDatabaseSync;

  constructor() {
    this.databaseSync = new DropboxDatabaseSync();
  }

  // Open the connection to the database
  public open(): Promise<SQLite.SQLiteDatabase> {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    let databaseInstance: SQLite.SQLiteDatabase;

    return SQLite.openDatabase({
      name: DB_FILE_NAME,
      location: "default"
    })
      .then(db => {
        databaseInstance = db;
        console.log("[db] Database open!");

        // Perform any database initialization or updates, if needed
        const databaseInitialization = new DatabaseInitialization();
        return databaseInitialization.updateDatabaseTables(databaseInstance);
      })
      .then(() => {
        this.database = databaseInstance;
        return databaseInstance;
      });
  }

  // Close the connection to the database
  public close(): Promise<void> {
    if (this.database === undefined) {
      return Promise.reject("[db] Database was not open; unable to close.");
    }
    return this.database.close().then(status => {
      console.log("[db] Database closed.");
      this.database = undefined;
    });
  }

  // Insert a new user into the database
  public createUser(newUserTitle: string): Promise<void> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("INSERT INTO User (title) VALUES (?);", [newUserTitle])
      )
      .then(([results]) => {
        const { insertId } = results;
        console.log(
          `[db] Added user with title: "${newUserTitle}"! InsertId: ${insertId}`
        );

        // Queue database upload
        return this.databaseSync.upload();
      });
  }

  // Get an array of all the users in the database
  public getAllUsers(): Promise<User[]> {
    console.log("[db] Fetching users from the db...");
    return this.getDatabase()
      .then(db =>
        // Get all the users, ordered by newest users first
        db.executeSql("SELECT owner_id as id, title FROM User ORDER BY id DESC;")
      )
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const users: User[] = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { title, id } = row;
          console.log(`[db] User title: ${title}, id: ${id}`);
          users.push({ id, title });
        }
        return users;
      });
  }

  public addJsonData(text: string, user: User): Promise<void> {
    if (user === undefined) {
      return Promise.reject(Error(`Could not add item to undefined user.`));
    }
    return this.getDatabase()
      .then(db =>
        db.executeSql("INSERT INTO JsonData (text, owner_id) VALUES (?, ?);", [
          text,
          user.id
        ])
      )
      .then(([results]) => {
        console.log(
          `[db] JsonData with "${text}" created successfully with id: ${
            results.insertId
          }`
        );

        // Queue database upload
        return this.databaseSync.upload();
      });
  }

  public getJsonDatas(user: User): Promise<JsonData[]> {
    if (user === undefined) {
      return Promise.resolve([]);
    }
    return this.getDatabase()
      .then(db =>
        db.executeSql(
          `SELECT item_id as id, text, done FROM JsonData WHERE owner_id = ? ${
            orderByDone ? "ORDER BY done" : ""
          };`,
          [user.id]
        )
      )
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const jsonDatas: JsonData[] = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { text, done: doneNumber, id } = row;
          const done = doneNumber === 1 ? true : false;

          console.log(`[db] User item text: ${text}, done? ${done} id: ${id}`);
          jsonDatas.push({ id, text, done });
        }
        console.log(`[db] User items for user "${user.name}":`, jsonDatas);
        return jsonDatas;
      });
  }

  public updateJsonData(jsonData: JsonData): Promise<void> {
    const doneNumber = jsonData.done ? 1 : 0;
    return this.getDatabase()
      .then(db =>
        db.executeSql(
          "UPDATE JsonData SET text = ?, done = ? WHERE item_id = ?;",
          [jsonData.dataBlob, doneNumber, jsonData.id]
        )
      )
      .then(([results]) => {
        console.log(`[db] User item with id: ${jsonData.id} updated.`);

        // Queue database upload
        return this.databaseSync.upload();
      });
  }

  public deleteUser(user: User): Promise<void> {
    console.log(
      `[db] Deleting user titled: "${user.name}" with id: ${user.id}`
    );
    return this.getDatabase()
      .then(db => {
        // Delete user items first, then delete the user itself
        return db
          .executeSql("DELETE FROM JsonData WHERE owner_id = ?;", [user.id])
          .then(() => db);
      })
      .then(db =>
        db.executeSql("DELETE FROM User WHERE owner_id = ?;", [user.id])
      )
      .then(() => {
        console.log(`[db] Deleted user titled: "${user.name}"!`);

        // Queue database upload
        return this.databaseSync.upload();
      });
  }

  private getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database: Database = new DatabaseImpl();
