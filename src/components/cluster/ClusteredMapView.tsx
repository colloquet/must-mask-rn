import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { Dimensions } from 'react-native';
import MapView, { MapViewProps, Region } from 'react-native-maps';
import SuperCluster from 'supercluster';
import ClusterMarker from './ClusteredMarker';
import {
  isMarker,
  markerToGeoJSONFeature,
  calculateBBox,
  returnMapZoom,
} from './helpers';
import { Sharing } from 'src/types';

interface Props extends MapViewProps {
  radius: number;
  maxZoom: number;
  minZoom: number;
  extent: number;
  nodeSize: number;
  children: JSX.Element[];
  onShowListView: (sharingList: Sharing[]) => void;
  mapRef: (map: MapView | null) => void;
  edgePadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

function ClusteredMapView({
  radius,
  maxZoom,
  minZoom,
  extent,
  nodeSize,
  children,
  onShowListView,
  onRegionChangeComplete,
  ...restProps
}: Props) {
  const [markers, updateMarkers] = useState<any[]>([]);
  const [currentRegion, updateRegion] = useState(
    restProps.region || restProps.initialRegion
  );
  const [superCluster, setSuperCluster] = useState<any>(null);

  const mapRef = useRef<null | MapView>(null);

  const propsChildren = useMemo(() => React.Children.toArray(children), [
    children,
  ]);

  useEffect(() => {
    const rawData: any[] = [];

    React.Children.forEach(children, (child: React.ReactElement, i) => {
      rawData.push(markerToGeoJSONFeature(child, i));
    });

    const _superCluster = new SuperCluster({
      radius,
      maxZoom,
      minZoom,
      extent,
      nodeSize,
    });

    _superCluster.load(rawData);

    setSuperCluster(_superCluster);
  }, [children, extent, minZoom, maxZoom, nodeSize, radius]);

  useEffect(() => {
    if (superCluster && currentRegion) {
      const bBox = calculateBBox(currentRegion);
      const zoom = returnMapZoom(currentRegion, bBox, minZoom);
      const _markers = superCluster.getClusters(bBox, zoom);
      updateMarkers(_markers);
    }
  }, [currentRegion, superCluster]);

  const _onRegionChangeComplete = (region: Region) => {
    if (superCluster) {
      updateRegion(region);
      if (onRegionChangeComplete) {
        onRegionChangeComplete(region);
      }
    }
  };

  const _onClusterPress = (cluster: any) => async () => {
    const _children = superCluster.getLeaves(cluster.id, Infinity);

    const coordinates = _children.map(({ geometry }: { geometry: any }) => ({
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    }));

    const camera = await mapRef.current?.getCamera();
    if (camera?.zoom === 21) {
      onShowListView(children.map((child: any) => child.__sharing));
      return;
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: restProps.edgePadding,
    });
  };

  return (
    <MapView
      {...restProps}
      ref={map => {
        restProps.mapRef(map);
        mapRef.current = map;
      }}
      onRegionChangeComplete={_onRegionChangeComplete}
    >
      {markers.map(marker =>
        marker.properties.point_count === 0 ? (
          propsChildren[marker.properties.index]
        ) : (
          <ClusterMarker
            key={`cluster-${marker.id}`}
            {...marker}
            onPress={_onClusterPress(marker)}
          />
        ),
      )}
    </MapView>
  );
};

ClusteredMapView.defaultProps = {
  // SuperCluster parameters
  radius: Dimensions.get('window').width * 0.06,
  maxZoom: 20,
  minZoom: 1,
  extent: 512,
  nodeSize: 64,
  // Map parameters
  edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
  // Callbacks
  onRegionChangeComplete: () => {},
  onShowListView: () => {},
  mapRef: () => {},
};

export default memo(ClusteredMapView);
