import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Card from "./Card"

const { width } = Dimensions.get('window');

const initialData = [
    {
      id: 1,
      title: 'Card 1',
      data: ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Data 6'],
      children: [
        {
          id: 2,
          title: 'Card 1.1',
          data: ['Data 1.1', 'Data 1.2', 'Data 1.3', 'Data 1.4', 'Data 1.5', 'Data 1.6'],
          children: [
            {
              id: 3,
              title: 'Card 1.1.1',
              data: ['Data 1.1.1', 'Data 1.1.2', 'Data 1.1.3', 'Data 1.1.4', 'Data 1.1.5', 'Data 1.1.6'],
              children: [],
            },
          ],
        },
      ],
    },
  ];
  
const LumpsumAnalytics = () => {
    const [cardStack, setCardStack] = useState([initialData]);

  const handleCardPress = (card) => {
    if (card.children.length > 0) {
      setCardStack([...cardStack, card.children]);
    }
  };

  return (
    <ScrollView horizontal style={styles.container}>
      {cardStack.map((cards, index) => (
        <View key={index} style={[styles.cardColumn, ]}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onCardPress={handleCardPress} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:300,
  },
  cardColumn: {
    flexDirection: 'column',
  },
});



export default LumpsumAnalytics;
