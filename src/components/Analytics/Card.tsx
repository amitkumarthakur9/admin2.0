import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ data, onCardPress, selected, isParentSelected }) => {
  const keys = Object.keys(data).filter((key) => !Array.isArray(data[key]));

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
        isParentSelected && styles.parentSelectedCard,
      ]}
      onPress={() => onCardPress(data)}
    >
      <View className="flex flex-row flex-wrap">
        {keys.map((key, index) => (
          <View key={index} style={styles.cardRow}>
            <Text style={styles.cardLabel}>{data[key]}</Text>
            <Text style={styles.cardValue}>{key}:</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#d0e7ff',
  },
  parentSelectedCard: {
    backgroundColor: '#e6f2ff',
  },
  cardRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: 120,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  cardValue: {
    fontSize: 14,
    color: '#555',
  },
});

export default Card;
