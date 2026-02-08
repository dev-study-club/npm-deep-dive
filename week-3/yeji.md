#  npm의 대항마 yarn과 pnpm

## 1. npm의 한계

npm은 Node 생태계를 성장시킨 핵심 도구지만, 초창기 설계가 지금의 규모를 감당하기엔 구조적인 한계를 가진다.

### 1) 유령 의존성 (Ghost Dependency)

npm은 `node_modules`를 평탄화(hoisting)한다.

- A가 lodash를 의존
- B는 lodash를 의존하지 않음
- 그러나 상위에 hoist된 lodash를 B가 사용 가능

이 상태에서는 **의존성을 명시하지 않아도 동작하는 위험한 구조**가 된다.

이런 현상을 흔히 *transitive dependency leak*이라고 부른다.

환경이 바뀌거나 hoist 결과가 달라지면, 런타임에서만 드러나는 예측 불가능한 오류가 발생한다.

### 2) 디스크 I/O와 모듈 탐색 비용

Node의 모듈 해석 방식은 다음과 같다.

> 현재 디렉터리 → 상위 디렉터리 → 반복 탐색하며 node_modules 찾기
> 

이 구조는

- 디스크 탐색 과다
- 실행 환경에 따라 결과 달라짐
- 성능 저하

를 유발한다.


### 3) 거대한 node_modules

같은 패키지가 프로젝트마다 반복 복사된다.

수십~수백 MB, 많게는 GB 단위까지 커진다.


### 4) Lock 파일의 취약성

npm의 lock 파일(`package-lock.json`)은 변경에 민감하고, 과거에는 설치 최적화를 충분히 하지 못했다.

특정 시점의 의존성을 안정적으로 재현하는 능력(reproducibility)도 약했다. 버전별로 lock 포맷과 해석 방식이 바뀌어 팀/CI 간 일관성이 흔들리기도 했다.

### 2. Yarn의 등장과 철학 변화

Yarn은 2016년 Facebook에서 공개되었다.

> Yarn = Yet Another Resource Negotiator
> 

당시 npm은 `npm-shrinkwrap.json`을 수동 생성해야 했고,

의존성 재현성이 떨어졌다. Yarn은 이를 자동화하고 결정적(deterministic) 설치를 제공했다.

원래는 kittens package manager의 줄임말인 kpm이었지만, 이름이 겹치는 사례가 많아 yarn으로 바뀌었고 그 흔적이 로고에 남아 있다.

## 3. Yarn Classic과 Yarn Berry의 차이

### Yarn Classic (v1)

Yarn Classic은 npm 레지스트리 앞에서 동작하는 리버스 프락시였다.

```
yarn → registry.yarnpkg.com → registry.npmjs.org
```

이 구조는 전 세계 CDN, 트래픽, 보안 대응 비용을 Yarn이 감당해야 했다.

### Yarn Berry (v2+)

Yarn Berry는 이 구조를 완전히 버렸다.

```
registry.yarnpkg.com (CNAME) → registry.npmjs.org
```

Yarn 서버는 트래픽을 처리하지 않는다.

> “Yarn은 패키지 매니저이지, 레지스트리 운영자가 아니다.”
> 

## 4. 무결성 검증: Checksum

패키지 무결성을 checksum으로 확인한다? -> 무슨 말일까

checksum으로 무결성을 확인한다는 건 “파일이 원본 그대로인지, 단 한 비트도 안 변했는지”를 수학적으로 증명하는 절차다.

```json
"integrity":"sha512-..."
```

checksum은 다운로드한 파일이 원본과 단 한 비트도 다르지 않음을 수학적으로 증명한다.

lock 파일에는 이 integrity 값이 기록되며, 설치 시 매번 검증된다.

```jsx
"react": {
  "version": "18.2.0",
  "resolved": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
  "integrity": "sha512-9f8c...a7d2"
}
```

## 5. Yarn Berry의 핵심: PnP (Plug’n’Play)

전통적인 Node 방식:

```
node_modules 탐색
```

Yarn PnP 방식:

```
.pnp.cjs (의존성 맵)
```

- `node_modules` 생성하지 않음
- require/import를 Yarn이 가로채 해석
- 디스크 탐색 제거
- 유령 의존성 원천 차단

