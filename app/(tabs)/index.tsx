import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [notes, setNotes] = useState<string[]>([]);
  const [noteText, setNoteText] = useState('');

  // Load notes from storage when app starts
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  const saveNotes = async (newNotes: string[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  const addNote = () => {
    if (noteText.trim() === '') {
      Alert.alert('Please enter a note');
      return;
    }
    const newNotes = [noteText, ...notes];
    setNotes(newNotes);
    saveNotes(newNotes);
    setNoteText('');
  };

  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>My Notes</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Write a note..."
        value={noteText}
        onChangeText={setNoteText}
      />

      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <ThemedText style={{ color: 'white' }}>Add Note</ThemedText>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.noteItem}>
            <ThemedText>{item}</ThemedText>
            <TouchableOpacity onPress={() => deleteNote(index)}>
              <ThemedText style={styles.deleteText}>Delete</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
