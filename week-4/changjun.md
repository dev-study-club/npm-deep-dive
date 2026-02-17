## 4.1 자바스크립트 모듈의 역사

ECMAScript의 표준 등장 → AJax의 등장으로 비동기 적으로 데이터교환이 가능하게 됨 → 구글의 V8엔진의 등장 (JavaScript로도 데스크톱 애플리케이션 성능에 견줄만한 서비스가 개발가능하다는 것을 구글맵스로 확인)

## 모듈화 이전의 자바스크립트

모듈화 이전에는 한 파일에 여러 기능을 구현하거나 필요한 파일을 순서대로 불러오는 식으로 사용했음.

## 자바스크립트의 여러 모듈화의 시도

### 0. 즉시 함수 표현식

괄호로 둘러쌓인 함수는 즉시 실행되고 이 함수만의 스코프가 생성됨.

이를 활용해 네임스페이스의 충돌을 방지하고 모듈간 의존성을 관리했었음.

```jsx
(function () {
  // 모듈코드
})();
```

### 1. AMD (RequireJS 사용)

브라우저 환경에서 비동기로 모듈을 불러올 때 사용하던 방식입니다. `define`으로 정의하고 `require`로 사용합니다.

```jsx
// math.js (모듈 정의)
define([], function () {
  return {
    add: function (a, b) {
      return a + b;
    },
  };
});

// main.js (모듈 사용)
require(["math"], function (math) {
  console.log(math.add(10, 20)); // 30
});
```

### 2. CommonJS (Node.js 기본)

서버 사이드에서 가장 흔하게 볼 수 있는 방식입니다. `require`와 `module.exports`가 핵심입니다.

```jsx
// math.js (모듈 내보내기)
const add = (a, b) => a + b;
module.exports = { add };

// main.js (모듈 가져오기)
const math = require("./math");
console.log(math.add(10, 20)); // 30
```

### 3. ES Module (현재 표준 방식)

가장 세련되고 가독성이 좋은 최신 표준 방식입니다. `import`와 `export`를 사용합니다.

```jsx
// math.js (모듈 내보내기)
export const add = (a, b) => a + b;

// main.js (모듈 가져오기)
import { add } from "./math.js";
console.log(add(10, 20)); // 30
```

---

### 💡 한눈에 보는 문법 비교

| **방식**      | **내보낼 때 (Export)**     | **가져올 때 (Import)**                     |
| ------------- | -------------------------- | ------------------------------------------ |
| **AMD**       | `return { ... }`           | `require(['module'], function(m) { ... })` |
| **CommonJS**  | `module.exports = { ... }` | `const m = require('./module')`            |
| **ES Module** | `export const ...`         | `import { ... } from './module'`           |

---

### UMD (Universal Module Definition)

UMD는 이름 그대로 **"유니버설(공용) 모듈 정의"** 방식.

어떤 사람은 `require`를 쓰는 Node.js(CommonJS) 환경에서 코드를 실행하고, 어떤 사람은 브라우저(AMD)에서 실행합니다. 개발자가 매번 두 버전의 코드를 짜기 힘들어서 등장했습니다.

### SystemJS

자바스크립트 모듈 시스템이 파편화되어 있던 과도기에 등장.

어떤 모듈방식이든 상관없이 브라우저에서 실행하게 해주는 옵션

- 어떤 라이브러리는 **AMD**로 만들어졌고,
- 어떤 건 **CommonJS**로 만들어졌는데,
- 나는 **ES6(ESM)** 문법으로 코드를 짜고 싶을 때!

이 모든 걸 한 페이지에서 충돌 없이 돌아가게 만들어주는 "중재자"가 필요했고, 그 역할을 SystemJS가 담당

```jsx
// SystemJS 형식으로 변환된 모듈 (빌드 도구가 이렇게 만들어줍니다)
System.register(["./math.js"], function (_export, _context) {
  var add;
  return {
    setters: [
      function (m) {
        add = m.add;
      },
    ],
    execute: function () {
      console.log(add(1, 2));
    },
  };
});

// 브라우저에서 사용할 때
System.import("./main.js").then(function () {
  console.log("모듈 로드 완료!");
});
```

---

## 4.2 CommonJs가 뭘까?

자바스크립트가 서버사이드 환경에서도 사용되면서 더더욱 확장성이 필요해졌음. 그래서 아래와 같은 요구사항들이 필요했음.

