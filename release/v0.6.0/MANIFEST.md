# Source Release Manifest — v0.6.0

## Added

- `src/shared/desktop-layout.ts`: main/renderer 간 선택 모니터 작업 영역 타입
- `src/renderer/behavior/pet-position.ts`: 작업 영역 보정 계산
- `release/v0.6.0/`: 이 릴리즈의 실행 안내와 변경 기록

## Changed

- `src/main/main.ts`: PNG 트레이 아이콘, 모니터 선택 메뉴, 선택 디스플레이 창과 화면 구성 변경 알림
- `src/preload/preload.ts`, `src/renderer/global.d.ts`: 제한된 화면 레이아웃 IPC API
- `src/renderer/main.ts`: 레이아웃 기반 이동·드래그 보정
- `src/renderer/behavior/basic-behavior-system.ts`: 네 방향 걷기와 경계 방향 전환
- `src/shared/pet-state.ts`, `src/main/save/pet-save-system.ts`: 상·하 이동 방향 지원
- `src/renderer/styles.css`: 1/4 크기 펫과 상태 패널 위치
- `tests/basic-behavior-system.test.ts`: 네 방향·작업 영역 보정 테스트
- `README.md`, `AGENTS.md`, `package.json`, `package-lock.json`: v0.6.0 문서와 버전
