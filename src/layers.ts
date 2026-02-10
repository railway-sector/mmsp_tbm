import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  MeshSymbol3D,
  FillSymbol3DLayer,
  LineSymbol3D,
  PathSymbol3DLayer,
  TextSymbol,
  LabelSymbol3D,
  TextSymbol3DLayer,
} from "@arcgis/core/symbols";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "a084d9cae5234d93b7aa50f7eb782aec",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Construction Boundary */

// Construction boundary
const ConstructionBoundaryFill = new UniqueValueRenderer({
  field: "MappingBoundary",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2.5,
          color: [220, 220, 220],
          style: "short-dash",
        },
      }),
    },
  ],
});

export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  renderer: ConstructionBoundaryFill,
  definitionExpression: "MappingBoundary = 1",
  title: "Construction Boundary",
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: false,
});

// * Station Box * //
const stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "U-Shape Retaining Wall",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "Cut & Cover Box",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM Shaft",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178],
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: "Station Platform",
      symbol: new SimpleFillSymbol({
        color: [240, 204, 230],
        style: "backward-diagonal",
        outline: {
          width: 0.4,
          color: "black",
        },
      }),
    },
    {
      value: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: "red",
        },
      }),
    },
    {
      value: "NATM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178, 0],
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: "grey",
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

// * Station Layer * //
const labelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 15,
        halo: {
          color: "black",
          size: 0.5,
        },
        font: {
          family: "Ubuntu Mono",
          //weight: "bold"
        },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  }),
  // labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Station",
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Station",
  labelingInfo: [labelClass],
  definitionExpression: "Project = 'MMSP'",
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* lot layer */
const lotDefaultSymbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [110, 110, 110],
    width: 0.7,
  },
});

const lotColor = [
  [112, 173, 71, 0.5],
  [0, 112, 255, 0.5],
  [255, 255, 0, 0.5],
  [255, 170, 0, 0.5],
  [255, 0, 0, 0.5],
  [0, 115, 76, 0.5],
];

const lotLayerStatusRenderer = new UniqueValueRenderer({
  field: "StatusNVS3",
  defaultSymbol: lotDefaultSymbol,
  uniqueValueInfos: [
    {
      value: 1,
      label: "Paid",
      symbol: new SimpleFillSymbol({
        color: lotColor[0],
      }),
    },
    {
      value: 2,
      label: "For Payment Processing",
      symbol: new SimpleFillSymbol({
        color: lotColor[1],
      }),
    },
    {
      value: 3,
      label: "For Legal Pass",
      symbol: new SimpleFillSymbol({
        color: lotColor[2],
      }),
    },
    {
      value: 4,
      label: "For Appraisal/Offer to Buy",
      symbol: new SimpleFillSymbol({
        color: lotColor[3],
      }),
    },
    {
      value: 5,
      label: "For Expro",
      symbol: new SimpleFillSymbol({
        color: lotColor[4],
      }),
    },
    {
      value: 6,
      label: "with WOP Fully Turned-over",
      symbol: new SimpleFillSymbol({
        color: lotColor[5],
      }),
    },
  ],
});

const lotLabel = new LabelClass({
  symbol: new TextSymbol({
    color: "black",
    font: {
      family: "Gill Sans",
      size: 8,
    },
  }),
  // labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.CN",
  },
});

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,
  title: "Land Acquisition",

  labelsVisible: false,
  labelingInfo: [lotLabel],
  renderer: lotLayerStatusRenderer,
  popupTemplate: {
    title: "<p>{Id}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "OWNER",
            label: "Land Owner",
          },
          {
            fieldName: "Station1",
          },
          {
            fieldName: "StatusNVS3",
            label: "<p>Status of Land Acquisition</p>",
          },
        ],
      },
    ],
  },
});

/* Lot boundary only */
const lotLayerBoundaryRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    style: "solid",
    outline: {
      color: [110, 110, 110],
      width: 1.5,
    },
  }),
});

const lotLayerBoundaryLabel = new LabelClass({
  symbol: new TextSymbol({
    color: "white",
    font: {
      // autocast as new Font()
      family: "Gill Sans",
      size: 8,
    },
  }),
  // labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.CN",
  },
});

export const lotLayerBoundary = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,
  title: "Lot Boundary",
  renderer: lotLayerBoundaryRenderer,
  labelingInfo: [lotLayerBoundaryLabel],
});