- 상호호환되는 표준라이브러리
- 서버와 브라우저간 호환되는 인터페이스
- 다른 모듈을 로드할 수 있는 표준이 필요

### CommonJs 파일 규칙

- cjs 가 포함된 파일
- require()가 포함된 파일
- package.json의 type 필드가 CommonJs인 파일

### 모듈 내보내기

- export에 새로운 객체를 직접 할당하면 module.export와의 참조가 끊겨버린다.

1. `exports`에 속성을 추가하는 경우 (성공 ✅)

이 방식은 `exports`와 `module.exports`가 가리키는 **동일한 객체**에 데이터를 채워넣는 방식입니다.

```jsx
// calculator.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// main.js
const calc = require("./calculator");
console.log(calc.add(5, 3)); // 8
console.log(calc.subtract(5, 3)); // 2
```

2. `exports`에 직접 할당하는 경우 (실패 ❌)

이 코드는 실행 시 에러가 나거나, 가져온 값이 `undefined` 또는 빈 객체로 나타납니다.

```jsx
// calculator.js
exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
// ⚠️ 주의: 이제 exports는 module.exports와 남남이 되었습니다!

// main.js
const calc = require("./calculator");
console.log(calc); // {} (빈 객체가 나옵니다)
// console.log(calc.add(5, 3)); // Error: calc.add is not a function
```

3. `module.exports`에 직접 할당하는 경우 (성공 ✅)

가장 확실하고 권장되는 방식입니다. 특히 모듈 하나에서 **딱 하나의 함수나 클래스**만 내보내고 싶을 때 필수입니다.

```jsx
// logger.js
module.exports = function (msg) {
  console.log(`[LOG]: ${msg}`);
};

// main.js
const log = require("./logger");
log("안녕하세요!"); // [LOG]: 안녕하세요!
```

---

💡 왜 이런 현상이 일어나는지 한눈에 보기

이 현상은 자바스크립트의 **참조(Reference)** 개념 때문입니다.

1. 처음에는 `module.exports`라는 상자가 있고, `exports`는 그 상자를 가리키는 손가락입니다.
2. `exports.add = ...` 라고 하면 **손가락이 가리키는 상자 안에** 물건을 넣는 것입니다. (성공)
3. `exports = { ... }` 라고 하면 **손가락이 다른 상자를 가리키게** 만드는 것입니다. (실패)
4. 정작 Node.js는 **`module.exports`라는 상자**만 수거해서 다른 파일로 배달해 줍니다.

---

### 모듈 가져오기

require()함수는 첫번째 인수로 지정된 인자로 모듈을 찾으며 5단계로 구성된다.

**파일 모듈**

- 파일경로를 확장자까지 명확하게 지정하면 해당 파일을 불러온다.
- 확장자를 생략할 경우 .js , .json, .node 순으로 불러온다.

**모듈로 지정된 폴더**

- 폴더를 require()의 인수로 사용할 경우 3가지 단계로 찾는다.
  1. 폴더의 package.json에 main이 정의된경우 해당 파일을 찾는다.
  2. 없으면 그 폴더의 index.js를 찾는다.
  3. 둘다 없으면 MODULE_NOT_FOUND 에러

**node_modules**

- require()대상이 코어모듈이 아니고 파일 경로가 아닌경우 node_modules를 탐색한다.

**전역 폴더**

- 위 4개가지의 단계에도 다 찾지 못한 경우 NODE_PATH가 환경변수가 정의 되어있으면 해당 경로로 추가 모듈을 탐색한다.
- 현재는 권장되지 않고, 무조건 사용하는 패키지는 전역보단 node_modules에 두는게 좋다.

**코어 모듈**

- nodejs 빌트인 모듈

### require.cache

- 한번 로드되면 캐시가 된다.
- require cache는 key-value 구조이기 때문에 추가, 수정,삭제가 가능함

**변조가능성?**

- **코어 모듈 변조 가능성:** 사용자가 `require.cache.fs` 값을 가짜 객체(`fakeFs`)로 바꿔치기하면, 이후에 누군가 `require('fs')`를 호출했을 때 진짜 파일 시스템 모듈이 아닌 가짜 객체가 반환됩니다. 이는 보안이나 프로그램 안정성에 큰 문제가 될 수 있습니다.
- **`node:` 접두어의 마법:** 하지만 `require('node:fs')`처럼 앞에 `node:`를 붙이면, Node.js는 **캐시를 무시하고 무조건 실제 내장된 코어 모듈을 반환**합니다.
- **일관성 유지:** 덕분에 누군가 환경을 더럽혀놓아도(`fakeFs`), `node:` 접두어를 사용하면 언제나 안전하게 진짜 모듈을 가져올 수 있습니다.

