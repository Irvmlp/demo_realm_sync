import { Realm } from '@realm/react';

export class Task2 extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;

  static schema = {
    name: 'Task2',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
    },
  };
}