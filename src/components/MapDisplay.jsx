import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-search";
import {
  stationLayer,
  lotGroupLayer,
  tbmGroupLayer,
  stationStructureLayer,
  alignmentGroupLayer,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";

function MapDisplay() {
  const [sceneView, setSceneView] = useState();
  const arcgisScene = document.querySelector("arcgis-scene");

  useEffect(() => {
    if (sceneView) {
      arcgisScene.map.add(alignmentGroupLayer);
      arcgisScene.map.add(lotGroupLayer);
      arcgisScene.map.add(stationStructureLayer);
      arcgisScene.map.add(tbmGroupLayer);
      arcgisScene.map.add(stationLayer);
      arcgisScene.map.ground.opacity = 0.7;
      arcgisScene.view.environment.atmosphereEnabled = false;
      arcgisScene.map.ground.navigationConstraint = "none";
      arcgisScene.view.ui.components = [];
    }
  });

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom="13"
      center="121.0322874, 14.6750462"
      onarcgisViewReadyChange={(event) => {
        setSceneView(event.target);
      }}
    >
      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;
