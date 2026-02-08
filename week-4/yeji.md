
# JS 모듈 시스템

## 1. 모듈 시스템의 역사

### 1) IIFE (Immediately Invoked Function Expression)
전역 오염을 줄이기 위해 함수를 즉시 실행해 스코프를 만드는 패턴이다.
모듈 개념이 없던 시절의 대안으로, 네임스페이스 충돌을 피하고 캡슐화를 확보했다.
의존성 관리는 수동이며, 스크립트 로딩 순서에 강하게 의존한다.

```js
const Module = (() => {
  const privateValue = 1;
  return { get: () => privateValue };
})();
```

### 2) CommonJS (CJS)
Node.js 환경에서 사용된 모듈 시스템이다.
`require`와 `module.exports`를 사용하며 **동기 로딩**이 기본이다.
파일을 읽고 실행한 뒤 `module.exports` 객체를 반환한다.
모듈 캐시가 있어 한 번 로드된 모듈은 같은 인스턴스를 공유한다.
확장자 생략, 디렉터리 로딩(`index.js`) 같은 해석 규칙이 느슨하다.

```js
// math.js
exports.add = (a, b) => a + b;

// app.js
const { add } = require("./math");
```

### 3) AMD (Asynchronous Module Definition)
브라우저 환경에서 **비동기 로딩**을 목표로 등장했다.
`define([...], factory)` 패턴을 사용하고, 대표 구현은 `require.js`다.
의존성을 배열로 명시해 로더가 병렬 로딩할 수 있게 했다.

```js
define(["dep"], function (dep) {
  return { use: () => dep };
});
```

### 4) UMD (Universal Module Definition)
AMD/CJS/전역 환경을 모두 지원하기 위한 래퍼 패턴이다.
배포용 라이브러리에 많이 쓰였지만, 구조가 장황하고 트리 쉐이킹에 불리하다.
빌드 결과물이 커지고, 런타임 분기 비용이 생긴다.

### 5) ESM (ECMAScript Modules)
자바스크립트 표준 모듈 시스템이다.
`import`/`export`는 **정적 분석 가능**하며, 브라우저와 Node 모두 지원한다.
정적 분석을 기반으로 트리 쉐이킹과 순서 보장이 가능하다.


## 2. CJS vs ESM 비교

| 항목 | CJS | ESM |
| --- | --- | --- |
| 로딩 시점 | 실행 시 `require` | 링크 후 평가 (정적) |
| 로딩 방식 | 동기 | 비동기 가능 (TLA) |
| 바인딩 | 값 복사(스냅샷) | Live binding |
| 분석 가능성 | 동적 | 정적 |
| 트리 쉐이킹 | 어려움 | 가능 |
| 순환 의존성 | 부분 exports 노출 | Live binding이지만 주의 필요 |
| 브라우저 사용 | 번들러 필요 | 기본 지원 |

### 추가 차이
- **해석 규칙**: CJS는 확장자/디렉터리 추론이 느슨, ESM은 명확한 specifier 요구
- **실행 컨텍스트**: ESM은 항상 strict mode이며 top-level `this`는 `undefined`
- **호이스팅**: ESM의 `import`는 실행 전에 처리되며 선언이 호이스팅된 것처럼 동작
- **조건부 로딩**: CJS는 조건문 안에서 `require` 가능, ESM은 `import()`로 해결
- **인터롭**: ESM에서 CJS는 기본 export로 로드됨. CJS에서 ESM은 동기 `require`가 불가
- **경로/메타**: CJS는 `__dirname`, `__filename` 사용, ESM은 `import.meta.url` 사용

### CJS 상세 동작

- **모듈 래퍼**: 각 파일은 내부적으로 함수로 감싸져 실행된다.
- **캐시 동작**: `require`는 `require.cache`를 사용해 같은 인스턴스를 반환한다.
- **해석 규칙**: 상대 경로/절대 경로/패키지 이름에 따라 파일을 찾는다.
- **exports 규칙**: `exports`는 `module.exports`의 별칭이며, 둘이 분리되면 의도치 않은 결과가 생긴다.
- **순환 의존성**: 초기화 중인 `exports`가 먼저 노출될 수 있다.

```js
// a.js
exports.value = 1;
const b = require("./b");
exports.value = 2;

// b.js
const a = require("./a");
console.log(a.value); // 1 (초기 값이 먼저 보일 수 있음)
```


## 3. ESM 동작 원리

### 1) ESM의 동작 방식

