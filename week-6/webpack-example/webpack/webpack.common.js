/**
 * webpack.common.js
 *
 * dev/prod 모두에서 공유하는 공통 설정.
 * webpack-merge를 통해 환경별 설정과 합쳐진다.
 *
 * 여기에 들어가는 것들
 * - entry / output: 번들의 시작점과 결과물 경로
 * - resolve: 모듈 탐색 규칙 (확장자 생략 등)
 * - 공통 loader: 환경과 무관하게 항상 필요한 로더
 * - 공통 plugin: HtmlWebpackPlugin 등
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  /**
   * entry: 웹팩이 번들링을 시작하는 진입점.
   * 여기서부터 import/require를 따라가며 의존성 그래프를 만든다.
   */
  entry: "./src/index.js",

  /**
   * output: 번들 결과물 설정.
   * - path: 결과물이 저장될 절대 경로
   * - filename: 출력 파일명
   * - clean: 빌드 전 output 폴더를 자동 정리
   */
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
    clean: true,
  },

  /**
   * resolve: 모듈을 찾는 방식 설정.
   * - extensions: import 시 확장자 생략 가능 목록
   *   예) import './utils' → ./utils.js 자동 탐색
   */
  resolve: {
    extensions: [".js", ".json"],
  },

  /**
   * plugins: 번들링 과정에 개입하는 확장 기능.
   *
   * HtmlWebpackPlugin:
   * - template HTML을 기반으로 번들 스크립트를 자동 주입한 HTML 생성
   * - <script> 태그를 수동으로 넣을 필요 없음
   */
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
