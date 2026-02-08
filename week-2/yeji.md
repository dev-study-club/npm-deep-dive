# package.json과 npm 파헤치기

## 1. package.json은 무엇인가

`package.json`은 단순한 설정 파일이 아니다. 이 파일은 Node.js 프로젝트의 **메타데이터이자 계약서**로서, 다음과 같은 정보를 모두 정의한다.

- **프로젝트 식별**: 이 프로젝트가 어떤 패키지인지
- **실행 방법**: 어떻게 실행되고 빌드되는지
- **의존성 관계**: 어떤 외부 패키지들에 의존하는지
- **배포 전략**: 어떤 형태로 배포되고 사용될 수 있는지

즉, `package.json`은 프로젝트의 모든 메타정보를 담고 있는 명세서이며, npm 생태계에서 프로젝트를 식별하고 관리하는 핵심 문서다.


## 2. `name` 필드의 의미

### name 필드는 언제 중요한가

로컬 프로젝트에서 `name` 필드는 큰 의미가 없지만, npm 레지스트리에 패키지를 업로드(`npm publish`)하는 순간 전 세계에서 **유일한 식별자**가 된다. 한 번 등록된 이름은 다른 누구도 사용할 수 없으며, 패키지의 영구적인 식별자로 동작한다.

### 왜 name 필드에는 제약이 많은가

npm 레지스트리는 패키지를 내부적으로 **URL 경로 기반으로 식별**한다. 예를 들어, `lodash` 패키지는 `https://registry.npmjs.org/lodash`와 같은 경로로 접근된다. 따라서 `name` 필드는 URL에서 안전하게 표현 가능한 문자열만 허용한다. (p.55)

이는 다음과 같은 제약으로 이어진다.

- 214자 이하여야 함
- 소문자로만 구성
- URL-safe 문자만 사용 (대시 `-`, 언더스코어 `_` 등)
- 선행 점(`.`)이나 언더스코어(`_`)로 시작 불가
- 대문자, 공백, 특수 문자 등은 사용 불가

**"URL에서 안전하다는 게 정확히 무슨 뜻이지?"**

이 질문은 URL 표준을 살펴보면 명확해진다. npm의 name 제약은 웹 표준 규약에 근거한 것이다.


## 3. URL 표준과 npm의 관계

### [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986)이 정의한 URL 구조

URL(Uniform Resource Locator)은 IETF(Internet Engineering Task Force)에서 RFC 3986 표준으로 정의되었다. URL의 전체 구조는 다음과 같다.

```
scheme://[userinfo@]host[:port]/path?query#fragment
```

각 구성 요소
- `scheme`: 프로토콜 (http, https, ftp 등)
- `host`: 도메인 또는 IP 주소
- `port`: 포트 번호 (선택적)
- `path`: 리소스 경로
- `query`: 쿼리 파라미터
- `fragment`: 문서 내 위치

npm 패키지 이름과 직접적으로 연결되는 영역은 **`path`** 부분이다.

### path의 특징과 제약

URL의 `path` 영역은 단순한 문자열이 아니라 **의미가 부여된 구조**다.

- **대소문자 구분**: 경로는 대소문자를 구분한다
- **예약 문자 존재**: `/`, `?`, `#`, `&` 등은 특별한 의미를 가짐
- **특수 세그먼트**
  - `.` = 현재 디렉터리
  - `..` = 상위 디렉터리
- **퍼센트 인코딩**: 안전하지 않은 문자는 `%XX` 형식으로 인코딩됨

npm이 패키지 이름에 대문자, 공백, 특수 문자, 애매한 기호를 제한하는 이유가 바로 여기에 있다. 패키지 이름이 URL path로 직접 매핑되기 때문에, URL-safe한 문자만 허용하는 것이다.


## 4. Origin 개념과 브라우저 보안

### Origin의 정의

웹 보안의 핵심 개념 중 하나가 **Origin(출처)** 이다. Origin은 다음 세 가지 요소의 조합으로 정의된다.

```
Origin = scheme + host + port
```

