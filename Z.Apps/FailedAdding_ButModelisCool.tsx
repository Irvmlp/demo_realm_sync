import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet, Alert, Modal, TextInput, Button} from 'react-native';
import {RealmContext, Task} from './models/Task';
import {BSON} from 'realm';

const {useQuery, useRealm} = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newDuration, setNewDuration] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');

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
        duration: 0.5, // Example duration in hours
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
    setEditModalVisible(true);
  };

  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const addTask = useCallback(() => {
    const duration = parseFloat(newTaskDuration);
    if (newTitle && newDescription && !isNaN(duration) && duration > 0) {
      realm.write(() => {
        realm.create('Task', {
          _id: new BSON.ObjectId(),
          title: newTitle,
          description: newDescription,
          duration: duration,
        });
      });
      setAddModalVisible(false);
      setNewTitle('');
      setNewDescription('');
      setNewTaskDuration('');
    } else {
      Alert.alert("Invalid Input", "Please fill all fields with valid data.");
    }
  }, [realm, newTitle, newDescription, newTaskDuration]);

  const editTask = useCallback(() => {
    const duration = parseFloat(newDuration);
    if (!isNaN(duration) && duration > 0) {
      realm.write(() => {
        const taskToEdit = realm.objectForPrimaryKey('Task', currentTaskId);
        if (taskToEdit) {
          taskToEdit.duration = duration;
        }
      });
      setEditModalVisible(false);
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
          <TouchableOpacity style={styles.IndividualTaskContainter} onPress={showAddModal}>
            <Text style={styles.TaskEmoji}>{'➕'}</Text>
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
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
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
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
            <Text style={styles.ModalTitle}>Add New Task</Text>
            <TextInput
              style={styles.Input}
              placeholder="Enter title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.Input}
              placeholder="Enter description"
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <TextInput
              style={styles.Input}
              placeholder="Enter duration in hours"
              keyboardType="numeric"
              value={newTaskDuration}
              onChangeText={setNewTaskDuration}
            />
            <Button title="Add Task" onPress={addTask} />
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  AppHeadrTitle: {
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
  IndividualTaskContainter: {
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
    textAlign: 'center',
  },
  FinishedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderRadius: 5,
  },
  FinishedItemText: {
    fontSize: 14,
  },
  DeleteButton: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  DeleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  EditButton: {
    backgroundColor: 'blue',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  EditButtonText: {
    color: 'white',
    fontSize: 14,
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  ModalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  Input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default App;