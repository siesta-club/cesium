/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.114
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  CoplanarPolygonGeometryLibrary_default
} from "./chunk-JJ4VBOQ3.js";
import "./chunk-FP6GYBFX.js";
import {
  PolygonGeometryLibrary_default
} from "./chunk-4EBHOMFX.js";
import "./chunk-IX2JCCNM.js";
import {
  GeometryInstance_default
} from "./chunk-5WQ523AW.js";
import {
  GeometryPipeline_default
} from "./chunk-LZGHD6NY.js";
import "./chunk-R5X4OQT4.js";
import "./chunk-WBQCVXR3.js";
import "./chunk-PNBGBETF.js";
import "./chunk-AIPU2VSX.js";
import "./chunk-BZP4T2JJ.js";
import {
  arrayRemoveDuplicates_default
} from "./chunk-RAEV7K66.js";
import "./chunk-OVLG3FRS.js";
import "./chunk-VRGFV2UO.js";
import "./chunk-XWXM2O2R.js";
import {
  IndexDatatype_default
} from "./chunk-S6SKF6DT.js";
import {
  GeometryAttributes_default
} from "./chunk-VK3EJHWI.js";
import {
  GeometryAttribute_default,
  Geometry_default,
  PrimitiveType_default
} from "./chunk-JY5YEZFA.js";
import {
  BoundingSphere_default
} from "./chunk-F6SE42BK.js";
import "./chunk-WZU2YLWG.js";
import "./chunk-QZAD5O7I.js";
import {
  ComponentDatatype_default
} from "./chunk-GEJTYLCO.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-72SANQJV.js";
import "./chunk-RV7ZYPFT.js";
import "./chunk-6HZQPRUS.js";
import "./chunk-JXDC723O.js";
import {
  defaultValue_default
} from "./chunk-5M3U6ZMA.js";
import {
  Check_default
} from "./chunk-S4MAZ3SS.js";
import {
  defined_default
} from "./chunk-UGK3FCDY.js";

// packages/engine/Source/Core/CoplanarPolygonOutlineGeometry.js
function createGeometryFromPositions(positions) {
  const length = positions.length;
  const flatPositions = new Float64Array(length * 3);
  const indices = IndexDatatype_default.createTypedArray(length, length * 2);
  let positionIndex = 0;
  let index = 0;
  for (let i = 0; i < length; i++) {
    const position = positions[i];
    flatPositions[positionIndex++] = position.x;
    flatPositions[positionIndex++] = position.y;
    flatPositions[positionIndex++] = position.z;
    indices[index++] = i;
    indices[index++] = (i + 1) % length;
  }
  const attributes = new GeometryAttributes_default({
    position: new GeometryAttribute_default({
      componentDatatype: ComponentDatatype_default.DOUBLE,
      componentsPerAttribute: 3,
      values: flatPositions
    })
  });
  return new Geometry_default({
    attributes,
    indices,
    primitiveType: PrimitiveType_default.LINES
  });
}
function CoplanarPolygonOutlineGeometry(options) {
  options = defaultValue_default(options, defaultValue_default.EMPTY_OBJECT);
  const polygonHierarchy = options.polygonHierarchy;
  Check_default.defined("options.polygonHierarchy", polygonHierarchy);
  this._polygonHierarchy = polygonHierarchy;
  this._workerName = "createCoplanarPolygonOutlineGeometry";
  this.packedLength = PolygonGeometryLibrary_default.computeHierarchyPackedLength(
    polygonHierarchy,
    Cartesian3_default
  ) + 1;
}
CoplanarPolygonOutlineGeometry.fromPositions = function(options) {
  options = defaultValue_default(options, defaultValue_default.EMPTY_OBJECT);
  Check_default.defined("options.positions", options.positions);
  const newOptions = {
    polygonHierarchy: {
      positions: options.positions
    }
  };
  return new CoplanarPolygonOutlineGeometry(newOptions);
};
CoplanarPolygonOutlineGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = defaultValue_default(startingIndex, 0);
  startingIndex = PolygonGeometryLibrary_default.packPolygonHierarchy(
    value._polygonHierarchy,
    array,
    startingIndex,
    Cartesian3_default
  );
  array[startingIndex] = value.packedLength;
  return array;
};
var scratchOptions = {
  polygonHierarchy: {}
};
CoplanarPolygonOutlineGeometry.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = defaultValue_default(startingIndex, 0);
  const polygonHierarchy = PolygonGeometryLibrary_default.unpackPolygonHierarchy(
    array,
    startingIndex,
    Cartesian3_default
  );
  startingIndex = polygonHierarchy.startingIndex;
  delete polygonHierarchy.startingIndex;
  const packedLength = array[startingIndex];
  if (!defined_default(result)) {
    result = new CoplanarPolygonOutlineGeometry(scratchOptions);
  }
  result._polygonHierarchy = polygonHierarchy;
  result.packedLength = packedLength;
  return result;
};
CoplanarPolygonOutlineGeometry.createGeometry = function(polygonGeometry) {
  const polygonHierarchy = polygonGeometry._polygonHierarchy;
  let outerPositions = polygonHierarchy.positions;
  outerPositions = arrayRemoveDuplicates_default(
    outerPositions,
    Cartesian3_default.equalsEpsilon,
    true
  );
  if (outerPositions.length < 3) {
    return;
  }
  const isValid = CoplanarPolygonGeometryLibrary_default.validOutline(outerPositions);
  if (!isValid) {
    return void 0;
  }
  const polygons = PolygonGeometryLibrary_default.polygonOutlinesFromHierarchy(
    polygonHierarchy,
    false
  );
  if (polygons.length === 0) {
    return void 0;
  }
  const geometries = [];
  for (let i = 0; i < polygons.length; i++) {
    const geometryInstance = new GeometryInstance_default({
      geometry: createGeometryFromPositions(polygons[i])
    });
    geometries.push(geometryInstance);
  }
  const geometry = GeometryPipeline_default.combineInstances(geometries)[0];
  const boundingSphere = BoundingSphere_default.fromPoints(polygonHierarchy.positions);
  return new Geometry_default({
    attributes: geometry.attributes,
    indices: geometry.indices,
    primitiveType: geometry.primitiveType,
    boundingSphere
  });
};
var CoplanarPolygonOutlineGeometry_default = CoplanarPolygonOutlineGeometry;

// packages/engine/Source/Workers/createCoplanarPolygonOutlineGeometry.js
function createCoplanarPolygonOutlineGeometry(polygonGeometry, offset) {
  if (defined_default(offset)) {
    polygonGeometry = CoplanarPolygonOutlineGeometry_default.unpack(
      polygonGeometry,
      offset
    );
  }
  polygonGeometry._ellipsoid = Ellipsoid_default.clone(polygonGeometry._ellipsoid);
  return CoplanarPolygonOutlineGeometry_default.createGeometry(polygonGeometry);
}
var createCoplanarPolygonOutlineGeometry_default = createCoplanarPolygonOutlineGeometry;
export {
  createCoplanarPolygonOutlineGeometry_default as default
};