모듈 파싱 → 모듈 인스턴스화 → 모듈 평가

*모듈 인스턴스화 단계에서 의존성이 연결된다.

export와 import는 동일한 메모리 슬롯을 참조한다.
이로 인해 모든 import가 export와 동기화된 상태로 연결된다.

CJS의 `require`은 객체를 복사해 전달되기에 값 변경이 반영되지 않는다.
반면 ESM은 동일한 메모리 슬롯을 참조하므로, 내보낸 값이 바뀌면 가져온 쪽에도 반영된다.

### 2) ESM이 CJS와 근본적으로 다른 이유

ECMAScript Modules은 **파일을 실행하기 전에 모든 import / export 관계를 먼저 분석**한다. 이게 CJS와 근본적으로 다른 지점이다.


### 3) ESM의 3단계 실행 과정

#### 1) 모듈 파싱 (Parsing)

엔진이 코드를 실행하지 않고 **import / export 구조를 전부 읽는다**.

이 파일이 무엇을 export하는지, 어떤 파일에서 무엇을 import하는지를 분석해 그래프로 만든다. 이 시점에는 코드가 실행되지 않는다.

#### 2) 모듈 인스턴스화 (Instantiation)

여기서 설명한 일이 벌어진다.

- 각 export에 대해 **메모리 슬롯(주소)** 을 먼저 만든다
- import는 그 **슬롯을 참조하는 링크**를 건다

이 시점에는 값이 채워지기 전이며, 슬롯만 미리 만들어 연결해 둔다고 보면 된다.

즉 다음과 같은 상황에서,

```js
export let count = 0;
```

이 코드의 `count`는 **메모리 슬롯이 먼저 생성**되고,

```js
import { count } from "./a.js";
```

가져오는 쪽은 **값을 복사하는 것이 아니라 해당 슬롯을 참조**한다.
이 구조를 Live Binding(살아있는 연결)이라고 부른다.

#### 3) 모듈 평가 (Evaluation)

이제 코드가 실행된다. 이미 import/export는 같은 메모리 슬롯으로 연결되어 있기 때문에
값이 바뀌면 모든 모듈에서 동시에 보인다.

### 4) 코드로 보기

#### a.js

```js
export let count = 0;

export function inc() {
  count++;
}

```

#### b.js

```js
import { count } from './a.js';

setInterval(() => {
  console.log(count);
}, 1000);

```

#### c.js

```js
import { inc } from './a.js';

setInterval(() => {
  inc();
}, 1000);

```

결과:

```
1
2
3
4

```

b.js는 아무것도 하지 않았는데 값이 계속 변한다.

이유는, b.js의 count는 a.js의 같은 메모리 주소를 보고 있기 때문이다.

---

### CJS(require)는 왜 이게 안 될까?

CommonJS는 동작 순서가 완전히 다르다.

CJS는

1. require 시점에 파일을 **실행**
2. `module.exports` 객체를 **완성된 상태로 반환**
3. 그 객체를 **복사해서 전달**

```
exports.count = 0;

```

다른 파일은 “그 시점의 값이 담긴 객체”를 받는 것. 그래서 이후 값이 바뀌어도 반영되지 않는다.


### 핵심 차이

|  | ESM | CJS |
| --- | --- | --- |
| 연결 시점 | 실행 전 | 실행 후 |
| import 방식 | 메모리 슬롯 참조 (Live binding) | 값 복사 |
| 동기화 | 자동 | 되지 않음 |
| 의존성 분석 | 정적 (Static) | 동적 (Dynamic) |


### 그래서 ESM에서 가능한 것들

이 구조 덕분에 ESM은

- Tree Shaking 가능
- Circular Dependency 안전
- Top-level await 가능
- 실행 순서가 예측 가능

이게 전부 **Live binding + 사전 의존성 그래프** 때문이다.

정리하자면,
- export와 import문이 동일한 메모리 주소를 참조한다.
- export된 변수의 메모리 슬롯을 import가 참조한다.
- CJS의 require은 객체 복사해 전달된다

### 4) 결론

ESM은 “값을 가져오는 것”이 아니라 **변수가 존재하는 자리를 연결하는 시스템**이다.
이게 CJS와의 가장 본질적인 차이다.

CJS는 모듈을 내보낼 때 모듈 래퍼로 한 번 감싸 모듈 스코프를 분리해 실행하고, 의존성은 런타임에 해석한다.

반면 ESM은 export/import 문을 사전에 해석해 **정적으로 의존성을 해결**한다.

