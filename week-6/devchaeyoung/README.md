# 06 자바스크립트 번들 도구 살펴보기

> 개발자가 작성한 소스코드를 최종 결과물로 만들어내는 과정을 **번들링**이라 하며, 이를 수행하는 다양한 라이브러리가 자바스크립트 생태계에 존재한다.

패키지 내부에서 번들 라이브러리가 수행하는 동작을 이해하면 **애플리케이션 최적화를 위한 단서**를 얻을 수 있다.

---

## 6.1 번들링은 무엇이고 왜 필요한가

번들링은 기존 코드에서 **실제로 필요한 코드들만 모아 배포용 결과물을 만드는 과정**이다.

**필요한 이유:**

- **성능 개선**: 수십 개의 파일이 그대로 다운로드되면 네트워크 요청 횟수가 비례해서 증가한다. 번들링으로 파일 수를 줄여 HTTP 요청을 최소화한다.
- **파일 크기 최적화**: 공백·주석 제거(Minification), 변수명 축약 등으로 전송 용량을 줄인다.
- **호환성 문제 해결**: 최신 문법(ES2015+)을 구형 브라우저에서도 동작하도록 트랜스파일링한다.
- **다른 개발 도구와의 통합**: TypeScript, Sass, PostCSS 등 다양한 전처리기와 연계할 수 있다.

### 6.1.1 번들링의 역사

#### 6.1.1.1 초기 자바스크립트 환경

- 코드 규모가 작아서 `<script>` 태그 안에서 직접 관리했다.
- 여러 파일을 로드할 때 **전역 네임스페이스 오염** 문제가 발생했다.
- 파일 간 로드 순서를 수동으로 관리해야 했다.

#### 6.1.1.2 번들 라이브러리의 등장

| 도구 | 출시 | 핵심 특징 |
|------|------|-----------|
| **Browserify** | 2011 | Node.js의 `require()`를 브라우저에서 사용 가능하게 함. 파일 전체를 하나의 **IIFE(즉시 실행 함수)**로 감싸 전역 네임스페이스 오염을 방지 |
| **webpack** | 2012 | 의존성 그래프 기반, 로더/플러그인 생태계, 코드 분할, HMR 등 가장 풍부한 기능 제공 |
| **Rollup** | 2015 | ESModule 기반 번들링, 뛰어난 트리 셰이킹, 라이브러리 번들링에 강점 |
| **Parcel** | 2017 | Zero-config 철학, 자동 변환(HTML/CSS/JS), 빠른 빌드 |
| **esbuild** | 2020 | Go 언어로 작성, 기존 번들러 대비 10~100배 빠른 빌드 속도 |
| **Vite** | 2020 | 개발 시 네이티브 ESM + esbuild, 프로덕션 빌드 시 Rollup 사용 |

> **📌 보충**: Browserify의 IIFE 패턴은 모듈 시스템이 없던 시절의 해결책이었다. 각 모듈을 함수 스코프로 격리해 변수 충돌을 방지하는 원리다.

### 6.1.2 번들링의 역할

#### 코드 분할 (Code Splitting)

하나의 큰 번들 대신 **여러 개의 작은 청크(chunk)**로 나누는 기법이다.

**코드 분할이 필요한 경우:**

- **동적 로딩이 필요한 경우**: 사용자가 특정 페이지에 접근할 때만 해당 코드를 로드 (예: React의 `lazy()` + `Suspense`)
- **대규모 라이브러리를 사용해야 하는 경우**: `moment.js`, `lodash` 같은 큰 라이브러리를 별도 청크로 분리
- **네트워크 오버헤드 감소**: 초기 로딩 시 필요한 코드만 먼저 전송

```javascript
// 동적 import를 활용한 코드 분할 예시
const AdminPage = React.lazy(() => import('./AdminPage'));
```

#### 트리 셰이킹 (Tree Shaking)

번들 결과물을 생성할 때 **사용될 가능성이 없는 죽은 코드(dead code)를 제거**하는 것이다.

```javascript
// utils.js
export function used() { return 'I am used'; }
export function unused() { return 'I am NOT used'; }

// main.js
import { used } from './utils';
console.log(used());
// → 번들 결과물에서 unused()는 제거됨
```

