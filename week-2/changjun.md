# 2.1 package.json 톺아보기

---

- 모든 자바스크립트 프로젝트의 중심에 잇는 중요한 파일
- 프로젝트의 설정, 의존성 관리, 실행 스크립트 등을 정의하는 역할

## 2.1.1 package.json

- 프로젝트의 메타데이터를 저으이
- 패키지 시행과 개발에 필요한 의존성 나열
- 실행 가능한 스크립트를 설정하는 역할

## 2.1.2 주요필드

### name

- 프로젝트의 이름을 선언하는 필드 → 반드시 있어야하는건 아님
- npm 레지스트리에 업로드하거나 내부적으로 해당 프로젝트를 다른 곳에서 참조할 목적이 없다면 업성도 됨
- 빌드한 파일만 특정 서버에 업로드해서 사용하기 때문에 name은 중요하지 않음
- but 다른 개발자가 사용할수 있게 만들 목적이라면 다름
- 이름은 214자 이하 @babel/\_cli, @babel/.cli 같은 네이밍 가능
- nodejs의 코어모듈과 이름 같아선 안됨

### scope

- @scope/packagename 과 같은 구조를 띤다
- 대표적으로 react-query의 @tanstack/\* 이나 @babel 같은 도구
- @abc 스코프를 사용하기로 마음먹고 한번 업로드 했으면 자신과 조직만 사용할 수 있음

### version

- 하나의 name에는 동일한 version이 존재할 수 없다.

### description

- 패키지에 대한 설명을 넣는 필드
- npm info <패키지명>으로 설명 확인

### keywords

- 패키지를 설명할 간단한 키워드를 넣는것

### homepage

- 패키지 홈페이지 URL

### bugs

- 패키지에 버그가 있을 경우 제보할 수 있는 url이나 email주소

### license

- 패키지에대한 라이센스를 지정하는 필드

### author와 contributors

- auther의 경우 한명, contributors에는 여러명

### funding

- 패키지 개발에 직접적인 자금을 지원하는 방법에 대해 알려주는 필드

### files

- 패키지를 업로드하는 경우에 사용되는 매우 중요한 필드
- 이 files필드를 잘 활용하면 패키지를 의존성으로 설치하는 경우 꼭 필요한 파일만 선택적으로 배포, 불필요한 파일이나 디렉터리를 제외할 수 있어 패키지 크기를 줄이는데에 도움이 된다

### repository

### script

- 특정 명령어 앞에 지정한 키=값은 유닉스 계열의 운영체제에서만 사용할 수 있는 기능
- 운영체제에 관계없이 일정한 키를 주입하고 싶다면 dotenv나 cross-env와 같은 도구를 사용

### config

- 패키지에 scripts를 실행할 때 사용하는 다양한 설정값을 객체형태로 모아 작성 가능

```jsx
{
...
"config":{
	"something":1
	}
}
//
console.log(process.env.npm_package_config_something)
```

이렇게 하고 node index.js를 실행하면 `1` 이 나옴

### dependencies

### overrides

type

- 자바스크립트 생태계에서 지원하는 대표적인 모듈 시스템인 CommonJS와 ESModule중 Nodejs가 어떤 모듈 형식을 사용할지 알리는 필드
- type에 들어갈 수 있는 값은 module, commonjs다 . → 선언하지 않으면 기본값은 commonjs이다.
- .js 확장자를 가진 파일의 가까운 상위 package.json에 type이 module로 되어있으면 ESModule로 로드됨

### imports

- imports는 해당 패키지 내부에서만 쓸 수 있는 구문, tsconfig의 경로 별칭을 지정할 수 있다.
- compilerOptions.paths와 동일하게 특정 불러오기에 대해 별칭을 지정할 수 있음

## 2.1.3 package.json 생성하기

- npm init으로 생성하기
- pacakge.json에 주석을 추가하는법
- 예약어를 사용하는 방법 → @접두사와 \_comment 접미사를 붙임

## 2.1.4 npm config와 .npmrc 살펴보기

## 2.1.5

# 2.2 dependencies란 무엇일까?

---

- dependencides는 런타임에서 필요한 패키지 관리
- devDependencies는 개발중에 필요한 패키지 관리 (테스트 프레임워크나, 빌드도구)
- peerDependencies
  - require를 하지 않는데 특정 패키지가 필요한 경우
  - 근데 지정된 패키지가 설치되지 않은 경우 에러를 반환
- peerDependenciesMeta
  - 선택적인 호스트 패키지를 선언할 때 유용

# 2.3 npm의 주요 명령어

---

