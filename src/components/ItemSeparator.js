import React from 'react';
import {View} from 'react-native';

export const ItemSeparator = () => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        marginVertical: 8,
        borderColor: '#fb8c00',
        backgroundColor: '#fb8c00',
        borderRadius: 30,
        width: '80%',
      }}></View>
  );
};