require()/import 호출을 `.pnp.cjs`가 먼저 처리하고, Node가 하던 디렉터리 탐색과 `node_modules` 순회 과정이 스킵된다.

## 6. ZipFS와 캐시 구조

```
.yarn/cache/react-npm-18.2.0.zip
```

- 압축 해제 없이 가상 파일 시스템처럼 사용
- 글로벌 캐시 재사용
- 디스크 사용량 최소화

## 6-1. Yarn Berry의 ZipFS, 글로벌 캐시, 그리고 운영상의 특징

Yarn Berry는 패키지를 다음과 같은 형태로 저장한다.

```
.yarn/cache/react-npm-18.2.0.zip

```

### 압축 해제하지 않고 Node에서 가상 파일 시스템처럼 읽는다

Yarn Berry는 Zip 파일을 실제로 풀지 않는다.

ZipFS(Zip File System)를 통해 **압축된 상태 그대로 가상 파일 시스템처럼 접근**한다.

> 즉, 디스크에 수천 개의 파일을 생성하는 대신 하나의 zip 파일을 마운트해서 사용하는 방식이다.
> 

### 글로벌 캐시를 활용한 중복 제거

동일한 버전의 패키지는 한 번만 저장된다.

- 여러 프로젝트에서 같은 버전 사용
- zip 파일 하나를 재사용
- 디스크 공간 대폭 절약

이는 npm/yarn classic의 “프로젝트마다 패키지 복사” 구조와 완전히 다르다.


## 6-2. Yarn Berry의 단점과 제약

이 구조는 강력하지만 제약도 분명하다.

### 1) `.pnp.cjs`가 없으면 동작 불가

PnP는 `.pnp.cjs` 의존성 맵에 전적으로 의존한다.

이 파일이 없으면

> Node는 패키지를 어디서 읽어야 하는지 전혀 알 수 없다.
> 

### 2) 모든 명령을 yarn을 통해 실행해야 한다

node_modules가 없기 때문에

- `node some-script.js`
- `eslint .`
- `tsc`

같은 직접 실행이 어려워진다.

반드시 Yarn을 통해 실행해야 하며, `yarn node`, `yarn dlx`, `yarn eslint` 같은 래퍼를 쓰는 패턴이 기본이 된다.

### 3) IDE와 도구들이 node_modules를 기대한다

대부분의 IDE, Linter, Formatter, TypeScript 서버는

> node_modules 디렉터리가 존재한다고 가정
> 

한다. 그래서 Yarn은 이를 해결하기 위한 장치를 제공한다.

## 6-3. Yarn SDK (PnP-aware 실행 파일)

Yarn은 PnP 환경에서 IDE가 동작하도록 **SDK 생성 기능**을 제공한다.

```
.yarn/sdks/
 ├─ typescript/bin/tsserver
 ├─ eslint/
 └─ prettier/
```

이 파일들은

> ZipFS와 .pnp.cjs를 이해하는 PnP 전용 래퍼(wrapper)
> 

이다.

IDE는 이 실행 파일을 통해 TypeScript, ESLint 등을 사용하게 된다.

## 6-4. Unplug 기능

일부 패키지는 런타임에 파일 시스템 접근을 시도한다.

- 파일 경로 직접 읽기
- 바이너리 실행
- 동적 require

이런 패키지는 ZipFS에서 제대로 동작하지 않는다.

그래서 Yarn은 해당 패키지를 실제 디스크로 꺼내는 기능을 제공한다.

이를 **unplug**라고 한다.

```
.yarn/unplugged
```

여기에서 어떤 패키지가 unplug 되었는지 확인할 수 있다.


## 6-5. Zero Install

Yarn Berry는 `.yarn/cache`를 레포에 포함시키는 운영이 가능하다.

이 경우

> clone만 해도 yarn install 없이 바로 실행 가능
> 

이 상태를 **Zero Install**이라고 한다.

또한 Yarn은 어떤 패키지가 추가/수정/제거되었는지 명확히 추적할 수 있어, 캐시와 락파일의 일관성을 유지하기 쉽다.


## 6-6. Yarn Berry 플러그인: `@yarnpkg/plugin-nolyfill`

이 플러그인의 의미는 다음과 같다.

> Yarn은 모듈 해석만 담당하고,
> 
> 
> Node의 API는 그대로 Node가 사용하도록 한다.
> 

즉, Yarn이 Node 런타임까지 간섭하지 않도록 하는 플러그인이다.