- eslint를 실행하기 위해서는 “lint”: eslint .”과 같은 스크립트를 추가해서 사용하곤 한다.
- 근데 num run lint는 eslint . 을 실행하는 단축어에 불과하기 때문에 왠지 bash에서 직접 eslint . 을 바로 실행해도 동일하게 eslint를 실행할 수 있을 것 같은 생각이 듬
- 그러나 실제로 실행하면 command not found: eslit 라는 에러가 뜬다.
- 그 이유는 npm run 명령이 실행을 위해 보이지 않는 작업을 처리하기 때문
  - node_moudules에 PATH가 추가된다. 따라서 실제로 npm run lint 명령어는 다음과 같이 실행됨
  - lint: “node_modules/.bin/eslint . “

### npm install vs npm ci

- npm install은 package-lock.json 존재 유무와 상관없이 모두 실행할 수 있음.
- package-lock.json이 없는 경우에는 pakcage.json 버전에 맞춰 설치한 다음 이 내용을 담은 package-lock.json을 새롭게 생성
- 반대로 lock 파일이 있으면 이 내용에 따라 설치 → 다음과 같은 경우에만 lock.json을 수정
  - package-lock.json에 없는 패키지를 설치할때
  - package-lock.json의 package.json 내용과 맞지 않는 경우
- 반면 npm ci는 package-lock.json이 있는경우에만 실행 가능
  - package-lock.json 내용 그대로 의존성 설치
  - 그래서 ci환경에서 주로 사용됨

### npm update

npm update → package-lock.json 업데이트 ,

실제 버전을 적용하려면 npm update —save로 실행

### npm dedupe

- 현재 패키지 트리 기반으로 의존성을 단순화 하는 명령어

### npm ls

의존성 트리 보기

### npm explain

npm ls와 비슷해보이지만 이건 패키지명을 지정해야함.

npm expalin은 대상 의존성이 정확히 왜 설치됐는지에 대한 정보까지 나옴

이외에도 npm publish, deprecate, outdated, view 등 다양한 명령어가 있음

# 2.4 npm install을 실행하면 벌어지는 일

### 1. 의존성 트리 분석의 핵심 @npmcli/arborist

loadActure → node_modules 내부 트리를 확인하는 메서드 → 디렉터리 내 모든 패키지를 검색 → 이 과정에서 전체 의존성 트리 구성

### loadActual

### ArboristNode

- 프로젝트의 의존성 트리 내 각 노드를 나타내는 개체, 이 객체는 ArborsitNode 클래스 인스턴스로 노드와 관련 중요한 정보를 담고 있음

### loadVirtual

가상 트리를 만드는 메서드 , loadActual이 직접 스캔해서 트리를 구축하는것과 달리 loadVirtual은 package-lock.json이나 npm-shrinkwap.json을 기반으로 의존성 트리 생성 → 반드시 락 파일 필요

### buildldealTree

### reify

### audit

## 2. 패키지 설치를 위한 패키지, pacote

- pacote는 npm 패키지의 다운로드와 관리를 수행하는 라이브러리, @npmcli/arborist가 의존성 트리 분석한 후 이 라이브러리를 통해 실제 패키지를 설치하게 된다.

## 3. node_modules 살펴보기

- 실제 npm install 이후에 생성되는 node_modules 내에서는 무슨 일이 벌어질까?

### 평탄화된 node_modules

- 모든 내부의 폴더를 평탄화 해서 같은 레벨의 폴더에 일괄적으로 설치

### npm이 중복 설치를 피하는 법

- pacakge.json 의존성 해결이 유의적 버전의 문법 규칙 안에서 해결 가능할 때만 이뤄진다.
- 유의적 버전 문법 내에서 npm은 어떻게 중복설치를 피할까?

# 2.5 node_modules는 무엇일까?

## node_modules의 역할

- 의존성 관리: 필요한 패키지들을 설치해서 관리
- 경로해결: Node.js 애플리케이션에서 require() 함수나 import 문으로 모듈을 가져올 때 node_modules 폴더는 해당 모듈을 검색하는 주요 경로가 된다.
- 네임스페이스 관리: 의존성 트리 내에 여러 패키지가 동일한 이름의 모듈을 필요로하는 경우가 많다. node_modules는 이러한 중복 모듈이 서로 영향을 미치지 않도록 각 패키지가 독립적으로 사용될 수 있게 네임스페이스를 관리한다.

## node_modules의 구조

### .bin

### 서브 패키지 node_modules의 폴더

### .cache

- 성능 향상을 위한 캐시데이터를 저장하는 장소로 사용

## 심볼릭 링크
