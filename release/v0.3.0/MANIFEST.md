# Source Release Manifest — v0.3.0

## Added

- `src/main/save/pet-save-system.ts`: JSON 저장, 로드, 데이터 검증
- `src/renderer/state/pet-needs-system.ts`: 배고픔과 에너지 변화
- `tests/pet-needs-system.test.ts`: 상태 변화 테스트
- `tests/pet-save-system.test.ts`: 저장 검증과 복원 테스트
- `scripts/run-tests.mjs`: 테스트 파일 자동 검색 및 실행

## Changed

- `src/shared/pet-state.ts`: 배고픔, 에너지, 저장 형식
- `src/main/main.ts`: 저장 IPC
- `src/preload/preload.ts`: 안전한 저장 브리지
- `src/renderer/global.d.ts`: 브리지 타입
- `src/renderer/main.ts`: 복원, 자동 저장, 상태 시스템 연결
- `src/renderer/behavior/basic-behavior-system.ts`: 에너지 기반 수면
- `src/renderer/interaction/interaction-system.ts`: 드래그 임계값
- `src/renderer/pet/pet-renderer.ts`: 상태 말풍선 렌더링
- `src/renderer/index.html`, `styles.css`: 상태 말풍선 UI
- `package.json`, `package-lock.json`: v0.3.0
- `README.md`, `AGENTS.md`: 현재 기능과 구조
