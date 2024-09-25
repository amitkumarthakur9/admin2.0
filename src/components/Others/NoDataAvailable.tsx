import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const NoDataAvailable = ({ message = "", height = "100%" }) => {
  return (
    <View style={[styles.container, { height: height }]}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/noDataAvailable.png")}
          style={styles.image}
          alt="No Data Available"
        />
        <Text style={styles.title}>No Data Available</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // take the full height and width of parent
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100, // Adjust the image size as needed
  },
  title: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NoDataAvailable;