```jsx
const realFs = require("node:fs"); // 진짜 fs 모듈을 가져옴

const fakeFs = {}; // 가짜 빈 객체 생성
require.cache.fs = { exports: fakeFs }; // 캐시를 가짜로 덮어씌움!

// 1. 그냥 'fs'로 부르면? 가짜가 나옵니다.
assert.strictEqual(require("fs"), fakeFs); // true (오염됨)

// 2. 'node:fs'로 부르면? 캐시를 무시하고 진짜가 나옵니다.
assert.strictEqual(require("node:fs"), realFs); // true (안전함)
```

### 순환참조

- require()함수는 각 모듈을 동기적으로 불러오기 때문에 한 번에 하나씩 처리됨, 각 모듈을 순차적으로 로드하기 때문에 순환 참조가 발생해도 무한 루프가 발생되지 않는다.
- 그리고 재참조를 대비해 모듈을 캐싱해서 보관한다.

### 소스코드를 commonjs로 빌드하기

**모듈래퍼**

- 이런식으로 스코프를 감싸서 클로저를 생성한다.
  ```jsx
  (function (exports, require, module, __filename, __dirname) {
    // --- 우리가 작성한 코드 시작 ---
    const secret = "1234";
    module.exports = () => console.log(secret);
    // --- 우리가 작성한 코드 끝 ---
  });
  ```
- 근데 성능이 중요한 브라우저에선 매번 클로저를 생성하고 참조하는 방식이 문제다.
- 그래서 Webpack, Rollup 같은 번들러는 이런 클로저를 하나의 클로저로 통합해서 성능 문제를 해결한다.
  - 그런데 이 방법에서는 또 다른 문제가 생길 수 있다.

### require()는 런타임에 사용할 모듈이 결정된다.

- require()로 단일 클로저로 통합하는건 트리쉐이킹이 어려워진다는 단점이 있다.
- require()함수는 동적으로 모듈을 로드한다. → 그래서 빌드시점에는 어떤 모듈을 사용하는지 알 수 없다.
- 이점 때문에 책에 나온 index.js의 add에서 어떤 함수를 사용하는지 모르기 때문에 사용하지 않는 loadsh모듈이 포함되어도 빌드타임이라 알 수 없음.

### 트리쉐이킹에 대한 오해

- require()은 트리세이킹이 불가능하다? → 반은 맞고 반은 틀림
- exports객체에 동적으로 할당하지 않는다면? , 특정 상황에서 webpack-common-shake와 같은 플러그인을 사용해 트리쉐이킹을 하기도함
- 그러나 현실적으로 commonJs 코드는 거의 대부분 require로 동적으로 모듈을 가지고 옴

---

## 4.3 ESModule이란

- commonJs는 서버사이드 환경에서는 좋았는데 브라우저 환경에서는 여러모로 사용하기에 제약사항이 많았음.
- 이를 극복하기 위해 ESModule이 등장

### ESModule 탄생 배경

**브라우저 환경에서의 CommonJs 문제점**

- 동기적 로딩 방식: 서버는 문제가 없지만 브라우저에서는 블로킹 발생할 수 있음.
- 프리로딩 불가: CommonJs는 모듈을 미리 로드할 수 없다.
- 트리쉐이킹 및 최적화 어려움: CommonJs는 모듈을 런타임에 분석하므로 트리쉐이킹이 거의 불가능
- 메모리 이슈: CommonJs의 모듈래퍼는 클로저를 활용해 각 모듈간 단일 스코프를 생성하는데 이는 메모리 사용량 문제 야기
- 브라우저 호환성 문제: CommonJs는 서버사이드 환경에서 설계된 시스템이라 브라우저에서 직접 사용할 수 없고 webpack같은 번들러가 필요

→ 그리서 ECMAScript에서 표준으로 ESModule만듦

## ESModule 특징

- 공식적으로 import와 export 문법으로 모듈을 가지고오고 내보내기 가능

### **export**

- default 키워드를 활용해 기본 내보내기 모듈을 지정 가능

```jsx
export default sum
export {sum as default} // 두개 동일
```

한가지 export 대해 궁금했던점

```jsx
export default function sum(){}  // 가능

export default const sum =() =>{} // 불가능
```