> **📌 원본 노트 질문에 대한 답변 — "어떤 고급 기능?"**
>
> 정적 분석 기반의 단순한 사용 여부 판단을 넘어서, 고급 트리 셰이킹은 다음을 포함한다:
>
> - **Side Effect 분석**: `package.json`의 `"sideEffects": false` 선언을 통해 모듈 전체를 안전하게 제거할 수 있는지 판단. 예를 들어 `import './polyfill'`처럼 import 자체가 부수 효과를 일으키는 경우를 구분한다.
> - **모듈 간 교차 분석**: 하나의 모듈이 아닌 의존성 체인 전체를 추적하여, 간접적으로도 사용되지 않는 코드를 제거한다.
> - **속성 수준 제거**: 객체의 특정 속성만 사용되는 경우, 사용되지 않는 속성 관련 코드를 제거한다.
>
> ⚠️ **트리 셰이킹이 제대로 작동하려면 ESModule(`import`/`export`) 구문이 필수**다. CommonJS(`require`)는 동적이어서 정적 분석이 어렵다.

#### 난독화 및 압축 (Minification & Obfuscation)

- **Minification**: 공백, 주석 제거 + 변수명 축약 → 파일 크기 감소
- **Obfuscation**: 코드의 로직을 이해하기 어렵게 변환 → 리버스 엔지니어링 방지 (성능 목적이 아닌 보안 목적)

#### 결론

> 개발자가 유지보수하고 개발할 때 필요한 것과 별개로, **사용자에게 필요한 것만 줄여서 보내는 것** = 번들링의 역할

---

## 6.2 웹서비스 번들의 표준, 웹팩 (webpack)

### 6.2.1 웹팩 소개 및 주요 특징

- **다양한 모듈 번들링**: ESM, CommonJS, AMD 등 다양한 모듈 시스템 지원
- **코드 분할**: 동적 import, SplitChunksPlugin 등을 통한 청크 분리
- **로더(Loader)**: JS가 아닌 파일(CSS, 이미지, TS 등)을 모듈로 변환
- **플러그인(Plugin)**: 번들 과정 전체에 걸쳐 기능을 확장
- **개발 환경 지원**: webpack-dev-server, HMR(Hot Module Replacement)
- **최적화**: 프로덕션 모드에서 자동 최적화 (Terser, 트리 셰이킹 등)

### 6.2.2 웹팩의 기본 개념과 동작 원리

#### 6.2.2.1 의존성 그래프 (Dependency Graph)

구성 파일에 선언된 모듈 목록 및 최초 시작점(entry)을 토대로 애플리케이션을 **재귀적으로 순회**해서 필요한 모듈을 설정에 맞춰 한 개 이상의 번들 파일로 합친다. 이 작업을 위해 **사전에 구축하는 것이 의존성 그래프**다.

```
entry.js
  ├── moduleA.js
  │     ├── moduleC.js
  │     └── moduleD.js
  └── moduleB.js
        └── moduleC.js  (중복 → 한 번만 포함)
```

> **📌 보충**: 의존성 그래프는 **순환 참조(circular dependency)**를 감지하는 역할도 한다. A → B → A 같은 순환이 발생하면 런타임 오류나 예상치 못한 동작이 생길 수 있으므로, 번들러가 이를 경고해준다.

#### 6.2.2.2 엔트리 (Entry)

의존성 그래프를 생성하기 위한 **최초 진입점**이다.

**단일 엔트리 (SPA):**

```javascript
module.exports = {
  entry: './src/index.js',
};
```

**다중 엔트리 (MPA):**

```javascript
module.exports = {
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js',
  },
};
```

**dependOn을 이용한 공유 모듈:**

```javascript
module.exports = {
  entry: {
    app: { import: './app.js', dependOn: 'shared' },
    shared: ['react', 'react-dom'],
  },
};
```

> **📌 보충**: `dependOn`은 여러 엔트리가 공통 의존성을 공유할 때 **중복 번들링을 방지**하기 위해 사용한다. 위 예시에서 `react`와 `react-dom`은 `shared` 청크에 한 번만 포함된다.

#### 6.2.2.3 아웃풋 (Output)

번들 결과물의 **출력 경로와 파일명**을 설정한다.

