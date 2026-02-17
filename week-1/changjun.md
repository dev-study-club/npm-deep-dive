# npm과 유의적 버전의 이해

## 1.1 npm의 정의와 역사

### 1.1.1 npm의 역사와 배경

- **이름의 유래:** 흔히 'Node Package Manager'로 알려져 있으나, 사실 npm 그 자체는 하나의 단어이다.
  - 전신은 다양한 bash 유틸리티인 `pm`이며, 이는 `pkgmakeinst`의 약자였다.
  - 굳이 약자로 소개하자면 **Node pm** 또는 **Node pkgmakeinst**가 옳다.
- **개발자:** 아이작 Z. 슐루터(Isaac Z. Schlueter)가 처음 만들었다.
- **생태계의 변화:**
  - 초기에는 Node.js 전용 코드만 있었으며, 프런트엔드 리소스는 CDN(<script> 태그 방식)을 주로 사용했다.
  - 페이스북이 **React**를 npm에 업로드하며 Angular, Vue 등도 CDN 대신 npm 배포를 선호하기 시작했다.
- **인수:** 2020년에 GitHub이 npm을 인수했다.

### 1.1.2 npm의 주요 기능

- 패키지 설치 및 관리
- 패키지 배포 및 공유 (`https://registry.npmjs.org/패키지명`으로 업로드 확인 가능)
- 스크립트 실행 및 npmjs.com 운영

### 1.1.3 npm과 관련된 유용한 사이트

- **번들포비아(Bundlephobia):** 패키지 크기, 구성, export 하는 함수의 구체적 크기 정보 제공.
- **npm 트랜드(npm trends):** 패키지 간의 다운로드 수 비교를 통해 라이브러리 선택 시 활용.
- **unpkg:** npm에 업로드된 파일을 직접 확인하는 서비스 (`https://www.unpkg.com/:package@:version/:file`).
- **snyk:** 오픈소스 보안 취약점 확인. (가장 유명한 사건: `event-stream` 취약점)

---

## 1.2 유의적 버전 (Semantic Versioning)이란?

### 1.2.1 등장 배경과 정의

- 수많은 패키지의 의존성을 일관적으로 관리하기 위한 규칙이다.
- 버전은 **주.부.수(Major.Minor.Patch)** 형태로 구성된다.
  - **Major (주):** 기존 버전과 호환되지 않는 API 변경 시.
  - **Minor (부):** 호환성을 유지하며 새로운 기능 추가 시.
  - **Patch (수):** 호환성을 유지하며 버그 수정 시.

### 1.2.2 구체적 명세 및 rc 버전

- 총 11가지의 명세가 존재한다.
- **rc (Release Candidate):** 정식 버전 출시 직전의 후보 버전임을 의미한다.

### 1.2.3~4 문법과 활용

- **semver 패키지:** npm에서 제공하는 유의적 버전 유효성 및 비교 확인 도구.

---

## 1.3 유의적 버전과 npm 생태계의 명과 암

### 1.3.1 left-pad 사건: 의존성 패키지 삭제의 위험성

- **사건 발단:** 개발자가 만든 `kik` 패키지가 기업명과 동일하다는 이유로 삭제 요청을 받음.
- **전개:** 삭제 요청 메일이 무례하다고 느낀 개발자가 자신의 모든 패키지(left-pad 포함)를 삭제.
- **결과:** `left-pad`에 의존하던 Babel 등의 설치가 불가능해짐. npm 팀이 강제로 작업을 되돌림.
- **대책:** 다른 패키지가 의존하는 경우 삭제를 어렵게 하고, `security-holder` 패키지 등을 추가함.

### 1.3.2 everything 패키지

- 모든 npm 패키지를 의존성으로 추가한 패키지. (의존성 정책의 허점을 이용한 사례)
- 이후

### 1.3.3 is-promise 사건: 잘못된 부 버전 업데이트

