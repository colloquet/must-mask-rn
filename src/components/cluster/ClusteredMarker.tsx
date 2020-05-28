import React, { memo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';

import { returnMarkerStyle } from './helpers';

const ClusteredMarker = ({
  geometry,
  properties,
  onPress,
}: {
  geometry: any;
  properties: any;
  onPress: () => void;
}) => {
  const points = properties.point_count;
  const { width, height, fontSize, size } = returnMarkerStyle(points);

  return (
    <Marker
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: points + 1 }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.container, { width, height }]}
      >
        <View
          style={[
            styles.wrapper,
            {
              width,
              height,
              borderRadius: width / 2,
            },
          ]}
        />
        <View
          style={[
            styles.cluster,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize }]}>{points}</Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    backgroundColor: '#38b54a',
    opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#38b54a',
    zIndex: 1,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default memo(ClusteredMarker);
