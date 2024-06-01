// UserProfile.js

import { Realm, createRealmContext } from '@realm/react';

export class UserProfile extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  username!: string;
  email!: string;
  age!: number;

  static schema = {
    name: 'UserProfile',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      username: 'string',
      email: 'string',
      age: 'int',
    },
  };
}

export const UserProfileContext = createRealmContext({
  schema: [UserProfile],
});