예시:
- `https://example.com:443` (포트 443은 HTTPS 기본값)
- `http://localhost:3000`
- `https://api.example.com`

**중요한 점:**
- `path`, `query`, `fragment`는 Origin에 포함되지 **않는다**
- `https://example.com/api`와 `https://example.com/user`는 **같은 Origin**
- 브라우저 입장에서 **보안 경계의 최소 단위**

### Same-Origin Policy (SOP)

**Same-Origin Policy는 브라우저의 기본 보안 정책**이다. 

핵심 원칙

- Origin이 다르면 JavaScript로 리소스에 접근할 수 없음
- 서버의 규칙이 아니라 **브라우저가 스스로 강제하는 규칙**
- XSS(Cross-Site Scripting), CSRF(Cross-Site Request Forgery) 등의 공격을 방어

예를 들어, `https://example.com`에서 로드된 JavaScript는 `https://api.other.com`의 데이터를 직접 읽을 수 없다. 이것이 Same-Origin Policy의 보호 메커니즘이다.


## 5. CORS와 Preflight 요청

### CORS의 정확한 역할

**CORS(Cross-Origin Resource Sharing)** 는 SOP로 차단되는 요청 중 서버가 "이 요청은 허용해도 된다"고 명시한 경우에만 브라우저가 예외적으로 허용하는 메커니즘이다.

중요한 오해 바로잡기
- CORS는 **서버 기능이 아니다**
- CORS는 **브라우저가 SOP를 완화하는 규칙**
- 서버는 단지 허용 정책을 HTTP 헤더로 선언할 뿐

CORS 관련 주요 헤더:
- `Access-Control-Allow-Origin`: 허용할 Origin
- `Access-Control-Allow-Methods`: 허용할 HTTP 메서드
- `Access-Control-Allow-Headers`: 허용할 커스텀 헤더
- `Access-Control-Allow-Credentials`: 인증 정보 포함 여부

### Preflight 요청은 왜 필요한가

**Simple Request**가 아닌 경우, 브라우저는 본 요청을 바로 보내지 않고 먼저 **OPTIONS 메서드로 Preflight 요청**을 보낸다.

**Simple Request의 조건**
- HTTP 메서드가 `GET`, `HEAD`, `POST` 중 하나
- 커스텀 헤더를 사용하지 않음
- `Content-Type`이 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 중 하나

이 조건을 벗어나면 Preflight가 발생한다. 예:
- `PUT`, `DELETE`, `PATCH` 메서드 사용
- `Content-Type: application/json`
- 커스텀 헤더 (예: `Authorization`) 추가

**OPTIONS 요청(Preflight)의 특징**

- 리소스를 변경하지 않는다
- 서버 상태에 영향을 주지 않는다
- 본 요청과 완전히 분리된 메타 요청
- 따라서 "안전한 진단용 메서드"로 가장 적합

### 서버와 브라우저의 역할

**서버의 역할**
- 실제 요청을 처리하지 않고, **허용 여부만 선언**
- OPTIONS 요청에 대해 CORS 헤더로 응답

**Preflight를 보내는 주체**
- 서버 ❌
- **브라우저 ⭕**

브라우저가 자동으로 판단하여 Preflight를 보내고, 서버의 응답을 확인한 후 본 요청을 보낼지 결정한다.


## 6. scope (`@scope/package`)

### scope는 npm 레지스트리 차원의 네임스페이스

npm에서 **scoped package**는 `@scope/packagename` 형식으로 표현된다. 이는 npm 레지스트리 차원에서 제공하는 네임스페이스 메커니즘이다.

**실제 사용 예시**

```
@tanstack/react-query
@babel/core
@types/node
@toss/react
```

### scope의 장점

1. **이름 충돌 방지**: 동일한 패키지 이름도 scope가 다르면 공존 가능
2. **조직/회사별 그룹화**: 관련 있는 패키지를 하나의 그룹으로 묶음
3. **private 패키지 지원**: npm private registry에서 조직별로 관리 가능
4. **브랜딩**: `@toss/`, `@vercel/` 등 회사명 기반 scope로 브랜드 정체성 확보