/* TBM Segment */
const tbmColor = {
  1: [225, 225, 225, 0.5], // To be Constructed (white), original: [225, 225, 225, 0.1]
  //1: "#ffffff",
  2: [232, 54, 24, 1], // Excavated
  3: [0, 112, 255, 0.8], // Completed
};

export const tbmDelayedRenderer = new UniqueValueRenderer({
  field: "delayed",
  uniqueValueInfos: [
    {
      value: 1,
      label: "Delayed Segment",
      symbol: new LineSymbol3D({
        symbolLayers: [
          new PathSymbol3DLayer({
            profile: "circle",
            material: {
              color: [255, 0, 0, 0.5],
            },
            width: 5,
            height: 5,
            join: "miter",
            cap: "butt",
            anchor: "bottom",
            profileRotation: "all",
          }),
        ],
      }),
    },
  ],
});

export const tbmStatusRenderer = new UniqueValueRenderer({
  field: "status",
  uniqueValueInfos: [
    {
      value: 1,
      label: "To be Constructed",
      symbol: new LineSymbol3D({
        symbolLayers: [
          new PathSymbol3DLayer({
            profile: "circle",
            material: {
              color: tbmColor[1],
            },
            width: 5,
            height: 5,
            join: "miter",
            cap: "butt",
            anchor: "bottom",
            profileRotation: "all",
          }),
        ],
      }),
    },
    {
      value: 2,
      label: "Excavating (Cutter Head)",
      symbol: new LineSymbol3D({
        symbolLayers: [
          new PathSymbol3DLayer({
            profile: "circle",
            material: {
              color: tbmColor[2],
            },
            width: 5,
            height: 5,
            join: "miter",
            cap: "butt",
            anchor: "bottom",
            profileRotation: "all",
          }),
        ],
      }),
    },
    {
      value: 3,
      label: "Segmented",
      symbol: new LineSymbol3D({
        symbolLayers: [
          new PathSymbol3DLayer({
            profile: "circle",
            material: {
              color: tbmColor[3],
            },
            width: 5,
            height: 5,
            join: "miter",
            cap: "butt",
            anchor: "bottom",
            profileRotation: "all",
          }),
        ],
      }),
    },
  ],
});

export const tbmTunnelLayer = new FeatureLayer({
  portalItem: {
    id: "518e9321de7745f68b34e48d54cce5fb",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "absolute-height",
    offset: -2,
  },
  hasZ: true,
  //definitionExpression: "Package = 'CP101'",
  // outFields: ["segmentno", "line", "SegmentLength", "Package", "status"],
  renderer: tbmStatusRenderer,
  title: "TBM Segment",
  popupTemplate: {
    title: "Ring No.: <b>{segmentno}</b> (<b>{line}</b>)",
    lastEditInfoEnabled: false,
  },
});

export const tbmTunnelSegmentedLengthLayer = new FeatureLayer({
  portalItem: {
    id: "518e9321de7745f68b34e48d54cce5fb",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "segmentno = 1",
});
tbmTunnelSegmentedLengthLayer.listMode = "hide";

export const tbmTunnelForZoomLayer = new FeatureLayer({
  portalItem: {
    id: "80d221702f5b4e73b7992aedeec9e2fc",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});
tbmTunnelForZoomLayer.listMode = "hide";

export const cutterHeadSpotLayer = new GraphicsLayer({
  title: "Cutter Head Position",
});

/* Station Structure */
export const stationStructureLayer = new SceneLayer({
  //structureLayer
  portalItem: {
    id: "fbb99839306e4e9fbf94818b53b4f142",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  popupEnabled: false,
  elevationInfo: {
    mode: "absolute-height",
    offset: 0,
  },
  title: "Station Structure",
  // when filter using date, example below. use this format
  //definitionExpression: "EndDate = date'2020-6-3'"
});
stationStructureLayer.renderer = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: {
          color: [225, 225, 225, 0],
          colorMixMode: "replace",
        },
        edges: new SolidEdges3D({
          color: [225, 225, 225, 0.3],
        }),
      }),
    ],
  }),
});

export const lotGroupLayer = new GroupLayer({
  title: "Land Acquisition",
  visible: false,
  visibilityMode: "independent",
  layers: [lotLayer, lotLayerBoundary],
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [stationBoxLayer, constructionBoundaryLayer], //stationLayer,
});

export const tbmGroupLayer = new GroupLayer({
  title: "TBM Tunnel",
  visible: false,
  visibilityMode: "independent",
  layers: [tbmTunnelLayer, cutterHeadSpotLayer],
});
