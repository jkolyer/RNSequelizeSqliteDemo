import {Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
  @Column
  public userId: string;

  @Column
  public name: string;

  @Column
  public authToken: string;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
  
}
