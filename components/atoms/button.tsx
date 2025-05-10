import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

interface CustomButtonProps {
    title: string
    onPress?: () => void
    style?: object
}

const CustomButton: React.FC<CustomButtonProps> = ({title, onPress, style}) => {
  return (
    <TouchableOpacity style={[styles.button_container, style]} 
     activeOpacity={0.8}
     onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    button_container: {
        backgroundColor: '#00A884',
        paddingVertical: verticalScale(6.5),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(4),
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        width: '50%',
    },
    text: {
        color: 'white',
        fontSize: moderateScale(20),
    },
})