`module.exports`는 `export default`에 대응되는 개념으로 보면 된다.

`exports.name = ''` 는 `export { name }` 과 같은 개념에 가깝다.

### 6) Node.js의 모듈 해석 알고리즘

Node.js에서는 모듈 URL 경로를 직접 지정할 수도 있다.

`ESM_RESOLVE`는 “ESM에서 **import 경로를 실제 파일로 찾아가는 해석(Resolve) 단계**”를 말한다. Node.js / 브라우저 / 번들러가 **`import 'x'`를 보고 실제로 무엇을 로드할지 결정하는 규칙 전체**라고 생각하면 된다.

**ESM_RESOLVE = `import` 문에 적힌 문자열을 실제 파일(URL)로 매핑하는 과정**


**확장자 자동 추론 불가능**

ESM은 **정적 분석 기반**이다. 따라서 실행 전에 모든 import 경로를 **명확하게, 미리, 정확히** 알아야 한다.


```js
import foo from "./foo.js";
```

그래서 “대충 알아서 찾아줘” 같은 동작이 불가능하며, 그 결과가 `ERR_MODULE_NOT_FOUND`, `ERR_UNSUPPORTED_DIR_IMPORT` 같은 에러로 나타난다.

런타임 추측을 허용하지 않음 - CJS의 `require('./foo')`와 가장 큰 차이

### 번들러에서 ESM_RESOLVE가 느슨해지는 이유

Vite와 Webpack은 브라우저와 Node 사이를 연결하는 역할을 한다.
그래서 ESM의 엄격한 해석 규칙을 그대로 적용하기보다,
개발 편의성을 위해 일부 규칙을 확장/완화한다.

대표적인 예
- 확장자 자동 추론
- 디렉터리 경로 보정
- `package.json`의 추가 필드 해석

#### 자주 만나는 ESM_RESOLVE 에러 의미

- `ERR_MODULE_NOT_FOUND`: 경로가 실제로 없거나 `exports`에 정의되지 않음
- `ERR_UNSUPPORTED_DIR_IMPORT`: 디렉터리 import 시도
- `Cannot use import statement outside a module`: 모듈 타입 인식 실패 (`type: "module"` 설정 문제)
    

#### 1) 지정자 해석 (Specifier Resolution)

`import "specifier"` 문자열을 **실제 파일/URL**로 바꾸는 단계다.

해석 흐름:
- 상대/절대/bare specifier 구분
- `package.json`의 `exports`, `main`, 조건부 exports 확인
- 확장자 필수 여부 판단
- 디렉터리 import 차단 여부 확인

여기서 실패하면 다음 에러가 발생한다.

```
ERR_MODULE_NOT_FOUND
ERR_UNSUPPORTED_DIR_IMPORT
```


#### 2) 형식 결정 (Format Determination)

Resolve된 리소스가 **어떤 모듈 형식인지 판단**하는 단계다.

| 파일 | 결정되는 형식 |
| --- | --- |
| `.mjs` | ESM |
| `.cjs` | CommonJS |
| `.js` + `"type": "module"` | ESM |
| `.js` + `"type": "commonjs"` | CJS |
| `.json` | JSON module |
| `.node` | Native addon |

이 단계에서 흔히 보는 에러:

```
Cannot use import statement outside a module
```

#### 3) 로드 단계 검증 (Load / Validation)

파일을 실제로 읽기 전에 **로드 가능성**을 검사한다.

- 파일 존재 여부
- 접근 권한
- `exports` 선언 유효성
- JSON 모듈 문법
- 순환 의존성 검사

실패 시 대표 에러

```
ERR_MODULE_NOT_FOUND
ERR_INVALID_MODULE_SPECIFIER
```

명세에서는 이 과정을 Load → Parse → Instantiate → Evaluate로 더 세분화한다.


### 표현을 공식 단계로 1:1 매핑하면

| 표현 | 명세/엔진 개념 |
| --- | --- |
| 지정자 해석 | **Module Specifier Resolution** |
| 형식 결정 | **Module Format Detection** |
| 로드 단계 검증 | **Module Loading / Validation** |

### 왜 CJS, ESM 둘 다 지원해야 할까 - 듀얼 패키지

여러 실행 환경(Node, 브라우저, 번들러)을 동시에 지원하려면
CJS와 ESM 진입점을 모두 제공하는 것이 안전하다.

### 듀얼 패키지 개발

`exports` 필드로 CJS/ESM 진입점을 분리할 수 있다.

