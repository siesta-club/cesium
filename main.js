import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";
// Get your token from https://cesium.com/ion/tokens
Cesium.Ion.defaultAccessToken = 'your_token_here';
// Cesium ionの読み込み指定
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg5MmViYWQiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE";

  
// Terrainの指定（EGM96、国土数値情報5m標高から生成した全国の地形モデル、5m標高データが無い場所は10m標高で補完している）
var viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: IonResource.fromAssetId(770371)
  })
});

viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);

// imageryProviderを設定
var imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
      baseLayerPicker: true,
      timeline : true,
      animation : true,
      homeButton: true,
      vrButton: true,
      geocoder:true,
      sceneModePicker:true,
      navigationHelpButton:true
});

//add point
viewer.entities.add({
  name:"博多駅", //レイヤ名
  description:"博多駅",　//レイヤの説明
    position : Cesium.Cartesian3.fromDegrees(130.42034071723572,33.590188336436,100), //経度,緯度,高さ
    point : {
        pixelSize : 10, //ポイントのサイズ
        color : Cesium.Color.BLUE //ポイントの色
    }
});

viewer.dataSources.add(Cesium.KmlDataSource.load("http://agora.ex.nii.ac.jp/digital-typhoon/kml/typhoon/wnp/2023.ja.kmz"));

//geojson kml add できなーーーい
//
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('https://siesta-club.github.io/cesium/gmap/sample_rain.geojson', {
  stroke: Cesium.Color.HOTPINK,
  fill: Cesium.Color.PINK,
  strokeWidth: 3,
  markerSymbol: '?'
}));

viewer.dataSources.add(Cesium.KmlDataSource.load('https://siesta-club.github.io/cesium/gmap/river_line.kmz'));

// viewer.dataSources.add(
//     Cesium.KmlDataSource.load("https://www.siesta-club.co.jp/www/gmap/sampleKML_1.kmz", {
//         camera: viewer.camera,
//         canvas: viewer.canvas
//     })
// );

//①建物モデルの追加
var your_3d_tiles =viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url : 'https://assets.cms.plateau.reearth.io/assets/b7/698db2-2d1a-415f-9906-c8a54261fccd/40130_fukuoka-shi_2022_3dtiles_1_op_bldg_40132_hakata-ku_lod2/tileset.json'
}));
// ②カメラのズーム
viewer.zoomTo(your_3d_tiles);

