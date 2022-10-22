import React from 'react';
import {Text, View, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const TareasFinalizadas = ({ navigation }) => {
  return (
    <View>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fb8c00',
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 20,
            borderColor: '#fb8c00',
            borderWidth: 1,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', left: 10}}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Icon style={styles.icon} name="arrow-back-outline" />
          </TouchableOpacity>

          <Text style={styles.text}>Tareas Finalizadas</Text>
        </View>
        <ScrollView>

        </ScrollView>
      </View>
      
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
    color: '#FAFAFA',
  },
  text: {
    fontSize: 25,
    color: '#FAFAFA',
    marginBottom: 5,
  },
});












