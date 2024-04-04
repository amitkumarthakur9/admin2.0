import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const HoverEffectComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  const onHoverEnter = () => {
    setIsHovered(true);
  };

  const onHoverLeave = () => {
    setIsHovered(false);
  };

  return (
    <PanGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onHoverEnter();
        } else {
          onHoverLeave();
        }
      }}
    >
      <View
        style={[
          styles.container,
          isHovered ? styles.hoveredContainer : null,
        ]}
      >
        <Text style={styles.itemText}>Hover over me!</Text>
        {isHovered && (
          <View style={styles.hoverContent}>
            <Text>This is the hover effect content.</Text>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  hoveredContainer: {
    backgroundColor: '#c0c0c0', // Change background color when hovered
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hoverContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HoverEffectComponent;