## 7. React Native가 PnP와 충돌하는 이유

React Native는 다음을 전제로 한다.

> node_modules가 실제 디렉터리로 존재해야 함
그래서 **`node_modules`를 만들지 않는 Yarn Berry(PnP)** 와는 **근본적으로 안 맞는다**.
> 

빌드 파이프라인에서 Metro, Xcode, Gradle 등이 node_modules 경로를 직접 참조하거나 순회한다.

### RN 빌드 파이프라인

```
JS (Metro)
 ↓
iOS (Xcode, CocoaPods)
 ↓
Android (Gradle, CMake, NDK)
```

Metro Bundler가 `node_modules`를 직접 순회함

Metro는 `.pnp.cjs`를 **이해하지 못함** → “파일이 없다”고 판단

그리고 Native 빌드가 `node_modules` 경로를 하드코딩함

`require_relative '../node_modules/react-native/scripts/react_native_pods'`

**Berry + node_modules 모드로 간다면**

- Berry의 Plug’n’Play ❌
- Zero-install ❌
- Dependency constraints 일부 ❌

멀티 플랫폼 빌드 시스템이라 그렇다.

## 8. nodeLinker 옵션

Node가 의존성을 어떤 방식으로 보게 할지 결정하는 옵션

| 옵션 | 설명 |
| --- | --- |
| pnp | .pnp.cjs 사용 |
| node-modules | 전통적인 방식 |

보통 `.yarnrc.yml`에서 `nodeLinker` 값을 설정한다.

Node.js는 원래 이렇게만 이해함

```
node_modules/ 디렉터리 탐색
```

근데 Yarn Berry는

- PnP
- Zero Install
- ZipFS

같은 **새로운 연결 방식**을 만들었고

→ Node에게 “의존성을 이렇게 보게 해줘”라고 알려줘야 했음.

그 역할을 하는 게 **nodeLinker**.

## pnpm — 파일 시스템 레벨에서 npm을 다시 설계한 패키지 매니저

패키지 설치 시 독창적인 방식이 큰 특징임. - “패키지 파일은 디스크에 단 한 번만 존재한다.”

이를 가능하게 하는 핵심 기술이

- 글로벌 스토어
- 하드링크 / 심볼릭 링크
- Copy-On-Write(COW)
- 비평탄화된 node_modules 구조

## 1. pnpm은 글로벌 스토어와 하드링크를 사용한다

패키지를 프로젝트마다 복사하지 않는다.

```
~/.pnpm-store   ← 실제 파일 단 1번
project/node_modules/.pnpm
project/node_modules/react → symlink
```

스토어의 파일을 프로젝트에 **하드링크**로 연결한다.
스토어는 보통 content-addressable 구조로 관리되어, 동일한 파일은 해시 기준으로 한 번만 저장된다.

## 2. 하드 링크와 심볼릭 링크의 차이

### 파일 시스템 관점의 핵심: inode

유닉스 계열 파일 시스템에서

- 파일 = inode + 데이터
- 파일명 = inode를 가리키는 엔트리

→ 파일 종류, 파일 크기, 소유자, 권한 (rwx), 생성/수정/접근 시간, 디스크 블록 위치, 링크 수 등의 정보

### 하드 링크 (Hard Link)

```
fileA ─┐
       ├─ inode#123 ── 실제 데이터
fileB ─┘
```

- 완전히 동일한 파일
- inode 번호 동일
- 원본/복사본 개념 없음

```bash
ln fileA fileB
```

### 심볼릭 링크 (Symbolic Link)

```
link ──→"fileA" (경로 문자열)
fileA ─→ inode#123
```

- 경로만 참조하는 “바로가기”

**pnpm은 글로벌 스토어와 하드링크를 사용한다.**

하드링크 - 파일 시스템의 기능으로 동일한 데이터를 가리키는 여러 개의 파일 경로를 만드는 방식이다.

파일을 복사하거나 상위 폴더를 계속 뒤져가면서 `node_modules`를 찾는 대신, 하드링크를 사용해 빠르게 원하는 패키지를 찾을 수 있다.

**하드 링크와 심볼릭 링크의 차이**

- **하드 링크**: *“같은 파일에 붙은 또 다른 이름”*
- **심볼릭 링크(symlink)**: *“다른 파일을 가리키는 바로가기”*

