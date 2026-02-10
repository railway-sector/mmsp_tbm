/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  cutterHeadSpotLayer,
  dateTable,
  tbmTunnelLayer,
  tbmTunnelSegmentedLengthLayer,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import { IconSymbol3DLayer, PointSymbol3D } from "@arcgis/core/symbols";
import Graphic from "@arcgis/core/Graphic";

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "category = 'TBM Tunnel'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

export async function segmentedLengthData(tunnelL: any) {
  const query = tbmTunnelSegmentedLengthLayer.createQuery();
  query.outFields = ["line", "SegmentLength", "Package"];

  const query_segmentLength = "segmentno = 1";
  const qTunnel = "line = '" + tunnelL + "'";

  if (!tunnelL) {
    query.where = query_segmentLength;
  } else if (tunnelL) {
    query.where = qTunnel + " AND " + query_segmentLength;
  }

  return tbmTunnelSegmentedLengthLayer
    .queryFeatures(query)
    .then((response: any) => {
      const stats = response.features[0].attributes;
      const segmented_length = stats["SegmentLength"];
      return !tunnelL ? null : segmented_length;
    });
}

export async function generateTbmTunnelData(contractP: any, tunnelL: any) {
  const total_segment_number = new StatisticDefinition({
    onStatisticField: "line",
    outStatisticFieldName: "total_segment_number",
    statisticType: "count",
  });

  const total_segment_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN status = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_segment_comp",
    statisticType: "sum",
  });

  const total_segment_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN delayed = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_segment_delay",
    statisticType: "sum",
  });

  // Query
  const query = tbmTunnelLayer.createQuery();
  query.outStatistics = [
    total_segment_comp,
    total_segment_number,
    total_segment_delay,
  ];

  const qContractp = "Package = '" + contractP + "'";
  const qTunnel = "line = '" + tunnelL + "'";
  const qAll = qContractp + " AND " + qTunnel;

  // Query
  if (contractP && tunnelL) {
    query.where = qAll;
    tbmTunnelLayer.definitionExpression = qAll;
  } else {
    query.where = qContractp;
    tbmTunnelLayer.definitionExpression = qContractp;
  }

  // zoom to layer
  //zoomToLayer(tbmTunnelLayer);

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const total = stats.total_segment_number;
    const complete = stats.total_segment_comp;
    const pComp = (complete / total) * 100;

    const delay = stats.total_segment_delay;
    const pDelay = ((delay / total) * 100).toFixed(1);

    return [total, complete, pComp, delay, pDelay];
  });
}

export async function cutterHeadPositionData(contractP: any, tunnelL: any) {
  const query = tbmTunnelLayer.createQuery();

  const tbmSpot = "tbmSpot = 1";
  // eslint-disable-next-line no-useless-concat
  const qContractp = "Package = '" + contractP + "'" + " AND " + tbmSpot;
  // eslint-disable-next-line no-useless-concat
  const qTunnel = "line = '" + tunnelL + "'" + " AND " + tbmSpot;
  const qAll = qContractp + " AND " + qTunnel + " AND " + tbmSpot;

  // Query
  if (contractP && tunnelL) {
    query.where = qAll;
  } else if (contractP && !tunnelL) {
    query.where = qContractp;
  }

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0]?.attributes;
    const segmentN = stats?.segmentno;
    const tbmN = stats?.line;
    return [segmentN, tbmN];
  });
}

const spatialReference = SpatialReference.WebMercator;
export async function tbmCutterHeadSpotData(contractP: any, tunnelL: any) {
  cutterHeadSpotLayer.removeAll();
  const query = tbmTunnelLayer.createQuery();
  query.returnGeometry = true;
  query.groupByFieldsForStatistics = ["line"];

  const tbmSpot = "tbmSpot = 1";
  // eslint-disable-next-line no-useless-concat
  const qContractp = "Package = '" + contractP + "'" + " AND " + tbmSpot;
  // eslint-disable-next-line no-useless-concat
  const qTunnel = "line = '" + tunnelL + "'" + " AND " + tbmSpot;
  const qAll = qContractp + " AND " + qTunnel + " AND " + tbmSpot;

  // Query
  if (contractP && tunnelL) {
    query.where = qAll;
  } else if (contractP && !tunnelL) {
    query.where = qContractp;
  }

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    stats.forEach((result: any) => {
      const vertex = result.geometry.paths[0];
      const long = (vertex[0][0] + vertex[1][0]) / 2;
      const lat = (vertex[0][1] + vertex[1][1]) / 2;

      const point: any = {
        spatialReference: spatialReference,
        type: "point",
        x: long,
        y: lat,
        z: 5,
      };

      const symbol = new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: "https://EijiGorilla.github.io/Symbols/TBM_LOGO2.png",
            },
            size: 40,
          }),
        ],
        verticalOffset: {
          screenLength: 100,
          maxWorldLength: 500,
          minWorldLength: 40,
        },
        callout: {
          type: "line",
          size: 1.5,
          color: "#E83618",
          border: {
            color: "#E83618",
          },
        },
        // maxScale: 1000,
        // minScale: 25000000,
      });

      const myGraphic = new Graphic({
        geometry: point,
        symbol: symbol,
      });
      return cutterHeadSpotLayer.add(myGraphic);
    });
  });
}