실무에서는 조직명 또는 회사명을 scope로 사용하는 경우가 대부분이다.


## 7. 배포 메타데이터 필드들

이 필드들은 **코드 실행과는 무관**하며, npm 레지스트리에 노출되는 정보다. 하지만 오픈소스 생태계에서는 매우 중요한 의미를 갖는다.

### description

패키지에 대한 간단한 설명을 제공하는 필드다. 

```json
{
  "description": "Fast, unopinionated, minimalist web framework"
}
```

`npm search <키워드>` 또는 `npm info <패키지명>`으로 확인 가능하며, npmjs.com에서도 검색 결과에 표시된다.

### license

라이선스 정보를 명시하는 필드. 법적으로 매우 중요하다.

```json
{
  "license": "MIT"
}
```

- **OSI Approved Licenses**: Open Source Initiative 조직에서 인정한 오픈소스 라이선스
- **SPDX ID**: Software Package Data Exchange 표준 ID를 사용하여 명확히 선언
- **법적 분쟁 예방**: 라이선스를 명시하지 않으면 법적으로 모든 권리가 보류됨 (All Rights Reserved)

주요 SPDX ID
- `MIT`: 가장 관대한 라이선스
- `Apache-2.0`: 특허권 보호 포함
- `GPL-3.0`: Copyleft 라이선스
- `ISC`: MIT와 유사하지만 더 간결
- `BSD-3-Clause`: 3-조항 BSD 라이선스

### author, contributors, funding

```json
{
  "author": "TJ Holowaychuk <tj@vision-media.ca>",
  "contributors": [
    "Aaron Heckmann <aaron.heckmann@gmail.com>",
    "Ciaran Jessup <ciaranj@gmail.com>"
  ],
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/example"
  }
}
```

- **오픈소스 생태계 관점에서 중요**: 기여자 인정, 후원 활성화
- `funding` 필드는 npm 7+에서 지원되며, `npm fund` 명령어로 확인 가능


## 8. files와 .npmignore

### files 필드의 역할

`files` 필드는 `npm publish` 시 포함할 파일을 명시적으로 선언한다.

```json
{
  "files": [
    "dist/",
    "lib/",
    "*.d.ts",
    "README.md"
  ]
}
```

**목적**
- 불필요한 파일 배포 방지 (테스트 코드, 빌드 설정 등)
- 패키지 크기 최소화
- 사용자 설치 시간 및 비용 감소

### 우선순위 규칙 (중요!)

파일 포함/제외 우선순위

1. `.npmignore`가 존재하면 `.gitignore`보다 우선
2. 최상위 디렉터리에서는 `files` 필드가 가장 높은 우선순위
3. 하위 디렉터리에서는 `.npmignore`가 우선

### glob 패턴 사용

일반적인 패키지는 여러 파일을 동시에 업로드하기 때문에, 일일이 파일을 지정하기보다는 **glob 패턴**을 사용하는 것이 일반적이다.

**주요 glob 패턴**

- `*.js`: 0개 이상의 임의 문자에 일치 (모든 .js 파일)
- `?.js`: 정확히 하나의 문자에 일치 (a.js, b.js 등)
- `[abc].js`: 괄호 안의 문자 중 하나와 일치 (a.js, b.js, c.js)
- `**/`: 모든 디렉터리에 대한 재귀 탐색 (`**/*.js` = 모든 하위 디렉터리의 .js 파일)

**예시:**

```json
{
  "files": [
    "dist/**/*.js",
    "lib/**/*.js",
    "*.d.ts"
  ]
}
```

### 항상 포함되는 파일 (자동)

`files` 필드 값과 상관없이 항상 포함되는 파일

- `package.json`
- `README`, `README.md`, `readme.md`
- `LICENSE`, `LICENCE`, `license`, `licence`
- `package.json`의 `main` 또는 `bin` 필드에 지정된 파일

### 항상 무시되는 파일 (자동)

`files` 필드에 명시해도 무조건 무시되는 파일

- `.DS_Store` (macOS)
- `.git`, `.svn`, `.hg` (VCS)
- `.npmrc` (npm 설정)
- `node_modules/`
- `package-lock.json`, `pnpm-lock.json`, `yarn.lock`


