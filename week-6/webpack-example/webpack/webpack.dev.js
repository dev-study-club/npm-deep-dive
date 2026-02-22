/**
 * webpack.dev.js
 *
 * 개발 환경 전용 설정.
 * webpack.common.js와 merge되어 최종 설정을 구성한다.
 *
 * 개발 환경의 목표:
 * 1. 빠른 빌드 속도 (최적화 X)
 * 2. 디버깅 편의성 (source map)
 * 3. 즉각적인 피드백 (HMR)
 */

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  /**
   * mode: 'development'
   * - process.env.NODE_ENV를 'development'로 설정
   * - 최적화를 비활성화하여 빌드 속도 향상
   * - 유용한 에러 메시지와 경고 활성화
   */
  mode: "development",

  /**
   * devtool: source map 전략.
   *
   * 'eval-source-map'
   * - 원본 소스코드와 번들 코드를 매핑
   * - 브라우저 DevTools에서 원본 파일 그대로 디버깅 가능
   * - 초기 빌드는 느리지만 리빌드가 빠름
   *
   * 다른 옵션들
   * - 'eval': 가장 빠르지만 매핑 품질 낮음
   * - 'source-map': 가장 정확하지만 가장 느림
   * - 'cheap-module-source-map': 속도와 품질의 균형
   */
  devtool: "eval-source-map",

  /**
   * devServer: webpack-dev-server 설정.
   *
   * - port: 개발 서버 포트
   * - hot: HMR(Hot Module Replacement) 활성화
   *   → 전체 새로고침 없이 변경된 모듈만 교체
   * - open: 서버 시작 시 브라우저 자동 열기
   * - historyApiFallback: SPA 라우팅 지원
   *   → 모든 경로를 index.html로 폴백
   */
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },

  /**
   * module.rules: 파일별 처리 규칙.
   *
   * 개발 환경에서는 style-loader 사용
   * - CSS를 <style> 태그로 DOM에 직접 주입
   * - HMR과 호환되어 CSS 변경 시 즉시 반영
   * - 별도 CSS 파일을 만들지 않아 빠름
   *
   * 처리 순서 (배열의 역순으로 실행)
   * 1. css-loader: CSS 파일을 JS 모듈로 변환
   * 2. style-loader: 변환된 CSS를 DOM에 주입
   */
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