**기본 설정:**

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
```

**다중 엔트리 + substitution 문법:**

```javascript
module.exports = {
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // home.js, about.js, contact.js
  },
};
```

**contenthash를 활용한 캐시 버스팅:**

```javascript
output: {
  filename: '[name]-[contenthash].js',
  // 예: home-a1b2c3d4.js
}
```

`[contenthash]`는 **파일 내용 기반으로 해시값을 생성**한다. 파일 내용이 변경되지 않으면 해시도 동일하므로, 브라우저 캐시를 효과적으로 활용할 수 있다.

**사용 가능한 substitution 템플릿:**

| 템플릿 | 설명 |
|--------|------|
| `[name]` | 엔트리 이름 |
| `[id]` | 청크 ID |
| `[hash]` | 컴파일 해시 (전체 빌드 기반) |
| `[chunkhash]` | 청크별 해시 |
| `[contenthash]` | 파일 내용 기반 해시 (가장 세밀한 캐시 제어) |
| `[query]` | 쿼리 문자열 |
| `[file]` | 파일명 + 확장자 |
| `[filebase]` | 파일명 (확장자 제외) |
| `[ext]` | 확장자 |

> **📌 보충 — hash vs chunkhash vs contenthash**
> - `[hash]`: 빌드 전체에 대한 해시. 어떤 파일이든 변경되면 모든 파일의 해시가 바뀜 → 캐시 효율 낮음
> - `[chunkhash]`: 청크 단위 해시. 해당 청크의 의존성이 변경될 때만 바뀜
> - `[contenthash]`: 개별 파일 내용 기반. **가장 정밀한 캐시 전략**에 적합 (CSS와 JS를 분리 추출할 때 특히 유용)

#### 6.2.2.4 로더 (Loader)

웹팩은 기본적으로 JS와 JSON만 이해한다. **로더는 다른 유형의 파일을 웹팩이 처리할 수 있는 모듈로 변환**한다.

두 가지 필수 속성: **`test`**(대상 파일 매칭)와 **`use`**(적용할 로더)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,      // .css 파일을 대상으로
        use: ['style-loader', 'css-loader'], // 오른쪽→왼쪽 순서로 적용
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

**주요 로더:**

| 로더 | 역할 |
|------|------|
| `babel-loader` | 최신 JS → 하위 호환 JS 변환 |
| `ts-loader` | TypeScript → JavaScript 변환 |
| `css-loader` | CSS 파일의 `@import`와 `url()` 해석 |
| `style-loader` | CSS를 DOM에 `<style>` 태그로 주입 |
| `sass-loader` | SCSS/Sass → CSS 변환 |
| `file-loader` | 파일을 출력 디렉토리에 복사하고 URL 반환 (webpack 5에서는 Asset Modules로 대체) |
| `url-loader` | 작은 파일은 Base64 인라인, 큰 파일은 file-loader 동작 (webpack 5에서는 Asset Modules로 대체) |
| `raw-loader` | 파일 내용을 문자열로 가져옴 (webpack 5에서는 Asset Modules로 대체) |

> **📌 보충**: 로더는 **오른쪽에서 왼쪽(또는 아래에서 위)**으로 실행된다. `['style-loader', 'css-loader']`는 `css-loader`가 먼저 실행되고 그 결과를 `style-loader`가 받는다.
>
> **webpack 5 참고**: `file-loader`, `url-loader`, `raw-loader`는 webpack 5부터 내장 **Asset Modules**(`asset/resource`, `asset/inline`, `asset/source`)로 대체되었다.

#### 6.2.2.5 플러그인 (Plugin)

로더가 **특정 유형의 파일을 모듈로 처리**하기 위한 것이라면, 플러그인은 **웹팩의 빌드 과정 전체에 걸쳐 기능을 확장**하기 위한 것이다. 로더와 달리 `new`를 통해 인스턴스를 생성해야 한다.

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new BundleAnalyzerPlugin(),
  ],
};
```

**자주 사용되는 플러그인:**

| 플러그인 | 역할 |
|----------|------|
| `DefinePlugin` | 컴파일 타임에 전역 상수를 정의 (`process.env.NODE_ENV` 등) |
| `HotModuleReplacementPlugin` | 전체 새로고침 없이 모듈 교체 (HMR) |
| `TerserWebpackPlugin` | JS 코드 압축·최적화 (프로덕션 모드에서 기본 활성화) |
| `BundleAnalyzerPlugin` | 번들 크기를 시각적으로 분석 |
| `HtmlWebpackPlugin` | 번들을 자동으로 포함하는 HTML 파일 생성 |
| `MiniCssExtractPlugin` | CSS를 별도 파일로 추출 |
| `CleanWebpackPlugin` | 빌드 전 출력 디렉토리 정리 (webpack 5에서는 `output.clean: true`로 대체 가능) |

#### 6.2.2.6 mode

웹팩에 내장된 환경 변수로 `development`, `production`, `none` 세 가지 값을 가진다.