## 9. main, bin, shebang

### main: 라이브러리의 진입점

```json
{
  "main": "dist/index.js"
}
```

- **라이브러리의 진입점**을 정의
- `require('your-package')` 또는 `import ... from 'your-package'` 시 로드되는 파일
- `main` 필드가 없으면 기본값으로 **`index.js`**가 사용됨
- CommonJS(CJS) 모듈 시스템의 표준 필드

**주의사항**
- `module` 필드: ESM(ES Modules) 진입점
- `exports` 필드: 최신 표준으로, `main`과 `module`을 대체 가능

### bin: CLI 실행 파일 선언

```json
{
  "bin": {
    "mycli": "./bin/cli.js"
  }
}
```

또는 단일 명령어인 경우:

```json
{
  "name": "mycli",
  "bin": "./bin/cli.js"
}
```

- **실행 가능한 CLI 파일**을 선언
- 전역 설치(`npm install -g`) 시 시스템 PATH에 명령어가 등록됨
- 로컬 설치 시 `node_modules/.bin/` 디렉터리에 심볼릭 링크 생성

### shebang: OS에게 실행 방법 알림

`bin` 필드에 지정된 파일의 첫 줄에는 반드시 **shebang**이 있어야 한다.

```javascript
#!/usr/bin/env node

console.log('Hello, CLI!');
```

**shebang의 역할**
- Unix/Linux/macOS에서 스크립트 파일의 인터프리터를 지정
- OS에게 "이 파일을 Node.js로 실행하라"고 알림
- `bin` 필드에서 `node` 경로를 직접 지정하지 않아도 됨
- `#!/usr/bin/env node`는 시스템 PATH에서 `node`를 찾아 실행

**왜 `/usr/bin/env`를 사용하는가?**
- Node.js 설치 경로가 시스템마다 다를 수 있음
- `env`는 PATH 환경변수에서 `node`를 찾아주므로 이식성이 높음


## 10. scripts와 실행 환경

### scripts는 npm의 실행 자동화 레이어

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

`npm run <script명>` 형태로 실행한다. 일부 스크립트는 `npm start`, `npm test`처럼 `run` 생략 가능하다.

### pre/post hook 지원

npm은 자동으로 실행되는 훅을 지원한다.

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "webpack",
    "postbuild": "echo Build completed!"
  }
}
```

`npm run build` 실행 시
1. `prebuild` 자동 실행
2. `build` 실행
3. `postbuild` 자동 실행

### 플랫폼별 환경 변수 문법 차이

**문제점:**
- Windows: `set NODE_ENV=production`
- Unix/Linux/macOS: `export NODE_ENV=production`

**해결책:**

1. **cross-env** 사용 (권장)

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node server.js"
  }
}
```

2. **dotenv** 사용

```javascript
// server.js
require('dotenv').config();
console.log(process.env.NODE_ENV);
```

실무에서는 `cross-env`와 `dotenv`를 조합하여 사용하는 경우가 많다.


## 11. 의존성 관련 필드들

### dependencies: 런타임 필수 의존성

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "~4.17.21"
  }
}
```

- **프로덕션 환경에서 필수**인 의존성
- `npm install` 시 자동으로 설치됨
- 배포된 애플리케이션 실행 시 반드시 필요

### devDependencies: 개발 환경 의존성

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "webpack": "^5.75.0"
  }
}
```

- 개발/빌드/테스트 시에만 필요
- `npm install --production` 시 설치되지 않음

### peerDependencies: 호환성 선언

