# 06장 스터디 기록 정리

## 추가 학습 리소스

### 영상

- [Webpack & Bundler 개념 영상](https://www.youtube.com/watch?v=MVuyYlFEwro&list=LL&index=1&t=1s)
- [번들러 관련 영상](https://www.youtube.com/watch?v=tDZ8xbO5OAc)

### 아티클

- [번들러 춘추전국 시대 (요즘IT)](https://yozm.wishket.com/magazine/detail/1261/) — 다양한 번들러의 등장과 경쟁 구도를 정리한 글

### Vite 8 + Rolldown

- [Vite 8 Beta 공식 블로그](https://vite.dev/blog/announcing-vite8-beta)
- **핵심 변화**: Vite 8부터 내부 번들러가 **Rollup → Rolldown**으로 전환된다.
- **Rolldown이란?**: Rust로 작성된 Rollup 호환 번들러. Rollup의 플러그인 API를 그대로 지원하면서 빌드 속도를 대폭 개선하는 것이 목표다.
- **왜 바꾸나?**: Vite는 개발 시 esbuild, 프로덕션 시 Rollup을 사용하는 이중 구조였는데, 이로 인해 개발/프로덕션 간 미묘한 동작 차이가 발생할 수 있었다. Rolldown으로 통합하면 **양쪽을 하나의 번들러로 일관성 있게 처리**할 수 있다.

### 참고할 만한 오픈소스 라이브러리

- [react-datepicker](https://github.com/Hacker0x01/react-datepicker) — React용 날짜 선택 컴포넌트. 오픈소스 라이브러리의 번들링 구성을 살펴보기 좋은 예시.
- [D3.js](https://github.com/d3/d3) — 데이터 시각화(그래프) 분야의 시조새 라이브러리. 모듈이 수십 개의 하위 패키지로 분리되어 있어 트리 셰이킹과 코드 분할의 실제 사례를 확인할 수 있다.

### 롤업 이름의 유래

"Rollup"은 여러 개의 모듈을 하나로 **말아 올린다(roll up)**는 의미에서 유래했다. 여러 장의 종이를 둘둘 말아서 하나의 두루마리로 만드는 이미지를 떠올리면 된다.

### Terser — 오래가는 라이브러리의 대표

- [terser GitHub](https://github.com/terser/terser)
- **용도**: JavaScript 코드를 **minify(압축)**해주는 도구. 변수명 축약, 공백·주석 제거, 죽은 코드 제거 등을 수행한다.
- 번들러마다 Terser를 감싸서 플러그인으로 제공한다:
  - webpack → `TerserWebpackPlugin` (production 모드 기본 내장)
  - Rollup → `@rollup/plugin-terser`
  - Vite → `build.minify: 'terser'` 옵션 (기본값은 esbuild minify)
- Terser는 UglifyJS의 후속 프로젝트로, ES6+ 문법을 지원하면서 꾸준히 유지보수되고 있다. 번들러가 바뀌어도 minifier로서 계속 살아남는, **오래가는 라이브러리의 좋은 예시**다.

> **esbuild minify vs Terser**: Vite는 기본적으로 esbuild로 minify하는데, esbuild가 훨씬 빠르다. 다만 Terser가 압축률이 약간 더 높고 세밀한 옵션을 제공하므로, 번들 크기가 극도로 중요한 경우 Terser를 선택하기도 한다.

### vite-tsconfig-paths

- [npm: vite-tsconfig-paths](https://www.npmjs.com/package/vite-tsconfig-paths)
- **용도**: `tsconfig.json`에 설정한 **path alias를 Vite가 자동으로 인식**하게 해주는 플러그인

```javascript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```javascript
// vite.config.js
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
});
```

- 이 플러그인 없이는 Vite의 `resolve.alias`에 같은 경로를 **중복으로 설정**해야 한다. 플러그인을 쓰면 tsconfig 하나로 TypeScript와 Vite 양쪽의 경로 해석을 통일할 수 있다.

---

## Vite 플러그인 — 실무에서 자주 쓰는 것들

스터디에서 공유된 플러그인과 그 용도를 정리한다.

### rollup-plugin-visualizer

- **용도**: 번들 결과물의 크기를 **시각적으로 분석**하는 플러그인
- webpack의 `webpack-bundle-analyzer`에 대응하는 Vite/Rollup용 도구
- 빌드 후 HTML 파일로 트리맵을 생성해서, 어떤 모듈이 번들 크기를 차지하는지 한눈에 파악 가능

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,        // 빌드 후 자동으로 브라우저에서 열기
      filename: 'stats.html',
    }),
  ],
});
```

### sentryVitePlugin

- **용도 1**: 빌드 시 **Sentry 릴리즈를 자동 생성**하고 **소스맵을 업로드**
- **용도 2**: 사용하지 않는 CSS를 찾아내는 데에도 활용 가능

```javascript
// vite.config.js
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: {
    sourcemap: true, // 소스맵 생성 필수
  },
  plugins: [
    sentryVitePlugin({
      org: 'my-org',
      project: 'my-project',
    }),
  ],
});
```

> **소스맵이란?** 번들링·압축된 코드와 원본 소스코드 간의 매핑 정보다. 프로덕션에서 에러가 발생했을 때 Sentry 같은 도구가 소스맵을 이용해 **원본 코드의 어느 줄에서 에러가 났는지** 보여줄 수 있다. 소스맵 파일 자체는 사용자에게 노출하지 않고 Sentry 서버에만 업로드하는 것이 일반적이다.

### vite-plugin-svgr (svgr)

- **용도**: SVG 파일을 **React 컴포넌트로 import**할 수 있게 해주는 플러그인

```javascript
// svgr 적용 후 사용 예시
import { ReactComponent as Logo } from './logo.svg';
// 또는
import Logo from './logo.svg?react';

function App() {
  return <Logo width={100} height={100} />;
}
```

- SVG를 컴포넌트로 쓰면 `props`로 색상·크기 등을 동적으로 제어할 수 있어서, 아이콘 시스템 구축 시 유용하다.

---

## Vite의 Module Federation 지원

> "최근에 알았는데, vite에서도 module federation 제공해줘서 MFE 구성할 수 있더라고요"

### Module Federation이란?

여러 개의 **독립적으로 빌드·배포된 애플리케이션**이 런타임에 서로의 모듈을 공유할 수 있게 해주는 기술이다. 원래 webpack 5에서 처음 도입되었다.

### 핵심 개념

```
┌─ App A (Host) ─────────────┐     ┌─ App B (Remote) ──────────┐
│                             │     │                           │
│  import Button              │────▶│  export Button            │
│  from 'appB/Button'        │     │  (독립 빌드·배포)          │
│                             │     │                           │
└─────────────────────────────┘     └───────────────────────────┘
```

- **Host**: 다른 앱의 모듈을 가져와 사용하는 쪽
- **Remote**: 자신의 모듈을 외부에 노출하는 쪽
- **Shared**: React 같은 공통 의존성을 중복 로드하지 않고 공유

### MFE (Micro Frontend)와의 관계

Module Federation은 **마이크로 프론트엔드 아키텍처**를 구현하는 핵심 수단 중 하나다. 대규모 서비스에서 팀별로 독립적인 프론트엔드 앱을 개발·배포하면서도, 사용자에게는 하나의 통합된 서비스로 보이게 할 수 있다.

### Vite에서 사용하기

`@module-federation/vite` 플러그인을 통해 Vite 프로젝트에서도 Module Federation을 사용할 수 있다.

```javascript
// vite.config.js (Remote 앱)
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.jsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
```

> **참고**: webpack의 Module Federation과 설정 방식이 유사하므로, webpack 경험이 있다면 비교적 쉽게 전환할 수 있다.