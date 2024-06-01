import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet, Alert, Modal, TextInput, Button} from 'react-native';
import {RealmContext, Task} from './models/Task';
import {BSON} from 'realm';

const {useQuery, useRealm} = RealmContext;

function TaskContainer(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newDuration, setNewDuration] = useState('');

  const addSleep = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: '💤',
        description: 'Sleep',
        duration: 8, // Example duration in hours
      });
    });
  }, [realm]);

  const addHygiene = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: '🧼',
        description: 'Hygiene',
        duration: 1, // Example duration in hours
      });
    });
  }, [realm]);

  const deleteTask = useCallback((taskId) => {
    realm.write(() => {
      const taskToDelete = realm.objectForPrimaryKey('Task', taskId);
      if (taskToDelete) {
        realm.delete(taskToDelete);
      }
    });
  }, [realm]);

  const showEditModal = (taskId) => {
    setCurrentTaskId(taskId);
    setModalVisible(true);
  };

  const editTask = useCallback(() => {
    const duration = parseFloat(newDuration);
    if (!isNaN(duration) && duration > 0) {
      realm.write(() => {
        const taskToEdit = realm.objectForPrimaryKey('Task', currentTaskId);
        if (taskToEdit) {
          taskToEdit.duration = duration;
        }
      });
      setModalVisible(false);
      setNewDuration('');
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number for the duration.");
    }
  }, [realm, currentTaskId, newDuration]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  return (
    <View style={styles.Container}>
      <View style={styles.AppHeadrTitle}>
        <Text style={styles.AppHeadText}>
          Current
        </Text>
      </View>
      <View style={styles.masterTaskContainter}>
        <View style={styles.TaskContainter}>
          <TouchableOpacity style={styles.IndividualTaskContainter} onPress={addSleep}>
            <Text style={styles.TaskEmoji}>{'+'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.IndividualTaskContainter} onPress={addHygiene}>
            <Text style={styles.TaskEmoji}>{'🧼'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.FinishedItemsTitle}>
        <Text style={styles.FinishedItemsTitleText}>
          Logged Items 
        </Text>
      </View>
      <View style={styles.FinishedItemContainer}>
        <FlatList
          data={tasks}
          renderItem={({item}) => (
            <View style={styles.FinishedItem}>
              <Text style={styles.FinishedItemText}>{`${item.title} - ${item.description} (${item.duration} hrs)`}</Text>
              <TouchableOpacity style={styles.EditButton} onPress={() => showEditModal(item._id)}>
                <Text style={styles.EditButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.DeleteButton} onPress={() => deleteTask(item._id)}>
                <Text style={styles.DeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
            <Text style={styles.ModalTitle}>Edit Duration</Text>
            <TextInput
              style={styles.Input}
              placeholder="Enter new duration in hours"
              keyboardType="numeric"
              value={newDuration}
              onChangeText={setNewDuration}
            />
            <Button title="Save" onPress={editTask} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  
});

export default TaskContainer;
