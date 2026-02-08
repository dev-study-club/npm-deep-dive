## ECMAScript란?

**ECMAScript는 자바스크립트(JavaScript)의 공식 표준 이름**이다.

우리가 흔히 사용하는 “JavaScript”라는 이름은 사실 **상표(브랜드)명**에 가깝고, 언어 자체의 **문법, 내장 객체, 동작 규칙** 등을 국제 표준으로 정의한 문서가 바로 **ECMAScript 사양(Specification)**이다.

이 표준은 **Ecma International**이라는 국제 표준화 기구 산하의 **TC39 위원회**가 만들고 관리한다.

그래서 우리가 흔히 말하는

- ES2015 (ES6)
- ES2016
- ES2017

같은 버전들은 전부 **ECMAScript 표준 문서의 연도별 릴리스**를 의미한다.

Chrome의 **V8**, Firefox의 **SpiderMonkey**, Safari의 **JavaScriptCore** 같은 자바스크립트 엔진들은

모두 이 **ECMAScript 사양을 구현한 결과물**이다.

따라서, “ECMAScript에 새로운 기능이 들어갔다” → “앞으로 자바스크립트 언어 자체에 이런 기능이 생긴다”

## ESNext란?

ECMAScript 표준은 매년 1회 연도 기반 이름으로 정식 발표된다.