```json
{
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

- "이 패키지를 사용하려면 React 18이 필요합니다"라는 선언
- 플러그인, 확장 라이브러리에서 주로 사용

**버전별 동작 차이**
- **npm 3~6**: 경고(warning)만 표시
- **npm 7 이후**: peerDependencies가 충족되지 않으면 설치 거부

### optionalDependencies: 선택적 의존성

```json
{
  "optionalDependencies": {
    "fsevents": "^2.3.2"
  }
}
```

- 설치 실패해도 전체 설치가 중단되지 않음
- 주로 **플랫폼별 최적화 패키지**에 사용
- 예: `fsevents`는 macOS 전용 파일 시스템 모니터링 라이브러리

### overrides: 하위 의존성 강제 수정

```json
{
  "overrides": {
    "lodash": "^4.17.21"
  }
}
```

- 전이적 의존성(transitive dependencies)의 버전을 강제로 변경
- 보안 취약점이 발견된 하위 의존성을 긴급하게 패치할 때 유용
- **강력하지만 책임이 따르는 기능**: 의존성 트리를 강제로 변경하므로 호환성 문제 발생 가능

**pnpm의 `overrides` vs npm의 `overrides`**
- npm은 npm 8.3.0+에서 지원
- Yarn은 `resolutions` 필드 사용

### engines: 실행 환경 명시

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

- Node.js 및 npm 버전 요구사항 명시
- **환경 불일치 방지**
- 기본적으로는 경고만 표시

**강제 적용 방법**

```bash
npm config set engine-strict true
```

또는 `.npmrc` 파일에

```
engine-strict=true
```

### workspaces: npm 모노레포 지원

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

- **npm 7+** 에서 공식 지원
- 하나의 저장소에서 여러 패키지 관리
- 공통 의존성을 루트에서 관리하여 중복 설치 방지

**실무에서의 위치**
- Lerna, Nx, Turborepo 등 전문 모노레포 도구에 비해 기능이 제한적
- 보조 수단으로 활용되는 경우가 많음


## 12. npm install은 실제로 무슨 일을 하나


`npm install`을 실행하면 내부적으로 다음과 같은 복잡한 과정이 진행된다.

1. **`package.json` 분석**: dependencies, devDependencies 파싱
2. **의존성 트리 계산**: `@npmcli/arborist` 라이브러리가 이상적인 의존성 트리를 계산
3. **버전 해결(Resolution)**: 시맨틱 버저닝 규칙에 따라 설치할 정확한 버전 결정
4. **평탄화(Flattening)**: 가능한 한 의존성을 최상위로 끌어올림
5. **다운로드 및 설치**: npm 레지스트리에서 패키지 다운로드
6. **`node_modules` 구조 생성**: 계산된 트리를 실제 파일 시스템에 반영
7. **`package-lock.json` 생성/업데이트**: 정확한 의존성 트리 고정

### @npmcli/arborist의 역할

- npm의 핵심 의존성 관리 엔진
- 이상적인 의존성 트리를 계산
- 다음을 통해 최적화:
  - **중복 제거(Deduplication)**: 동일한 패키지가 여러 번 설치되지 않도록
  - **버전 충돌 해결**: 여러 버전이 필요한 경우 적절히 분리
  - **평탄화 전략 적용**: 가능한 한 얕은 구조로 설치


## 13. node_modules 평탄화의 이유와 한계

### 평탄화(Flattening)가 도입된 배경

**npm v2 이전의 문제**
- 중첩된 의존성 구조 (nested dependencies)
- 동일한 패키지가 여러 번 중복 설치됨
- Windows에서 경로 길이 제한 (260자) 초과 문제

**예시:**

```
node_modules/
  A/
    node_modules/
      C/
  B/
    node_modules/
      C/  (동일한 C가 중복 설치됨)
```

### npm v3+의 평탄화 전략

가능한 한 의존성을 최상위로 끌어올린다.

```
node_modules/
  A/
  B/
  C/  (공통 의존성은 최상위로)
```

**장점:**
- 중복 설치 방지 → 디스크 공간 절약
- 경로 깊이 제한 회피
- 설치 속도 향상

### 평탄화의 부작용: 유령 의존성(Phantom Dependencies)

평탄화로 인해 발생하는 문제

```json
// package.json
{
  "dependencies": {
    "A": "1.0.0"
  }
}