| 항목 | development | production |
|------|-------------|------------|
| `devtool` | `eval` (빠른 소스맵) | `false` (소스맵 미생성) |
| `cache` | `memory` (메모리 캐시) | `false` |
| `optimization` | 최소한의 최적화 | Terser 압축, 트리 셰이킹, 스코프 호이스팅 등 활성화 |
| `DefinePlugin` | `process.env.NODE_ENV = 'development'` | `process.env.NODE_ENV = 'production'` |

> **📌 보충**: `production` 모드에서는 자동으로 `TerserPlugin`이 적용되고, `ModuleConcatenationPlugin`(스코프 호이스팅)이 활성화되어 번들 크기가 줄어든다.

#### 6.2.2.7 브라우저 호환성

웹팩 5는 ES5를 지원하는 모든 브라우저에서 동작한다. `import()`와 `require.ensure()`를 통한 동적 로딩에는 `Promise`가 필요하므로, 구형 브라우저 지원 시 `polyfill`을 추가해야 한다.

> **📌 보충**: `target` 옵션을 통해 특정 환경에 맞는 코드를 생성할 수 있다.
> ```javascript
> module.exports = {
>   target: ['web', 'es5'], // ES5 호환 웹 브라우저용 코드 생성
> };
> ```

### 6.2.3 간단한 웹팩 서비스 만들기

*(실습 내용은 원본 참고)*

---

## 6.3 패키지 번들의 선두주자, 롤업 (Rollup)

### 6.3.1 롤업의 등장 배경과 소개

롤업은 **라이브러리 번들링**에 특화되어 등장했다. 웹팩이 애플리케이션 번들링에 강점을 가진다면, 롤업은 **깔끔한 ESM 출력**과 **효율적인 트리 셰이킹**으로 npm 패키지 제작에 널리 사용된다.

> **📌 보충**: React, Vue, Svelte 등 유명 라이브러리들이 롤업으로 번들링된다. Vite의 프로덕션 빌드도 내부적으로 Rollup을 사용한다(Vite 6부터 Rolldown으로 전환 진행 중).

### 6.3.2 롤업의 기본 개념과 특징

- **ESModule 기반 모듈 번들링**: `import`/`export` 구문을 네이티브로 처리
- **여러 형태의 번들 출력 지원**: `esm`, `cjs`, `umd`, `iife`, `amd`, `system` 등
- **우수한 트리 셰이킹**: ESM 정적 분석을 기반으로 사용하지 않는 코드를 효과적으로 제거

**롤업 구성 파일 (`rollup.config.js`):**

```javascript
// rollup.config.js
export default {
  input: 'src/index.js', // = 웹팩의 entry
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs', // CommonJS
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm', // ES Module
    },
    {
      file: 'dist/bundle.umd.js',
      format: 'umd', // Universal Module Definition
      name: 'MyLibrary',
    },
  ],
  plugins: [
    // 롤업 플러그인들
  ],
  external: ['react', 'react-dom'], // 번들에 포함하지 않을 외부 모듈
};
```

**주요 필드:**

| 필드 | 설명 |
|------|------|
| `input` | 진입점. 문자열 배열로 여러 개 선언 가능 |
| `output` | 출력물 설정. 배열로 여러 포맷 동시 출력 가능 |
| `plugins` | 롤업 기능 확장을 위한 플러그인 |
| `external` | 번들에 포함하지 않을 외부 모듈 (peerDependencies 등) |

> **📌 웹팩 vs 롤업 비교**
>
> | 비교 항목 | webpack | Rollup |
> |-----------|---------|--------|
> | 주요 용도 | 애플리케이션 번들링 | 라이브러리 번들링 |
> | 모듈 시스템 | ESM, CJS, AMD 모두 지원 | ESM 중심 (CJS는 플러그인 필요) |
> | 출력 포맷 | 자체 런타임 포함 | 깔끔한 ESM/CJS/UMD 출력 |
> | 코드 분할 | 강력한 코드 분할 | 지원하지만 웹팩만큼 유연하지 않음 |
> | 트리 셰이킹 | 지원 (개선 중) | 더 효과적 |
> | 설정 복잡도 | 상대적으로 복잡 | 간결 |

---

## 6.4 번들 도구의 신흥 강자, 비트 (Vite)

### 6.4.1 비트의 등장 배경과 소개

기존 번들러(webpack)는 애플리케이션 규모가 커질수록 **개발 서버 시작과 HMR 속도가 느려지는 문제**가 있었다. Vite는 브라우저의 **네이티브 ESM 지원**을 활용하여 이 문제를 해결한다.