이때 해당 연도 표준에 포함되는 기능들은 [TC39 프로세스](https://tc39.es/process-document/) 기준으로 Stage 4(Finished Proposals) 상태에 도달한 것들이다.

그런데 현실적으로는 이런 상황이 항상 발생한다.

1. 이미 브라우저나 Node.js에 **구현은 되어 있는데**
2. 아직 **어느 연도 표준에 포함될지 확정되지 않았고**
3. “ES2026에 들어갈 기능”처럼 매번 연도를 붙여 말하기도 애매한 상태

그래서 개발자들 사이에서 “지금 논의 중이거나, 거의 확정 단계이거나, 차세대 자바스크립트 기능 전반”을 통칭하는 말이 필요해졌고, 그 결과 **ESNext**라는 표현이 관용적으로 쓰이게 됐다.

- ESNext = 특정 연도가 확정되지 않은 최신/차세대 ECMAScript 기능들의 총칭
- 공식 스펙 이름이라기보다는 개발자 커뮤니티에서 쓰는 편의적 용어

## TC39는 뭐 하는 곳인가?

TC39는 다음과 같은 구성원들로 이루어진 **자바스크립트 표준 결정 위원회**다.

- 브라우저 벤더 (Google, Mozilla, Apple, Microsoft)
- JS 엔진 개발자
- 대형 플랫폼/서비스 회사 (Meta, Google 등)
- 개별 전문가(학계, 오픈소스 리더 등)

이 사람들이 모여서 다음을 논의한다.

- 자바스크립트에 **새 문법을 넣을지**
- 기존 동작을 **어떻게 바꿀지**
- 언어의 **장기적인 방향성**

TC39의 정식 명칭은 **Ecma International Technical Committee 39**이며, 줄여서 **TC39**라고 부른다.

## TC39 Proposal 저장소

TC39는 새 기능 제안을 **proposal(프로포절)** 형태로 관리한다.

https://github.com/tc39/proposals

여기에는 다음 정보들이 정리되어 있다.

- 새로운 문법/API 제안, 각 제안의 현재 단계(Stage), 제안 책임자(Champion), 회의에서 논의된 히스토리

### Proposal 단계 흐름

- Stage 0 / 1: 아이디어 제안 단계
- Stage 2: 설계 방향이 어느 정도 확정
- Stage 2.7: 거의 완료 단계
- Stage 3: 사양 고정, 구현 진행 중
- Stage 4: 표준 채택 (다음 ECMAScript 연도에 포함)

### 2026 반영 예정 기능들

이미 Stage 4에 도달해서 확정된 기능들 목록은 여기서 확인 가능하다.

https://github.com/tc39/proposals/blob/main/finished-proposals.md

**다음 연도 스펙에 포함될 가능성이 매우 높다** 정도로 이해하는 게 정확하다. (지연될 수 있음.)

### TC39의 ‘39’는 무슨 뜻인가?

의미 있는 숫자가 아니다. ECMA에는 여러 **Technical Committee(TC)**가 있고, 그냥 **내부에서 부여한 번호**다.

- 어떤 TC는 C# 같은 언어를 담당했고
- 어떤 TC는 문서 포맷을 담당했고
- **TC39는 ECMAScript(자바스크립트 표준)** 담당

## ECMA란?

**프로그래밍 언어, 파일 포맷, IT 기술 표준을 만드는 국제 표준화 기구**다. 정식 명칭은 **Ecma International**.

원래는 European Computer Manufacturers Association에서 출발했지만, 현재는 **지역 제한 없는 글로벌 IT 표준 단체**로 운영된다. ECMAScript라는 이름도 “ECMA가 만든 스크립트 언어 표준”이라는 의미에서 나온 것.

- **또 어떤 그룹들이 있나?**
    - **ISO/IEC JTC 1**
        
        IT 전반을 담당하는 거대 표준 위원회 (C/C++ WG21, Java, 문자 인코딩 등)
        
    - **W3C 워킹 그룹**
        
        HTML, CSS, WebAuthn, WebRTC 등 웹 표준 담당
        
        → TC39와 항상 함께 언급됨
        
    - **WHATWG**
        
        HTML Living Standard를 사실상 주도 ⇒ 우리가 웹표준이라 부리는 것들.
        
        → 웹 표준 세계에서 TC39급 존재감
        
    - **IETF 워킹 그룹**
        
        HTTP, TLS, QUIC 등 인터넷 프로토콜 표준 담당
        
        → 네트워크/백엔드 쪽에서 핵심
        
    

## Babel의 역사

- 2016년, **6to5**라는 이름으로 처음 등장
- ES6 코드를 ES5로 변환해 주는 도구였음
- 이후 이름을 **Babel**로 변경

이름은

- “바벨탑”
- 여러 언어를 자동 번역해 주는 **“바벨피시” -** 은하수를 여행하는 히치하이커

## JSX와 Babel

초기 Babel은 사실상 **JSX 변환이 핵심 기능**이었다.

- React가 확산되면서 JSX 지원이 필수였고
- 당시 브라우저는 JSX를 전혀 이해 못 했기 때문

지금은 JSX가 “필수”는 아니지만, Babel이 프론트엔드 생태계에서 자리 잡는 데 결정적 역할을 했다.

## esbuild

- Go 언어로 작성된 초고속 빌드 도구
- Babel과 달리 **번들링 + 트랜스파일**을 동시에 지향
- 속도가 압도적으로 빠름

## Preset이란?

**Preset = 여러 Babel 플러그인을 묶어 놓은 세트**

플러그인을 하나하나 설정하는 대신 “목적별 묶음”을 제공한다.

**대표적인 Preset**

- `@babel/preset-env`
    
    → 타깃 환경에 맞춰 필요한 문법만 변환
    
- `@babel/preset-react`
    
    → JSX 변환
    
- `@babel/preset-typescript`
    
    → TypeScript 문법 제거
    
- `@babel/preset-flow`
    
    → Flow 타입 제거
    

## AST와 파서

AST(Abstract Syntax Tree)는 **코드를 구조화된 트리 형태로 표현한 것**이다.

**주요 파서들**

| 이름 | 정체 | 상태 |
| --- | --- | --- |
| Esprima | 초기 표준 파서 | 안정적, 보수적 |
| Acorn | 빠르고 가벼운 파서 | 매우 활발 |
| Espree | ESLint용 Acorn 래퍼 | ESLint 표준 |
| @babel/parser | Babel 전용 | 가장 강력 |
| EsExpress / Espress / Acro | 혼동/오타 | 실존 아님 |

## Babel 코드 변환 3단계

위 세 단계 포함하고 있는게 `babel/core`

**1. 파싱 (Parsing)**

- 소스 코드 → AST
- 도구: `@babel/parser`

**2. 변환 (Transform)**

- AST를 순회하면서 노드 변경
- 도구: `@babel/traverse`
- 플러그인/프리셋이 작동하는 단계

**3. 출력 (Generate)**

- AST → 문자열 코드
- 도구: `@babel/generator`
- 소스맵 생성 가능

## 트랜스파일 vs 폴리필

- **트랜스파일**: 문법 변환
- **폴리필**: 런타임에 없는 기능 구현

```jsx
newPromise((resolve) =>resolve(1));
```

`Promise`는 **문법이 아니라 전역 객체**다. Babel은 이걸 `var Promise = ...`로 만들어 줄 수 없다.

## ES6 컬렉션

- `Map`, `Set`, `WeakMap` 전부 **런타임 객체**
- 문법 변환 대상 아님

```jsx
const map =newMap();
```

## async/await

- 문법이므로 Babel이 변환 가능
- 내부적으로 `generator + Promise` 형태로 변환

## Babel의 역할 한계

- Babel은 **코드 변환기**
- 실행 환경 자체를 바꾸지는 못함
- JS 파일만 변환 가능

## Polyfill의 역할

- 없는 전역 객체 / 메서드를 **직접 추가**
- 실행 전에 환경을 “패치”

## core-js

- ECMAScript 표준 API 구현 모음
- Babel과 **사실상 세트**
- “JS 실행 환경에 없는 표준 기능”을 채워줌
- JS 실행 환경에 없는 “표준 기능(API)”을 채워주는 폴리필 라이브러리

## TypeScript lib 옵션

lib는 **TypeScript 컴파일러가 “이 프로젝트의 실행 환경에 어떤 표준 API들이 존재한다고 가정할지”를 결정하는 옵션**이다.

정확히 말하면, **타입 체크에 사용할 .d.ts(타입 선언 파일) 묶음을 선택하는 설정**이다.

- **target**: 문법 레벨
    
    → let을 var로 바꿀지, class를 함수로 내릴지 같은 **문법 변환 기준**
    
- **lib**: 런타임 API 타입
    
    → window, document, fetch, Map 같은 **“존재한다고 가정할 전역 API들”의 타입 정의**
    

**target** 은 “어떤 JS 문법으로 컴파일할지” **lib** 는 “어떤 환경에서 실행된다고 가정하고 타입을 붙일지”

## lib 옵션이 실제로 하는 일

- target이 **다운레벨링(문법 변환)** 을 담당한다면
- lib는 **런타임에 존재하는 내장 객체 + 플랫폼 API의 타입 정의를 선택**한다.

예를 들어 lib에 **DOM**을 포함하면,

- window
- document
- HTMLElement
- fetch
- localStorage
- setTimeout

같은 **브라우저 전역 객체와 API들이 타입 시스템에 “존재하는 것”으로 등록**된다.

여기서 중요한 점은, **실제로 코드가 실행 가능한지는 전혀 관여하지 않는다는 것**이다. lib는 오직 **타입 체크를 위한 가정**일 뿐이다.

바벨을 단독으로만 사용하기에는 모듈 시스템 변환 문제, 최적화 문제 등이 있어 웹팩 같은 번들러와 함께 사용.

## 주요 lib 옵션들

**1) DOM**

