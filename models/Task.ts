import {Realm, createRealmContext} from '@realm/react';

export class Task extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  description!: string;
  duration!: number;

  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      description: 'string',
      duration: 'int',
    },
  };
}

export const RealmContext = createRealmContext({
  schema: [Task],
});
