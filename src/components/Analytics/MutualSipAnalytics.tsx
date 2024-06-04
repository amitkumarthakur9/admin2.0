import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Card from './Card';

const { width } = Dimensions.get('window');

const nestedData = [
  {
    id: 1,
    rmList: [
      {
        rmName: 'Harish',
        liveSip: '205',
        liveAmount: '2,00,000',
        cancelledSip: '3',
        cancelledAmount: '24,000',
        failedSip: '3',
        failedAmount: '11,00',
        ifalist: [
          {
            ifaName: 'Ritish',
            liveSip: '205',
            liveAmount: '2,00,000',
            cancelledSip: '13',
            cancelledAmount: '24,000',
            failedSip: '3',
            failedAmount: '11,00',
            clientList: [
              {
                name: 'client 1',
                scheme: 'Axis',
                amount: '1000',
                status: 'cancelled',
                date: '24/01/23',
              },
            ],
          },
          {
            ifaName: 'Raju',
            liveSip: '205',
            liveAmount: '2,00,000',
            cancelledSip: '13',
            cancelledAmount: '24,000',
            failedSip: '3',
            failedAmount: '11,00',
            clientList: [
              {
                name: 'client 2',
                scheme: 'Axis',
                amount: '1000',
                status: 'cancelled',
                date: '24/01/23',
              },
              {
                name: 'client 3',
                scheme: 'Axis',
                amount: '1000',
                status: 'cancelled',
                date: '24/01/23',
              },
            ],
          },
        ],
      },
      {
        rmName: 'Manoj',
        liveSip: '205',
        liveAmount: '2,00,000',
        cancelledSip: '2',
        cancelledAmount: '24,000',
        failedSip: '3',
        failedAmount: '11,00',
        ifalist: [
          {
            ifaName: 'Ritish',
            liveSip: '205',
            liveAmount: '2,00,000',
            cancelledSip: '13',
            cancelledAmount: '24,000',
            failedSip: '3',
            failedAmount: '11,00',
            clientList: [
              {
                name: 'client 1',
                scheme: 'Axis',
                amount: '1000',
                status: 'cancelled',
                date: '24/01/23',
              },
            ],
          },
          {
            ifaName: 'Raju',
            liveSip: '205',
            liveAmount: '2,00,000',
            cancelledSip: '13',
            cancelledAmount: '24,000',
            failedSip: '3',
            failedAmount: '11,00',
            clientList: [
              {
                name: 'client 2',
                scheme: 'Axis',
                amount: '1000',
                status: 'cancelled',
                date: '24/01/23',
              },
            ],
          },
        ],
      },
    ],
    rmTotal:{
      title: "Total",
      liveSip: '205',
        liveAmount: '2,00,000',
        cancelledSip: '3',
        cancelledAmount: '24,000',
        failedSip: '3',
        failedAmount: '11,00',
    }
  },
];

const MutualSipAnalytics = () => {
  const [columns, setColumns] = useState([nestedData[0].rmList]);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardPress = (data, columnIndex) => {
    const newSelectedCards = [...selectedCards];
    newSelectedCards[columnIndex] = data;

    if (data.ifalist) {
      setColumns((prev) => [...prev.slice(0, columnIndex + 1), data.ifalist]);
      setSelectedCards(newSelectedCards);
    } else if (data.clientList) {
      setColumns((prev) => [...prev.slice(0, columnIndex + 1), data.clientList]);
      setSelectedCards(newSelectedCards);
    }
  };

  return (
    <ScrollView horizontal style={styles.container}>
      {columns.map((cards, columnIndex) => (
        <View key={columnIndex} style={[styles.cardColumn, { width: width / columns.length }]}>
          {cards.map((card, cardIndex) => (
            <Card
              key={cardIndex}
              data={card}
              onCardPress={() => handleCardPress(card, columnIndex)}
              selected={selectedCards[columnIndex] === card}
              isParentSelected={selectedCards.slice(0, columnIndex).includes(card)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardColumn: {
    flexDirection: 'column',
    // height: 800,
  },
});

export default MutualSipAnalytics;
