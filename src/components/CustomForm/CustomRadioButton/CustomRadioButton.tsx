import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const CustomRadioButton = ({ options, value, setValue }) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[styles.radioContainer, value === option.value && styles.selectedRadioContainer]}
          onPress={() => setValue(option.value)}
        >
          <View style={[styles.radioButton, value === option.value && styles.selectedRadioButton]}>
            {value === option.value && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.radioText}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  selectedRadioContainer: {
    // backgroundColor: '#e0e0e0',
    borderRadius: 5,
    // padding: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioButton: {
    borderColor: '#114EA8',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#114EA8',
  },
  radioText: {
    fontSize: 16,
  },
});

export default CustomRadioButton;
