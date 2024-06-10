import React from 'react';
import { View, Text, Button,  } from 'react-native';

const StepTwoPDF = ({ onNext }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* <WebView source={{ uri: 'https://example.com/your-pdf-url' }} style={{ flex: 1 }} /> */}
      <Button title="E-sign and Submit" onPress={onNext} />
    </View>
  );
};

export default StepTwoPDF;
