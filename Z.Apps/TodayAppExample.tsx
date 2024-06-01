import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const TodoList: React.FC = () => {
 const [finishedItems, setFinishedItems] = useState<{ emoji: string; title: string; time: number; value: number }[]>([]);
 const [selectedTask, setSelectedTask] = useState<{ emoji: string; title: string } | null>(null);
 const [editIndex, setEditIndex] = useState<number | null>(null);


 const handleTaskSelect = (emoji: string, title: string) => {
   setSelectedTask({ emoji, title });
 };


 const handleHoursSpent = (time: number) => {
   if (selectedTask) {
     const value = time; // Assuming value is equal to time for simplicity, adjust if needed
     setFinishedItems(prevItems => [...prevItems, { ...selectedTask, time, value }]);
     setSelectedTask(null); // Reset selected task
   }
 };


 const handleEditTime = (index: number) => {
   setEditIndex(index);
 };


 const updateTime = (newTime: number) => {
   if (editIndex !== null) {
     const updatedItems = [...finishedItems];
     updatedItems[editIndex].time = newTime;
     setFinishedItems(updatedItems);
     setEditIndex(null);
   }
 };


 const deleteItem = (index: number) => {
   const updatedItems = [...finishedItems];
   updatedItems.splice(index, 1); // Remove the item at the specified index
   setFinishedItems(updatedItems);
 };


 return (
   <View style={styles.container}>
     <Text style={styles.headerText}>Logger</Text>
     <View style={styles.masterContainer}>
       <View style={styles.itemContainer}>
         <TouchableOpacity style={styles.button} onPress={() => handleTaskSelect('💤', 'Sleep')}>
           <Text style={styles.buttonText}>💤</Text>
         </TouchableOpacity>
       </View>
     </View>
    
     {selectedTask && (
       <View style={styles.hoursContainer}>
         <Text style={styles.selectText}>Select Hours Spent:</Text>
         <View style={styles.hoursOptions}>
           {Array.from({ length: 13 }, (_, i) => (
             <TouchableOpacity key={i} style={styles.hourButton} onPress={() => handleHoursSpent(i)}>
               <Text style={styles.hourButtonText}>{i}</Text>
             </TouchableOpacity>
           ))}
         </View>
       </View>
     )}
     <View style={styles.finishedContainer}>
       <Text style={styles.headerText}>Today</Text>
       <View style={styles.finishedItems}>
         {finishedItems.map((item, index) => (
           <View key={index} style={styles.finishedItem}>
             <Text style={styles.finishedItemEmoji}>{item.emoji}</Text>
             <Text style={styles.finishedItemText}>{item.title}</Text>
             <Text style={styles.finishedItemTime}>{item.time} hrs</Text>
             <TouchableOpacity onPress={() => handleEditTime(index)}>
               <Text style={styles.editButton}>Edit Time</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => deleteItem(index)}>
               <Text style={styles.x}> X </Text>
             </TouchableOpacity>
           </View>
         ))}
       </View>
     </View>
     {editIndex !== null && (
       <View style={styles.hoursContainer}>
         <Text style={styles.selectText}>Select New Time:</Text>
         <View style={styles.hoursOptions}>
           {Array.from({ length: 13 }, (_, i) => (
             <TouchableOpacity key={i} style={styles.hourButton} onPress={() => updateTime(i)}>
               <Text style={styles.hourButtonText}>{i}</Text>
             </TouchableOpacity>
           ))}
         </View>
       </View>
     )}
   </View>
 );
};


const styles = StyleSheet.create({
 container: {
   backgroundColor: '#F6F8FF',
   alignItems: 'center',
   marginTop: 20,
 },
 masterContainer: {
   marginTop: 10,
   gap: 2,
   flexDirection: 'row',
 },
 itemContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   backgroundColor: 'white',
   padding: 4,
   borderRadius: 5,
   marginBottom: 10,
 },
 button: {
   backgroundColor: 'white',
   paddingVertical: 8,
   paddingHorizontal: 20,
   borderRadius: 5,
 },
 buttonText: {
   color: 'black',
   fontSize: 16,
   fontWeight: 'bold',
 },
 finishedContainer: {
   marginTop: 20,
   alignItems: 'center',
 },
 finishedItems: {
   flexDirection: 'column',
   justifyContent: 'center',
 },
 finishedItem: {
   backgroundColor: 'white',
   flexDirection: 'row',
   padding: 10,
   margin: 5,
   borderRadius: 5,
   alignItems: 'center',
 },
 finishedItemEmoji: {
   fontSize: 20,
   fontWeight: 'bold',
   marginRight: 5,
 },
 finishedItemText: {
   fontSize: 20,
   fontWeight: 'bold',
 },
 finishedItemTime: {
   fontSize: 16,
   marginLeft: 5,
 },
 hoursContainer: {
   alignItems: 'center',
   marginTop: 20,
 },
 selectText: {
   fontSize: 20,
   fontWeight: 'bold',
 },
 hoursOptions: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'center',
   marginTop: 10,
 },
 hourButton: {
   backgroundColor: '#3498db',
   padding: 10,
   margin: 5,
   borderRadius: 5,
 },
 hourButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 editButton: {
   backgroundColor: '#27ae60',
   padding: 10,
   margin: 5,
   borderRadius: 5,
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 x: {
   padding: 2,
   backgroundColor: 'red',
 },
});


export default TodoList;