- **브라우저 메인 스레드(웹 페이지) 환경**의 표준 API 타입 정의
- HTML 문서, 이벤트 시스템, 타이머, Web API 전반을 포함

대표적으로 포함되는 타입들

- window, document
- Node, Element, HTMLElement
- addEventListener
- fetch
- localStorage, sessionStorage
- setTimeout, clearTimeout

**언제 사용하나**

- 일반적인 **프론트엔드 웹 애플리케이션**
    - React, Vue, Svelte, Vanilla JS 등

**주의할 점**

- DOM을 빼면 런타임 에러가 나는 게 아니라 **컴파일 단계에서 타입이 없음**으로 에러가 난다

(예: document를 찾을 수 없다는 타입 에러)

- Node 전용 프로젝트에 DOM을 넣으면 실제 런타임에는 window, document가 없는데 타입만 있어서 “있다고 착각하는 코드”가 만들어질 수 있다

**2) WebWorker**

- **Web Worker(백그라운드 스레드)** 환경의 API 타입 정의
- 브라우저이지만 **메인 스레드와는 완전히 다른 실행 컨텍스트**

**특징**

- window, document는 존재하지 않음
- 대신 self, postMessage, onmessage, importScripts 같은 **Worker 전용 전역 객체**가 있음

**언제 사용하나**

- .worker.ts 같은 워커 전용 파일
- Vite / Webpack에서 Worker 번들
- Service Worker
    
    (단, 서비스 워커는 경우에 따라 별도 lib 조합이 필요)
    

**주의할 점**

- **DOM과 WebWorker를 동시에 넣으면** 전역 타입이 섞이면서 이벤트, 타이머, 전역 스코프 정의가 충돌하거나 애매해지는 경우가 많다 실제로 이 조합 때문에 발생하는 타입 에러 사례가 매우 많다

그래서 보통은 다음처럼 분리한다.

- 메인 앱용 tsconfig: **DOM**
- 워커 전용 tsconfig(또는 project reference): **WebWorker**

**3) ScriptHost**

- Windows Script Host(WSH) 환경용 API 타입 정의
- cscript, wscript 같은 **윈도우 레거시 스크립트 실행 환경**을 위한 것

TypeScript 공식 문서에서도 ScriptHost는 **Windows Script Hosting System 전용**이라고 명시되어 있다

**언제 사용하나**

- 요즘 웹이나 Node 개발에서는 거의 사용하지 않음
- 아주 오래된 윈도우 자동화 스크립트 같은 **특수 레거시 케이스**에서만 의미가 있음

**주의할 점**

- 일반 프론트엔드 / 백엔드 프로젝트에는 거의 필요 없음
- 오히려 전역 타입만 불필요하게 복잡해질 수 있다

**4) WebGL**

- **WebGL API 관련 타입 정의**
- 그래픽 컨텍스트와 렌더링 관련 인터페이스 제공

대표적인 타입

