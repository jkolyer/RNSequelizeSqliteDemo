
import reactNativeFs from 'react-native-fs'
import {Sequelize} from 'sequelize-typescript';

class MySequelize {
  constructor() {
    const dbFileName = 'SequelizeReactNativeDB.db'
    const dbpath = `${reactNativeFs.LibraryDirectoryPath}/LocalDatabase/${dbFileName}`

    const sequelize =  new Sequelize({
      database: 'dbFileName',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: dbpath,
      modelPaths: [`${__dirname}/models`]
    });
  }
}

const obj = new MySequelize()
export default obj

