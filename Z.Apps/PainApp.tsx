import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function App2() {
  return (
    <View>
      <Text>App2</Text>
    </View>
  )
}

const styles = StyleSheet.create({})


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

import {RealmContext, Task} from './models/Task';
import {BSON} from 'realm';

const {useQuery, useRealm} = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  const addSleep = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: '💤',
        description: 'Sleep',
      });
    });
  }, [realm]);
  const addHygiene = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: '🧼',
        description: 'Sleep',
      });
    });
  }, [realm]);



  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  console.log('render');

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <Text>{`${item.title} - ${item.description}`}</Text>
        )}
      />
      <TouchableOpacity style={{backgroundColor: 'yellow'}} onPress={addSleep}>
        <Text>{'Log Sleep'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor: 'yellow' ,marginTop: 10}} onPress={addSleep}>
        <Text>{'Log Hygiene'}</Text>
      </TouchableOpacity>

    </View>
  );
}

export default App;