export async function timeSeriesChartData(contractP: any, tunnelL: any) {
  const total_segment_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN status = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_segment_comp",
    statisticType: "sum",
  });

  const query = tbmTunnelLayer.createQuery();

  const qNoEndDate = "enddate IS NOT NULL";
  // eslint-disable-next-line no-useless-concat
  const qContractp = "Package = '" + contractP + "'" + " AND " + qNoEndDate;
  // eslint-disable-next-line no-useless-concat
  const qTunnel = "line = '" + tunnelL + "'" + " AND " + qNoEndDate;
  const qAll = qContractp + " AND " + qTunnel + " AND " + qNoEndDate;

  // Query
  if (contractP && tunnelL) {
    query.where = qAll;
    tbmTunnelLayer.definitionExpression = qAll;
  } else {
    query.where = qContractp;
    tbmTunnelLayer.definitionExpression = qContractp;
  }

  query.outStatistics = [total_segment_comp];
  query.outFields = ["enddate"];
  query.orderByFields = ["enddate"];
  query.groupByFieldsForStatistics = ["enddate"];

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;

    // collect all dates for each viaduct type
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const date = attributes.enddate;
      const value = attributes.total_segment_comp;

      // compile in object
      return Object.assign(
        {},
        {
          date: date,
          value: value,
        },
      );
    });
    return data;
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// Layer list
export const defineActions = (event: any) => {
  const item = event.item;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Soil Profile" ||
  item.title === "Land Acquisition" ||
  item.title === "Lot Boundary" ||
  item.title === "Station Structure"
    ? (item.visible = false)
    : (item.visible = true);
};

// dropdown data
export const initialDropdownObject = {
  field1: "CP101",
  field2: [
    {
      name: "SG1-NB",
    },
    {
      name: "SG1-SB",
    },
    {
      name: "SG2-NB",
    },
    {
      name: "SG2-SB",
    },
    {
      name: "SG3-NB",
    },
    {
      name: "SG3-SB",
    },
  ],
};

export const dropdownDataObject = [
  {
    field1: "CP101",
    field2: [
      {
        name: "SG1-NB",
      },
      {
        name: "SG1-SB",
      },
      {
        name: "SG2-NB",
      },
      {
        name: "SG2-SB",
      },
      {
        name: "SG3-NB",
      },
      {
        name: "SG3-SB",
      },
    ],
  },
  {
    field1: "CP102",
    field2: [
      {
        name: "SG4-NB",
      },
      {
        name: "SG4-SB",
      },
      {
        name: "SG5-NB",
      },
      {
        name: "SG5-SB",
      },
    ],
  },
  {
    field1: "CP103",
    field2: [
      {
        name: "SG6-NB",
      },
      {
        name: "SG6-SB",
      },
      {
        name: "SG7-NB",
      },
      {
        name: "SG7-SB",
      },
      {
        name: "SG8-NB",
      },
      {
        name: "SG8-SB",
      },
    ],
  },
  {
    field1: "CP104",
    field2: [
      {
        name: "SG9-NB",
      },
      {
        name: "SG9-SB",
      },
      {
        name: "SG10-NB",
      },
      {
        name: "SG10-SB",
      },
    ],
  },
  {
    field1: "CP105",
    field2: [
      {
        name: "SG11-NB",
      },
      {
        name: "SG11-SB",
      },
    ],
  },
  {
    field1: "CP108",
    field2: [
      {
        name: "SG12-NB",
      },
      {
        name: "SG12-SB",
      },
      {
        name: "SG13-NB",
      },
      {
        name: "SG13-SB",
      },
    ],
  },
];
