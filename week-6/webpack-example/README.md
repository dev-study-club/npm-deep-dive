# week-6: webpack basic service

간단한 webpack 학습용 프로젝트입니다.

## Requirements

- Node.js 18+
- npm

## Install

```bash
npm ci
```

## Run (dev)

```bash
npm run dev
```

- 기본 주소: `http://localhost:3000`
- HMR(핫 리로드) 활성화

## Build (prod)

```bash
npm run build
```

- 결과물은 `dist/`에 생성됩니다.

## Config structure

- `webpack/webpack.common.js`: 공통 설정
- `webpack/webpack.dev.js`: 개발 환경 설정
- `webpack/webpack.prod.js`: 배포 환경 설정
