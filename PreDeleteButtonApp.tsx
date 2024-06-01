import React, {useCallback, useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';

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
        description: 'Hygiene',
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
    <View style={styles.Container}>
      <View style={styles.AppHeadrTitle}>
        <Text style={styles.AppHeadText}>
          The Today App
        </Text>
      </View>
      <View style={styles.masterTaskContainter}>
      <View style={styles.TaskContainter}>
      <TouchableOpacity style={styles.IndividualTaskContainter} onPress={addSleep}>
        <Text style={styles.TaskEmoji}>{'💤'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.IndividualTaskContainter} onPress={addHygiene}>
        <Text style={styles.TaskEmoji}>{'🧼'}</Text>
      </TouchableOpacity>
      </View></View>

      <View style={styles.FinishedItemsTitle}>
        <Text style={styles.FinishedItemsTitleText}>
          Logged Items 
        </Text>
      </View>
      <View style={styles.FinishedItemContainer}>
         <FlatList
        data={tasks}
        renderItem={({item}) => (
          <Text style={styles.FinishedItemText}>{`${item.title} - ${item.description}`}</Text>
        )}
      />
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  AppHeadrTitle:{
    margin: 30,
  },
  AppHeadText: {
    fontSize: 24,
    fontFamily: 'Opensans',
  },
  Container: {
    backgroundColor: '#F6F8FF',
    alignItems: 'center',
    marginTop: 20,
  },
  masterTaskContainter: {
    marginTop: 10,
    gap: 4,
    flexDirection: 'row',
  },
  TaskContainter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 4,
      gap: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    IndividualTaskContainter:{
     backgroundColor: 'white',
     paddingVertical: 8,
     paddingHorizontal: 20,
     borderRadius: 5,
   
    },
    TaskEmoji: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    FinishedItemsTitle: {
      margin: 30,
    }, 
    FinishedItemContainer: {
      marginVertical: 12,
    },
    FinishedItemsTitleText: {
      fontSize: 24,
      fontFamily: 'Opensans',
      alignItems: 'center',
      textAlign: 'center'
    }, 
    FinishedItemText: {
      fontSize: 14, 
      marginVertical: 4,
      backgroundColor: 'white',
      paddingVertical: 12,
      alignItems: 'center',
      textAlign: 'center'
    }
})

export default App;
