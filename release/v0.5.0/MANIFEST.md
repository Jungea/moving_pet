# Source Release Manifest — v0.5.0

## Added

- `src/renderer/state/pet-growth-system.ts`: 레벨과 경험치 계산
- `tests/pet-growth-system.test.ts`: 단일·다중 레벨업 테스트
- `release/v0.5.0/README.md`: 실행 및 성장 규칙
- `release/v0.5.0/RELEASE_NOTES.md`: 릴리즈 변경 사항
- `release/v0.5.0/MANIFEST.md`: 이 목록

## Changed

- `src/shared/pet-state.ts`: 레벨, 경험치, 성장 상수, 저장 포맷 v3
- `src/main/save/pet-save-system.ts`: 성장 상태 검증과 v1/v2 마이그레이션
- `src/renderer/state/pet-care-system.ts`: 돌봄 경험치 보상
- `src/renderer/main.ts`: 성장 결과 및 레벨업 반응 연결
- `src/renderer/pet/pet-renderer.ts`: 레벨과 경험치 진행 렌더링
- `src/renderer/index.html`, `styles.css`: 성장 UI
- 관련 상태 및 저장 테스트
- `README.md`, `AGENTS.md`: v0.5.0 범위
- `package.json`, `package-lock.json`: 버전 0.5.0