- function sum()이 함수선언문이 아니라 **익명함수 값 으로 취급**
- const sum =() ⇒{} 은 변수를 만드는 선언문.
- **잘못된 예:** `export default const a = 1;`
  - 엔진 입장에서는 "가장 중요한 값 하나만 내보낼 건데, 왜 거기서 새로운 변수 이름(`a`)을 정의하고 있어?"라고 묻는 격임.

```jsx
export default (a, b) => a + b; // 화살표 함수 '값' 자체를 익명함수로 즉시 내보내기
```

하지만 React에선 권장하지 않음

```jsx
// MyComponent.js
export default (props) => {
  return <h1>안녕하세요!</h1>;
};

// App.js (가져다 쓰는 쪽)
import MyComponent from "./MyComponent";
```

- 이렇게 하면 React 개발자 도구에서 어떤 컴포넌트인지 이름이 나오지 않음.
- 해당 컴포넌트가 `Anonymous` 혹은 `default` 로 표시되어서 나옴

둘중 어느방식을 선호하는지?

```jsx
const MyComponent = (props) => {
  return <h1>안녕하세요!</h1>;
};

export default MyComponent;
```

vs

```jsx
export default function MyComponent(props) {
  return <h1>안녕하세요!</h1>;
}
```

### **import**

**이름을 지정해서 가져오기**

- **기본 사용:** `import { sum } from './math.js';`
- **여러 개 가져오기:** `import { sum, multiply } from './math.js';`
- **이름 바꿔서 가져오기 (`as`):** 가져온 이름이 내 파일의 변수명과 중복될 때 유용합니다.
  - `import { sum as add } from './math.js';`

**Default Import (기본값 가져오기)**

- `export default`로 내보낸 모듈을 가져올 때 사용합니다. 중괄호가 없으며, **이름을 내 마음대로** 지을 수 있습니다.
- **사용:** `import MyCalc from './math.js';` (내보낸 쪽에서 이름이 `sum`이었어도 `MyCalc`로 쓸 수 있음)

**Namespace Import (전체 다 가져오기)**

내보낸 모든 항목을 하나의 객체에 담아서 가져옵니다.

- **사용:** `import * as MathAPI from './math.js';`
- **호출:** `MathAPI.sum(1, 2);`, `MathAPI.multiply(3, 4);`

### import.meta

`import.meta`는 현재 실행 중인 **ES 모듈에 대한 메타데이터**를 담고 있는 특별한 객체입니다.

- CommonJs는 **dirname, **filename과 같은 특별한 변수를 모듈 래퍼 내부 모듈 스코프에서 제공
- 하지만 이런 특별한 변수는 ESModule이 알 수 없음
- 이 변수들 대신 import.meta를 사용

제공하는 속성

- import.meta.url: 현재 모듈의 URL을 나타내는 문자열
- import.meta.resolve(moduleName): 현재 모듈의 URL을 기반으로 모듈 지정자를 URL로 나타내는 메서드

**vite와 같은 번들러에서 환경변수를 관리하는데 주로 사용**

Vite가 실행 시점에 변수를 찾는 것이 아니라, **빌드 시점에 코드를 글자 그대로 갈아치운다는것**

- **동작 방식:** 코드에 `import.meta.env.VITE_API_URL`이라고 적으면, Vite는 빌드 과정에서 이 문구를 실제 값(예: `"https://api.example.com"`)으로 치환.
- **이유:** 브라우저에는 실제 `.env` 파일이나 시스템 환경 변수에 접근할 수 있는 권한이 없기 때문. 따라서 번들러가 미리 "정답"을 적어서 브라우저에 보내주는 방식임.

### .mjs 확장자

Node.js는 기본적으로 모든 `.js` 파일을 **CommonJS(require)** 방식으로 해석하려고 한다. 하지만 최신 표준인 **ES Module(import)**을 사용하고 싶을 때 두 가지 방법이 있다

- **방법 A:** `package.json`에 `"type": "module"` 설정을 추가한다. (해당 폴더 내 모든 `.js`가 ESM이 됨)
- **방법 B:** 파일 확장자를 `.mjs`로 바꾼다. (설정과 상관없이 이 파일은 무조건 ESM이 됨)

## 정적 모듈 로딩

- ESModule은 빌드시점에 모듈을 가지고 올 수 있음.
- 이로인해 다음과 같은 장점이 있음
  - 불필요한 대기 시간 감소, 코드 예측 가능, 모듈캐싱과 최적화, 의존성 관리 용이, 번들 최적화