- **문제:** CJS와 ESM을 동시 지원하기 위해 부 버전(Minor)을 올렸으나, 이로 인해 `create-react-app` 등에서 피해 발생.
- **의존성 체인:** `inquirer` → `run-async` → `is-promise` (당시 2.2.0 버전 이슈).
- **버전 기호의 이해:**
  - `^` (Caret): 해당 버전 기준, 다음 Major 미만까지 호환 (`^1.2.3` → `1.2.3` 이상 `2.0.0` 미만).
  - `~` (Tilde): 해당 버전 기준, 다음 Minor 미만까지 호환 (`~1.2.3` → `1.2.3` 이상 `1.3.0` 미만).

### 1.3.4 color.js와 faker.js → 개발자가 같은데

- 개발자가 고의적으로 부/수 버전을 업데이트하여 시스템에 영향을 준 사례 (Protestware 이슈).

### 1.3.5 event-stream 사건

- `flatmap-stream` 내부에 비트코인 탈취 악성코드를 심고, 버전 규약(`^`, `~`)을 이용해 사용자들이 악성코드가 포함된 수 버전을 업데이트하도록 유도함.

---

## 1.3.6 유의적 버전과 npm 사용 시 주의점

### 1.3.6.1 유의적 버전은 '규약'일 뿐이다

- 강제 요소가 아니므로 항상 **changelog.md**나 릴리즈 노트를 확인하는 습관이 필요하다.
- 불안하다면 `^`, `~` 대신 **고정 버전**을 사용하는 것도 방법이다.

### 1.3.6.2 설치 전 검증

- 대체 불가능한가? 충분히 검증되었는가? 타당한 dependencies를 가지고 있는가?

### 1.3.6.3 락 파일(lock file) 관리

- 락 파일의 변경은 실제 설치 버전의 변경을 의미한다.
- **npm ci 활용:** `npm install`은 락 파일을 변경할 수 있지만, **`npm ci`는 락 파일을 기준으로만 설치**하므로 훨씬 보수적이고 안전하다.
- 필요시 yarn/pnpm의 PNP(Plug n Play)나 Zero Install 고려.

### 1.3.6.4 보안 취약점 대응

- **snyk:** 보안 위협 모니터링 서비스.
- **dependabot:** 깃허브에서 보안 취약점을 확인하고 자동으로 해결 PR을 생성해 주는 서비스.

---

내용 중에 수정이 필요하거나, 특정 섹션을 더 강조하고 싶으신 부분이 있다면 말씀해 주세요. 바로 반영하겠습니다.

# 토론해볼만한 내용

- "최신 버그 수정을 자동으로 반영하기 위해 `^`를 써야 한다" vs "안정성을 위해 무조건 고정 버전을 쓰고 수동으로 올려야 한다"
- 어떤 패키지를 설치하면 ^, ~, 혹은 아무것도 없이 설치되는 경우가 있던데 이 경우는 어떤건지 설명해줄 수 있는 사람?
- 현재 패키지 매니저 어떤거 쓰고 있는지?
- 현재 프로젝트에서 npm을 쓰고 있다면, pnpm이나 yarn berry로 쓴다면 어떤 장점이 있는지? (난 yarn berry 안써봐서 모름..)

```
 "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@notionhq/client": "^5.1.0",
    "@radix-ui/react-slot": "^1.2.4",
    "@tanstack/react-query": "^5.62.0",
    "@types/react-syntax-highlighter": "^15.5.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "feed": "^5.1.0",
    "fuse.js": "^7.1.0",
    "mermaid": "^11.12.1",
    "next": "15.5.9",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-syntax-highlighter": "^15.6.6",
    "redis": "^5.10.0",
    "sharp": "^0.34.4",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^17.2.3",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "tailwindcss": "^4",
    "tsx": "^4.20.6",
    "typescript": "^5"
  }
```

https://github.com/then/is-promise/issues?q=is%3Aissue%20state%3Aclosed

https://github.com/Marak/colors.js/issues/285
