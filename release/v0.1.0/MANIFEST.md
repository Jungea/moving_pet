# Source Release Manifest

## Project configuration

- `package.json`: 의존성 및 npm 스크립트
- `package-lock.json`: 고정된 의존성 잠금 파일
- `tsconfig.base.json`: 공통 TypeScript 옵션
- `tsconfig.main.json`: main/preload 빌드 설정
- `tsconfig.renderer.json`: renderer 빌드 설정
- `tsconfig.test.json`: 테스트 빌드 설정

## Application source

- `src/main/main.ts`: 창과 트레이
- `src/preload/preload.ts`: IPC 브리지
- `src/shared/pet-state.ts`: 펫 상태 타입
- `src/renderer/main.ts`: renderer 진입점과 애니메이션 루프
- `src/renderer/pet/pet-renderer.ts`: 펫 렌더링
- `src/renderer/behavior/basic-behavior-system.ts`: 행동 및 이동
- `src/renderer/interaction/interaction-system.ts`: 펫 영역 입력 처리
- `src/renderer/index.html`: renderer 문서
- `src/renderer/styles.css`: placeholder 및 상태 애니메이션

## Build and test

- `scripts/clean.mjs`: 빌드 출력 정리
- `scripts/clean-test.mjs`: 테스트 출력 정리
- `scripts/copy-assets.mjs`: 정적 renderer 파일 복사
- `tests/basic-behavior-system.test.ts`: 행동 시스템 테스트

## Generated directories

- `dist`: `npm run build` 실행 시 생성
- `dist-test`: `npm test` 실행 시 생성
- `node_modules`: `npm ci` 실행 시 생성

생성 디렉터리는 소스 릴리즈에 포함하거나 버전 관리하지 않습니다.