**필요한 상황에선 동적 로딩 가능**

- import()는 함수처럼 호출하며 이 함수는 항상 **Promise 객체**를 반환하므로 `then/catch`나 `async/await`와 함께 사용
- 주로 코드 스플릿팅이나 조건무 모듈 로드를 할 때 사용

```jsx
// 1. Promise 방식
import("./math.js")
  .then((math) => {
    console.log(math.add(1, 2));
  })
  .catch((err) => {
    console.log("모듈 로드 실패:", err);
  });

// 2. async/await 방식 (더 많이 쓰임)
async function loadMath() {
  const math = await import("./math.js");
  console.log(math.add(10, 20));
}
```

## ESModule의 동작 방식

- ESModule의 명세에는 모듈파싱, 모듈 인스턴스화, 모듈 평가 세단계로 나눠서 설명

**모듈 파싱**

파일을 로드하고 그 내용을 해석하여 **모듈 레코드(Module Record)**로 변환하는 단계

- **동작:** 브라우저나 런타임이 엔트리 파일부터 시작해 `import` 문을 찾아다니며 필요한 모든 파일을 다운로드합니다.
- **핵심:** 이 과정에서 소스 코드를 구문 분석(Parsing)하여, 어떤 변수를 내보내고 가져오는지에 대한 **설계도(Module Record)**를 메모리에 생성합니다.
- **특징:** 이 단계는 실제 코드를 실행하는 것이 아니라, 구조만 파악하는 단계입니다.

**모듈 인스턴스화**

메모리상의 주소를 할당하고, `export`와 `import` 사이의 **연결 통로(Binding)**를 만드는 단계입니다.

- **동작:** 모든 모듈 레코드에 대해 메모리 공간을 확보하고, `export`하는 쪽과 `import`하는 쪽이 **동일한 메모리 주소**를 바라보도록 연결합니다.
- **핵심:** 이를 **실시간 바인딩(Live Bindings)**이라고 합니다. 실제 값이 아직 들어있지는 않지만, 값이 담길 '박스'들을 미리 선으로 이어놓는 작업입니다.
- **특징:** 이 단계가 끝나야 비로소 모든 모듈 사이의 의존 관계가 확정됩니다.

**모듈 평가**

드디어 코드를 실제로 실행하여 메모리 공간에 **실제 값**을 채워 넣는 단계입니다.

- **동작:** 최하위 모듈(의존성 트리의 끝)부터 시작하여 위쪽으로 올라오며 코드를 실행합니다.
- **핵심:** 실행 결과 계산된 값들이 2단계에서 만들어둔 메모리 주소(박스)에 할당됩니다.
- **특징:** 이 과정은 **딱 한 번만 실행**됩니다. 동일한 모듈을 여러 곳에서 `import`해도 이미 평가된 값이 들어있는 메모리 주소를 재사용합니다.

**동작방식 정리**

- ESModule은 추상구문트리로 파싱한뒤 코드내의 import문을 통해 의존성 파악→ 모듈레코드로 일종의 의존성 그래프 생성
- 이후 모듈 인스턴스화 단계에서 필요한 모듈의 메모리주소를 설정
- 마지막으로 모듈 평가단계에서 최종적인 값을 얻는다.

![image.png](attachment:1ef8852f-6f9e-4ce5-be1e-1ed6f895771c:image.png)

### ESModule의 순환참조

- 순환 참조 문제를 해결하기 위해 자바스크립트의 Promise를 활용한다.
  ![image.png](attachment:c4076dfc-f571-40b0-b230-d1dc38953a42:image.png)
- 이렇게 작성하면 B가 실행됨 → A가 실행됨 정상작동
- 하지만 아직 로드되지 않은 모듈의 값을 참조하려고하면 에러가발생

### Node에서의 ESModule

- 생략

### CommonJS와 상호운용성

**ESModule에서 ConnomJs 호출하기**

```jsx
// CJS 모듈 (math.js)
exports.add = (a, b) => a + b;

// ESM 모듈 (main.mjs)
import math from "./math.js"; // Default import (권장)
import { add } from "./math.js"; // Named import (지원됨)
```

**CommonJs에서 ESModule 호출하기**

```jsx
// index.js (CommonJS)

// require('./module.mjs') -> 에러 발생!

async function main() {
  // 비동기적으로 ESM 모듈을 로드
  const { default: sum } = await import("./index.mjs");
  console.log(sum(1, 2)); // 3
}

main();
```