### 6.4.2 비트의 기본 개념과 특징

#### 롤업과 esbuild의 공존

| 단계 | 사용 도구 | 이유 |
|------|-----------|------|
| 개발 서버 | **esbuild** (의존성 사전 번들링) + 네이티브 ESM | 극도로 빠른 시작과 HMR |
| 프로덕션 빌드 | **Rollup** | 성숙한 플러그인 생태계, 안정적인 트리 셰이킹 |

> **📌 보충**: Vite 6부터는 Rollup 대신 **Rolldown**(Rust 기반 Rollup 호환 번들러)으로의 전환이 진행 중이다. 개발과 프로덕션 빌드의 일관성을 높이기 위한 목적이다.

#### 의존성 사전 번들링 (Dependency Pre-Bundling)

`node_modules`의 의존성을 esbuild로 미리 번들링해두는 과정이다.

**목적:**

1. **CommonJS → ESM 변환**: 네이티브 ESM에서 사용할 수 있도록 변환
2. **요청 수 감소**: `lodash-es`처럼 수백 개의 내부 모듈로 이루어진 패키지를 하나의 모듈로 합쳐 브라우저 요청을 줄임

> 예: `lodash-es`는 600개 이상의 내부 모듈이 있다. 사전 번들링 없이는 `import { debounce } from 'lodash-es'` 하나로 600+개의 HTTP 요청이 발생할 수 있다.

#### 모던 웹 환경을 위한 도전 — CommonJS 탈피

Vite는 **ESModule을 표준으로 채택**하고 CommonJS를 점진적으로 버리는 방향을 추구한다.

- 소스코드는 **ESM으로만 작성**해야 한다.
- ESM이 아닌 의존성은 **사전 번들링을 통해 ESM으로 변환**되어야 한다.
- CommonJS로 작성된 의존성을 사용할 경우, ESModule로 변환 준비가 필요하다.
- **Vite 6부터**: Vite API를 사용하는 외부 코드(플러그인 등)도 ESModule로 작성해야 한다.

> **📌 보충**: 이는 Node.js 생태계 전체의 ESM 전환 흐름과 맞닿아 있다. `"type": "module"`을 `package.json`에 선언하고, `.mjs` 확장자를 사용하는 패키지가 점점 늘고 있다.

### 6.4.3 설정에 필요한 주요 필드

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',           // 프로젝트 루트 디렉토리
  base: '/my-app/',        // 배포 시 public base path
  mode: 'development',     // 'development' | 'production'
  define: {                // 전역 상수 정의 (= 웹팩 DefinePlugin)
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  plugins: [],             // Vite 플러그인
  publicDir: 'public',     // 정적 파일 디렉토리
  cacheDir: 'node_modules/.vite', // 사전 번들링 캐시 디렉토리
  build: {                 // 프로덕션 빌드 옵션
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {},     // Rollup 옵션 직접 전달 가능
  },
});
```

| 필드 | 설명 |
|------|------|
| `root` | 프로젝트 루트 디렉토리 (index.html이 위치하는 곳) |
| `base` | 배포 시 베이스 경로 (CDN 경로 등) |
| `mode` | 환경 모드 설정 |
| `define` | 전역 상수 치환 (웹팩의 `DefinePlugin`과 동일) |
| `plugins` | Vite/Rollup 플러그인 배열 |
| `publicDir` | 정적 에셋 디렉토리 (빌드 시 그대로 복사됨) |
| `cacheDir` | 의존성 사전 번들링 캐시 저장 위치 |
| `build` | 프로덕션 빌드 관련 옵션 (`outDir`, `minify`, `rollupOptions` 등) |

---

## 📝 핵심 정리

| 번들러 | 주요 용도 | 핵심 강점 |
|--------|-----------|-----------|
| **webpack** | 웹 애플리케이션 | 풍부한 생태계, 유연한 설정, 강력한 코드 분할 |
| **Rollup** | 라이브러리/패키지 | 깔끔한 ESM 출력, 효과적인 트리 셰이킹 |
| **Vite** | 모던 웹 개발 | 빠른 개발 서버(네이티브 ESM), 간결한 설정 |

**선택 기준:**

- **웹 애플리케이션 개발** → Vite (개발 경험) 또는 webpack (레거시·복잡한 설정 필요 시)
- **npm 라이브러리 배포** → Rollup (또는 Vite의 Library Mode)
- **최대 빌드 속도** → esbuild (단독 사용 시 기능 제한 있음)