// A가 내부적으로 lodash에 의존
```

```javascript
// 코드에서
import _ from 'lodash'; // lodash를 명시하지 않았는데도 작동!
```

- `package.json`에 명시하지 않은 패키지가 실행되는 문제
- `A`가 `lodash` 의존성을 제거하면 프로젝트가 갑자기 깨짐
- **암묵적 의존성**으로 인한 유지보수 어려움

**해결 방안**
- pnpm: 엄격한 의존성 격리
- Yarn Berry (v2+): Plug'n'Play
- 명시적으로 모든 의존성을 `package.json`에 선언


## 14. npx와 npm exec

### npx의 등장 배경

**과거의 불편함**

```bash
# 로컬 설치된 패키지 실행 시
./node_modules/.bin/eslint src/

# 또는 package.json scripts에 추가
```

**npx의 등장 (npm 5.2.0+)**

```bash
npx eslint src/
```

- 로컬 `node_modules/.bin/`에서 명령어 찾기
- 없으면 임시로 설치 후 실행
- 실행 후 임시 설치한 패키지는 삭제

**주요 사용 사례:**

```bash
# 프로젝트 초기화
npx create-react-app my-app
npx create-next-app my-app

# 일회성 도구 실행
npx prettier --write src/
npx typescript --init
```

### npm exec: 공식 표준화

npm 7 이후, npx의 기능이 **`npm exec`** 로 공식 통합되었다.

```bash
npm exec eslint src/
# 또는 짧게
npm x eslint src/
```

**현재 권장 방식:**
- `npm exec` 사용 (공식 명령어)
- `npx`는 여전히 작동하지만, 내부적으로 `npm exec`로 리다이렉트됨


## 15. sideEffects와 Tree Shaking

### sideEffects 필드란

```json
{
  "sideEffects": false
}
```

- **번들러(Webpack, Rollup 등)에게 전달하는 메타정보**
- "이 패키지의 모듈은 부수 효과(side effect)가 없다"고 선언
- 사용되지 않는 코드를 안전하게 제거(Tree Shaking) 가능

### 부수 효과(Side Effect)란?

코드를 import했을 때 **실행만으로 외부에 영향**을 주는 것

```javascript
// side effect 있음
import './polyfill.js'; // 전역 객체 수정
import './styles.css'; // CSS 주입

// side effect 없음
import { add } from './math.js'; // 순수 함수만 export
```

### sideEffects 설정의 영향

```json
{
  "sideEffects": false
}
```

이 설정이 있으면, Webpack은 다음 코드에서

```javascript
import { add } from 'my-lib';
```

`my-lib`의 다른 모든 코드를 **안전하게 제거**할 수 있다.

**주의사항:**

만약 `polyfill.js`가 실제로 필요한데 `sideEffects: false`로 설정되어 있으면?

```javascript
import 'my-lib/polyfill.js'; // 이 코드가 제거되어 버림!
```

→ **런타임 에러 발생**

### 일부 파일만 side effect가 있는 경우

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfill.js"
  ]
}
```

- CSS 파일은 거의 항상 side effect가 있음
- Polyfill 파일도 전역 객체를 수정하므로 side effect


## 16. 정리: 의존성 필드 비교표

| 필드 | 목적 | 설치 시점 | 주요 사용처 |
|------|------|-----------|-------------|
| `dependencies` | 런타임 필수 의존성 | 항상 | 프로덕션 코드에서 import |
| `devDependencies` | 개발/빌드/테스트 의존성 | 개발 환경만 | 테스트, 린트, 빌드 도구 |
| `peerDependencies` | 호환성 요구사항 선언 | 수동 설치 (npm 7+는 자동) | 플러그인, 확장 라이브러리 |
| `optionalDependencies` | 선택적 의존성 | 실패해도 무시 | 플랫폼별 최적화 |
| `bundledDependencies` | 번들에 포함할 의존성 | publish 시 포함 | 특정 버전 고정 배포 |

**peerDependencies 동작 변화**
- **npm 3~6**: 경고(warning)만 표시
- **npm 7+**: 자동 설치하며, 충돌 시 에러

**optionalDependencies 사용 예**
- `fsevents`: macOS 전용 파일 감시
- `node-sass`: 일부 플랫폼에서만 네이티브 바인딩