## 4.4 Node.js는 어떻게 node_modules에서 패키지를 찾아갈까?

- 모듈해석 알고리즘
- 3가지 모듈해석 기법이있음.

### CommonJs에서 모듈을 찾는법

**1. LOAD_AS_FILE (파일로 로드)**

입력받은 경로 `X`가 파일인지 먼저 확인합니다.

- `X`라는 파일이 있는지 확인합니다.
- 없다면 `X.js`를 확인합니다.
- 없다면 `X.json`을 확인합니다. (JSON 객체로 파싱됨)
- 없다면 `X.node`를 확인합니다. (컴파일된 바이너리 모듈)

**2. LOAD_INDEX (인덱스로 로드)**

파일이 없다면, 해당 이름의 디렉토리 안에 기본 파일이 있는지 확인합니다.

- `X/index.js`가 있는지 확인합니다.
- 없다면 `X/index.json`을 확인합니다.
- 없다면 `X/index.node`를 확인합니다.

**3. LOAD_AS_DIRECTORY (디렉토리로 로드)**

`X`가 디렉토리라면, 그 안의 설정을 먼저 읽습니다.

- **package.json 확인:** `X/package.json` 파일이 있는지 보고, 있다면 그 안의 `"main"` 필드에 적힌 경로를 찾아가서 **LOAD_AS_FILE**을 수행합니다.
- **실패 시:** `package.json`이 없거나 `main` 필드가 없으면 위에서 설명한 **LOAD_INDEX** 단계로 넘어갑니다.

**4. LOAD_NODE_MODULES (외부 라이브러리 로드)**

경로가 `./`나 `/`로 시작하지 않는 이름(예: `require('chalk')`)일 때 실행됩니다.

- 현재 디렉토리의 `node_modules`에서 해당 모듈을 찾습니다.
- 찾지 못하면 한 단계 상위 디렉토리의 `node_modules`로 올라가며 **루트(Root)** 디렉토리에 도달할 때까지 반복합니다.

**RESOLVE_ESM_MATCH가 포함되어 있는 경우**

`RESOLVE_ESM_MATCH` 관련 로직이 CJS 알고리즘에 존재하는 진짜 이유는 **ESM을 불러오기 위해서가 아니라, 패키지의 `exports` 지도를 해석하여 "CJS 사용자를 위한 전용 통로"를 찾기 위해서**입니다.

### ESModule에서 모듈을 찾는법

https://nodejs.org/docs/latest-v18.x/api/esm.html#resolution-algorithm-specification

[ESModule이 모듈을 찾는 알고리즘](https://www.notion.so/ESModule-2fa2acd7231380da92e8e1c34d849819?pvs=21)

**ESM_RESOLVE (해석 시작)**

- 가장 먼저 해당 `source`가 상대 경로(`./`), 절대 경로(`/`), 또는 패키지 이름인지 확인합니다.

**PACKAGE_EXPORTS_RESOLVE**

- 대상 패키지의 `package.json`을 읽습니다.
- **`exports` 필드 확인:** `import`로 모듈을 부르고 있으므로, `exports` 내부의 **`"import"`** 키에 매칭되는 파일을 찾습니다.
- 만약 `"import"` 키가 없다면, 해당 모듈을 불러오는 데 실패하거나(CJS 전용 패키지인 경우), `main` 필드를 확인하는 하위 호환 단계를 거칩니다.

**ESM_FORMAT**

- 불러온 파일이 어떤 Format인지 확인

탐색 방식 비교

| **특징**          | **CommonJS (CJS)**                 | **ES Modules (ESM)**                     |
| ----------------- | ---------------------------------- | ---------------------------------------- |
| **결정 시점**     | **런타임** (코드 실행 중)          | **파싱 타임** (실행 전 정적 분석)        |
| **확장자 생략**   | 가능 (`.js`, `.json` 등 자동 탐색) | **불가능** (원칙적으로 명시 필요)        |
| **디렉토리 탐색** | `index.js` 자동 탐색               | 자동 탐색하지 않음 (명시 필요)           |
| **핵심 알고리즘** | `LOAD_AS_FILE`, `LOAD_INDEX`       | `ESM_RESOLVE`, `PACKAGE_EXPORTS_RESOLVE` |

## 4.5 ESModule과 CommonJS 무엇이 정답일까?

### CommonJs와 EsModule 동시에 지원하는 듀얼패키지 개발하기
