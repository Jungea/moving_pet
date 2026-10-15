# Source Release Manifest — v0.2.0

## Changed application files

- `src/shared/pet-state.ts`: `sleep`, mood, `x/y` 위치 상태
- `src/renderer/behavior/basic-behavior-system.ts`: 세 행동 순환 및 타이머 초기화
- `src/renderer/interaction/interaction-system.ts`: 클릭과 드래그 처리
- `src/renderer/pet/pet-renderer.ts`: 위치·기분 렌더링
- `src/renderer/main.ts`: 상호작용과 행동 루프 조정
- `src/renderer/styles.css`: 수면과 클릭 반응 시각 효과
- `tests/basic-behavior-system.test.ts`: sleep 행동 테스트

## Documentation

- `README.md`: v0.2.0 기능과 수동 테스트 반영
- `AGENTS.md`: 현재 기능 범위와 릴리즈 문서 위치 반영
- `release/v0.2.0/README.md`: 실행 및 사용자 검증 안내
- `release/v0.2.0/RELEASE_NOTES.md`: 변경 사항
- `release/v0.2.0/MANIFEST.md`: 이 목록

## Generated directories

- `node_modules`: `npm ci`로 생성
- `dist`: `npm run build`로 생성
- `dist-test`: `npm test`로 생성

생성 디렉터리는 릴리즈 소스에 포함하거나 버전 관리하지 않습니다.