- WebGLRenderingContext
- WebGL2RenderingContext
- WebGL 관련 상수 및 메서드 타입들

**언제 사용하나**

- Three.js
- Babylon.js
- 직접 WebGL API를 다루는 프로젝트
- canvas에서 webgl / webgl2 컨텍스트를 얻는 코드가 있을 때

**주의할 점**

- WebGL을 사용하지 않는다면 굳이 넣을 필요 없음
- 타입 범위만 불필요하게 커질 수 있다

## 대표적인 lib 조합 예시

- **일반 웹앱**
    
    DOM, DOM.Iterable, ES202x
    
- **Web Worker 전용**
    
    WebWorker, ES202x
    
- **3D / WebGL 앱**
    
    DOM, WebGL, ES202x
    

여기서 **ES202x**는 Map, Set, Promise, Symbol 같은 **ECMAScript 표준 내장 객체 타입**을 제공하는 역할이다.

## tslib

**tslib는 TypeScript 컴파일 결과에 필요한 helper 함수들을 재사용 가능하게 모아둔 라이브러리**다.

TypeScript는 ES5나 ES6 같은 낮은 타깃으로 컴파일할 때, 원래 JavaScript에 없는 기능들을 흉내 내기 위해 **helper 함수**를 자동으로 코드에 삽입한다.

문제는 이 helper들이 **파일마다 반복 삽입될 수 있다는 점**인데, 이를 해결하기 위해 helper를 **외부 라이브러리로 분리해 재사용**하도록 만든 것이 바로 tslib다.

tslib를 사용하려면

- tslib를 프로젝트에 설치하고
- **tsconfig.json에서 importHelpers 옵션을 활성화**해야 한다

그러면 컴파일된 코드 안에 helper 함수가 직접 들어가지 않고, **tslib에서 import해서 공용으로 사용**하게 된다.

**대표적인 helper 함수들**

- **__extends**
    
    → class 상속을 ES5 스타일로 구현
    
- **__assign**
    
    → 객체 전개 연산자 (`{ ...a }`)
    
- **__awaiter**, **__generator**
    
    → async / await 구현
    
- **__read**, **__spreadArray**

## polyfill.js

polyfill.js는 맥락에 따라 두 가지 의미로 쓰인다.

1. **프로젝트에서 직접 만든 또는 직접 관리하는 폴리필 묶음 파일**
    - 예: 프로젝트 루트의 polyfill.js
    - 필요한 폴리필만 명시적으로 import해서 관리
2. (문제가 되었던) **Polyfill.io CDN이 동적으로 생성해 주던 폴리필 번들**
    - User-Agent를 분석해서
        
        “이 브라우저에 부족한 기능만” 골라서 내려주는 방식
        
    - 편리했지만, 외부 CDN에 전적으로 의존하는 구조였음

## Babel 트랜스파일과 Polyfill의 차이점

- **Babel**
    
    → 문법 변환 담당
    
    → 예: optional chaining, nullish coalescing 같은 **코드 형태**를 바꿔줌
    
- **Polyfill**
    
    → 런타임 기능 보완
    
    → 예: Promise, Map, fetch 같은 **없는 내장 API를 직접 추가**
    

그래서, 트랜스파일만으로는 Promise / Map / fetch 같은 문제를 해결할 수 없고 실행 환경에 따라 **폴리필이 추가로 필요할 수 있다**는 점이 핵심이다.

## Polyfill.io 보안 이슈

- 많은 웹사이트들이 cdn.polyfill.io에서 polyfill.js(폴리필 번들)를 외부 스크립트로 불러와 사용하고 있었다. 그런데 **2024년 6월경**, 해당 CDN이 **악성 자바스크립트를 섞어 배포하기 시작한 정황**이 보고되었다.
- 이 공격은 “신뢰하던 외부 CDN”을 통해 그 CDN을 사용하는 수많은 웹사이트 방문자에게 악성 스크립트를 전달하는 전형적인 **공급망 공격(Supply Chain Attack)** 이었다.
피해 사이트 수가 매우 많았다는 점에서 큰 이슈가 됐다.

**외부 대응과 여파**

- **Cloudflare**
    - 자사 고객 트래픽에서 polyfill.io 링크를
    - **안전한 미러로 자동 치환**하는 조치를 시행
- **Google Ads**
    - polyfill.io를 사용하는 사이트에 대해
    - **보안 경고 또는 광고 차단** 사례가 보고됨
- 그 외에도 도메인 차단, DNS 레벨 차단, 같은 **도메인 단위 대응**이 언급됨

이 사건 이후로는 **외부 CDN 폴리필을 무작정 신뢰하는 방식의 위험성**이 크게 인식되었고, 직접 관리하거나 빌드 단계에서 포함시키는 방식이 더 권장되고 있다.