```json
{
  "exports": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

타입스크립트는 기본적으로 CJS 모듈 형식을 사용한다.


## 4. Top-Level Await (TLA)

요약
모듈 파일의 최상위에서 `await`를 쓸 수 있고, 그 모듈의 실행 완료가 Promise처럼 지연된다.
이 동작은 **ESM의 정적 로딩/링킹 모델**과 맞물려 돌아간다.
즉, ESM에서만 가능하고 일반 `<script>`나 CJS에서는 불가능하다.

### 1) 원래는 왜 불가능했나?

예전엔 `await`는 무조건 `async function` 안에서만 가능했다.

```js
// 과거엔 에러
const data = await fetch(...);

```

그래서 보통 이렇게 우회했다.

```js
(async () => {
  const data = await fetch(...);
})();

```

문제는 모듈이 완전히 준비되기 전에 이 코드가 비동기로 따로 돌아간다는 점이다.
즉, 다른 파일이 이 모듈을 import해도 “준비 완료” 보장이 없다.

### 2) TLA가 해결하는 문제

```js
// config.js
const res = await fetch("/config.json");
export const config = await res.json();

```

```js
// app.js
import { config } from "./config.js";
console.log(config);

```

핵심 포인트는 app.js가 config.js의 `await`가 끝날 때까지 실행되지 않는다는 점이다.

### 3) 가능한 이유 = ESM의 “정적 로드 + 링크 단계”

ESM은 실행 전에 다음 단계를 거친다.

1. 의존성 그래프 구성 (linking)
2. export/import 바인딩 연결
3. 그 다음 평가(evaluation)

여기에 TLA가 들어오면 “이 모듈의 평가가 Promise가 된다”.

즉, 모듈 자체가 Promise처럼 동작한다.

```txt
config.js → 평가 중 → await 발생 → “pending 상태”
app.js → config.js 끝날 때까지 대기
```

그래서 **모듈 실행 순서가 비동기적으로 제어**된다.

### 4) 그래서 TLA는 CommonJS에서는 불가능

CommonJS는

```js
const mod = require("./config");
```

이게 **동기 로드**고, 실행 순서 제어권이 없다.

ESM만 가능한 이유
- 모듈이 “링킹 → 평가” 2단계를 가지기 때문
- 평가 단계가 Promise가 되어도 시스템이 이해할 수 있음

### 5) TLA가 유용한 상황

```js
// db.js
export const conn = await createDBConnection();

```

```js
export const wasm = await WebAssembly.instantiateStreaming(...);
```

환경 설정 / secrets / config 서버에서 받아오기가 필요한 경우에
초기 부트스트랩 코드가 단순해진다.

### 6) TLA 사용 시 주의점

순환 의존성 + TLA는 교착상태로 이어질 수 있다.

```js
// a.js
import { b } from "./b.js";
export const a = await something();

// b.js
import { a } from "./a.js";
export const b = await something();

```

회피 방법
- TLA를 함수 내부로 내려서 호출 시점을 늦추기
- 공용 의존성을 별도 모듈로 분리하기
- 필요 시 `await import()`로 동적 로딩하기

### 7) 정적 import vs 동적 import와 TLA

| 구분 | import | await import() |
| --- | --- | --- |
| 분석 가능 | O (정적) | X (동적) |
| 로딩 시점 | 모듈 링크 단계 | 실행 중 |
| TLA 영향 | 모듈 전체 대기 | 해당 지점만 대기 |

TLA는 **정적 import 체계 안에서** 동작하기 때문에 더 강력하다.

### 8) 브라우저 / Node / 번들러 차이

- 브라우저: 네트워크 로더가 모듈 그래프를 그대로 관리
- Node: ESM 로더가 관리하지만 CJS와 섞이면 제약이 생김
- 번들러: 그래프를 빌드 시점에 없애기 때문에 TLA를 재작성해야 함

추가로, Vite는 **개발 모드에서는 브라우저 ESM 로더**, **빌드 모드에서는 번들러**를 사용한다.
동일한 TLA 코드가 dev/build에서 다르게 보일 수 있다.

### 9) 번들러에서 TLA가 어색해 보이는 이유

번들된 파일에는 “모듈 그래프”가 없기 때문에,
TLA를 내부적으로 async IIFE 패턴으로 바꿔 처리한다.

- 청크가 쪼개짐
- 초기 로딩이 느려짐
- 코드 스플리팅 구조가 바뀜
- 예상하지 못한 async 경계가 생김

