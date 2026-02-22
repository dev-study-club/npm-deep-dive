/**
 * webpack.prod.js
 *
 * 프로덕션 환경 전용 설정.
 * webpack.common.js와 merge되어 최종 설정을 구성한다.
 *
 * 프로덕션 환경의 목표
 * 1. 번들 크기 최소화 (minify, tree-shaking)
 * 2. 캐시 최적화 (contenthash)
 * 3. CSS 추출 (별도 파일로 분리)
 */

const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  /**
   * mode: 'production'
   * - process.env.NODE_ENV를 'production'으로 설정
   * - TerserPlugin으로 JS 자동 압축
   * - Tree-shaking 활성화 (사용하지 않는 코드 제거)
   * - 모듈 ID를 결정적(deterministic)으로 생성
   */
  mode: "production",

  /**
   * devtool: 프로덕션 source map 전략.
   *
   * 'source-map'
   * - 별도 .map 파일 생성 (번들에 포함 X)
   * - 에러 추적용으로만 사용, 사용자에게 노출 안 됨
   * - 가장 정확한 매핑이지만 빌드 시간 증가
   *
   * false로 설정하면 source map 완전 비활성화 (보안상 권장되기도 함)
   */
  devtool: "source-map",

  /**
   * output 오버라이드
   *
   * [contenthash:8]: 파일 내용 기반 해시 (8자리)
   * - 파일 내용이 바뀔 때만 해시가 변경됨
   * - 브라우저 캐시 무효화(cache busting)에 활용
   * - 내용이 같으면 같은 해시 → 캐시 재사용
   */
  output: {
    filename: "[name].[contenthash:8].js",
  },

  /**
   * module.rules: 프로덕션 파일 처리 규칙.
   *
   * MiniCssExtractPlugin.loader
   * - style-loader 대신 사용
   * - CSS를 별도 파일로 추출 (DOM 주입 X)
   * - 브라우저가 CSS를 병렬 로드 가능 → 성능 향상
   * - 캐시 활용 가능
   */
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  /**
   * plugins: 프로덕션 전용 플러그인.
   *
   * MiniCssExtractPlugin
   * - CSS를 JS 번들에서 분리하여 별도 파일로 생성
   * - contenthash로 캐시 최적화
   */
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash:8].css",
    }),
  ],
});
