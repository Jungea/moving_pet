# Source Release Manifest — v0.4.0

## Added

- `src/renderer/state/pet-care-system.ts`: 먹이, 놀이, 쓰다듬기 규칙
- `tests/pet-care-system.test.ts`: 돌봄 규칙 테스트
- `release/v0.4.0/README.md`: 실행 및 수동 검증
- `release/v0.4.0/RELEASE_NOTES.md`: 릴리즈 변경 사항
- `release/v0.4.0/MANIFEST.md`: 이 목록

## Changed

- `src/shared/pet-state.ts`: 친밀도와 저장 포맷 v2
- `src/main/save/pet-save-system.ts`: v1 읽기 및 v2 마이그레이션
- `src/renderer/main.ts`: 돌봄 액션 연결 및 즉시 저장
- `src/renderer/interaction/interaction-system.ts`: 상태 패널 상호작용 영역
- `src/renderer/pet/pet-renderer.ts`: 친밀도 및 반응 렌더링
- `src/renderer/index.html`, `styles.css`: 돌봄 버튼과 친밀도 UI
- `tests/pet-save-system.test.ts`: 저장 마이그레이션 검증
- `README.md`, `AGENTS.md`: v0.4.0 범위
- `package.json`, `package-lock.json`: 버전 0.4.0
