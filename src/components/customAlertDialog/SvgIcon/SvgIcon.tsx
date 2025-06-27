/* eslint-disable quotes */
import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SvgIconProps {
  pathData: string; 
  size?: number;
  color?: string;
  viewBox?: string; 
  style?: any;
}

const SvgIcon: React.FC<SvgIconProps> = ({ pathData, size = 100, color = '#FFFFFF', viewBox = "0 0 512 512", style }) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={viewBox}>
        <Path d={pathData} fill={color} />
      </Svg>
    </View>
  );
};

export default SvgIcon;