## 3. pnpm의 node_modules 구조

pnpm은 일부러 `node_modules`를 깊게 만든다. (비평탄화)

```
node_modules/
  .pnpm/
    A@1.0.0/node_modules/lodash@3
    B@1.0.0/node_modules/lodash@4
```

이 구조 덕분에

- 의존성 격리
- 버전 충돌 방지
- 유령 의존성(ghost dependency) 원천 차단

이 가능해진다.

npm/yarn(hoist) 구조의 근본 문제를 해결한다.

## 4. Copy-On-Write (COW) — pnpm의 안전장치

처음에는 스토어와 프로젝트가 **같은 inode**를 공유한다.

```
store/react/index.js
project/node_modules/react/index.js

```

동일 inode.

어떤 도구가 이 파일을 수정하려고 하면?

> 그 순간에만 복사하여 분리
> 

```
project = 새로운 inode
store = 원본 유지

```

그래서

- 평소에는 디스크 1개만 사용
- 수정 발생 시에만 복사

이것이 Copy-On-Write.

Node 생태계에는 다음과 같이 패키지를 수정하는 도구들이 많기 때문에 이 장치가 매우 중요하다.

- postinstall 스크립트
- patch-package
- babel / vite / next 내부 캐싱

## 5. 왜 macOS / Linux와 궁합이 좋은가

reflink(COW)를 파일 시스템이 지원하기 때문.

Windows는 이 부분이 제한적이다.

## 6. 서버리스 / bundleDependencies에서 pnpm 최적화가 사라지는 이유

pnpm의 최적화는

> 스토어 ↔ 프로젝트가 링크로 연결될 때만 의미가 있다.
> 

하지만 서버리스 배포나 번들링은 최종 산출물이

```
zip / tar / 단일 패키지
```

가 되면서

- 하드링크 → 복사본
- symlink → 깨짐
- COW → 의미 없음

즉, pnpm의 “공유 구조”가 전부 사라진다.

## 7. pnpm vs Yarn PnP의 구조적 차이

| 항목 | pnpm | Yarn PnP |
| --- | --- | --- |
| node_modules | 존재 | 없음 |
| 링크 사용 | 하드링크 + symlink | 사용 안 함 |
| 모듈 해석 | Node 기본 방식 | `.pnp.cjs` |
| 디스크 절약 | 파일 시스템 레벨 | 가상 파일 시스템 |
| 의존성 격리 | 깊은 구조로 해결 | 매핑 테이블로 해결 |

---

## 8. pnpm의 node-linker (링커)

링커는 스토어의 패키지를 `node_modules`에 **어떤 전략으로 배치할지** 결정한다.

| 링커 | 설정 | 특징 |
| --- | --- | --- |
| isolated (기본) | `node-linker=isolated` | pnpm 고유 구조, 격리 강함 |
| hoisted | `node-linker=hoisted` | npm/yarn과 유사, 호환성 우선 |
| pnp | `node-linker=pnp` | Yarn Berry와 유사, node_modules 없음 |

# 워크스페이스와 모노레포

## 모노레포 vs 워크스페이스

| 개념 | 설명 |
| --- | --- |
| 모노레포 | 여러 패키지를 하나의 Git 저장소에 |
| 워크스페이스 | 패키지 매니저가 이를 하나처럼 설치/링크/관리 |

---

## npm Workspaces

- 내부 패키지를 로컬 symlink로 연결
- 외부 의존성은 hoisted 방식

루트 설정:

```json
{
"private":true,
"workspaces":["packages/*","apps/*"]
}

```


## Yarn Workspaces

- 한 번의 설치로 전체 패키지 관리
- 내부 패키지 즉시 연결
- 의존성 그래프 엄격 관리
- `yarn workspaces foreach`로 일괄 실행

## 시멘틱 버전 범위

| 기호 | 예시 | 허용 범위 | 의미 |
| --- | --- | --- | --- |
| ^ | ^1.4.2 | <2.0.0 | Major 전까지 |
| ~ | ~1.4.2 | <1.5.0 | Minor 전까지 |
| * | * | 제한 없음 | 최신 |

---

## `workspace:` 프로토콜의 의미

```json
"utils":"workspace:*"

```

이 설정은 npm 레지스트리가 아니라, 현재 레포 안의 패키지만 사용하도록 강제한다.