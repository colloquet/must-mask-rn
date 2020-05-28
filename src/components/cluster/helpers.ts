import GeoViewport, { BoundingBox } from '@mapbox/geo-viewport';
import { Dimensions } from 'react-native';
import { Region } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export const isMarker = (child: React.ReactElement) =>
  child &&
  child.props &&
  child.props.coordinate &&
  child.props.cluster !== false;

export const calculateBBox = (region: Region): BoundingBox => {
  let lngD;
  if (region.longitudeDelta < 0) lngD = region.longitudeDelta + 360;
  else lngD = region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta, // northLat - max lat
  ];
};

export const returnMapZoom = (
  region: Region,
  bBox: GeoViewport.BoundingBox,
  minZoom: number,
) => {
  const viewport =
    region.longitudeDelta >= 40
      ? { zoom: minZoom }
      : GeoViewport.viewport(bBox, [width, height]);

  return viewport.zoom;
};

export const markerToGeoJSONFeature = (
  marker: React.ReactElement,
  index: number,
) => {
  return {
    type: 'Feature',
    geometry: {
      coordinates: [
        marker.props.coordinate.longitude,
        marker.props.coordinate.latitude,
      ],
      type: 'Point',
    },
    properties: {
      point_count: 0,
      index,
      ..._removeChildrenFromProps(marker.props),
    },
    __sharing: marker.props.sharing,
  };
};

export const returnMarkerStyle = (points: number) => {
  if (points >= 50) {
    return {
      width: 84,
      height: 84,
      size: 64,
      fontSize: 20,
    };
  }

  if (points >= 25) {
    return {
      width: 78,
      height: 78,
      size: 58,
      fontSize: 19,
    };
  }

  if (points >= 15) {
    return {
      width: 72,
      height: 72,
      size: 54,
      fontSize: 18,
    };
  }

  if (points >= 10) {
    return {
      width: 66,
      height: 66,
      size: 50,
      fontSize: 17,
    };
  }

  if (points >= 8) {
    return {
      width: 60,
      height: 60,
      size: 46,
      fontSize: 17,
    };
  }

  if (points >= 4) {
    return {
      width: 54,
      height: 54,
      size: 40,
      fontSize: 16,
    };
  }

  return {
    width: 48,
    height: 48,
    size: 36,
    fontSize: 15,
  };
};

const _removeChildrenFromProps = (props: any) => {
  const newProps: any = {};
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      newProps[key] = props[key];
    }
  });
  return newProps;
};
