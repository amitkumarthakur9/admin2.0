import React from 'react';
import { TouchableOpacity, Text, Pressable } from 'react-native';

const CustomButton = ({ onPress, title, disabled=false, style }) => {
  const buttonStyles = {
    backgroundColor: "",
    textColor: "",
    
  };



  if (disabled) {
    buttonStyles.backgroundColor = 'bg-gray-200'; // Gray color when disabled
    buttonStyles.textColor = 'text-gray-400'; // Gray color when disabled
  } else {
    buttonStyles.backgroundColor = `${style.button}`; // Blue color when enabled
    buttonStyles.textColor = `${style.text}`; // Blue color when enabled
  }

  console.log(buttonStyles.backgroundColor);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={
        `flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200 ${buttonStyles.backgroundColor}`
        
    }

    

      
    >
      <Text className={`${buttonStyles.textColor}`}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
