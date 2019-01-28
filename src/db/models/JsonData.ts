import {Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export default class JsonData extends Model<JsonData> {
  @Column
  public dataId: string;

  @Column
  public dataBlob: string;

  @Column
  public ownerId: string;
  
  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}
