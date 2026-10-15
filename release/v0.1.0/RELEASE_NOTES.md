# Release Notes — v0.1.0

릴리즈 날짜: 2026-10-15

## Added

- Electron main, preload, renderer 프로세스 분리
- 투명하고 테두리 없는 always-on-top 창
- 작업 표시줄을 제외한 기본 화면 작업 영역 사용
- 투명 영역의 마우스 이벤트를 아래 Windows 앱으로 전달
- 펫 영역 진입 시에만 마우스 입력 활성화
- CSS로 만든 임시 동물 캐릭터
- idle / walk 행동 상태와 시간 기반 전환
- 프레임 시간 기반 좌우 이동
- 화면 경계 충돌 및 진행 방향 반전
- 방향에 따른 캐릭터 좌우 반전
- idle 깜빡임 및 walk 움직임 애니메이션
- 시스템 트레이 아이콘, 툴팁, 종료 메뉴
- Node 내장 테스트 러너를 이용한 행동 로직 테스트

## Architecture

- `src/main`: Electron 창과 시스템 트레이 관리
- `src/preload`: 안전한 renderer-to-main IPC 브리지
- `src/renderer/pet`: 펫 표시 책임
- `src/renderer/behavior`: 상태 전환과 이동 책임
- `src/renderer/interaction`: 입력 및 click-through 책임
- `src/shared`: 프로세스 간 공유 가능한 최소 상태 타입

후속 Save, Inventory, 성장 시스템은 실제 요구가 생길 때 별도 모듈로 추가할 수 있습니다.

## Security

- Renderer의 Node.js integration 비활성화
- Context isolation 활성화
- Renderer sandbox 활성화
- Preload를 통해 필요한 입력 제어 기능만 노출

## Deferred

다음 항목은 이번 릴리즈 범위에 포함하지 않았습니다.

- 클릭 및 드래그 상호작용 동작
- 먹이주기와 놀아주기
- 친밀도, 배고픔, 에너지
- 성장 및 레벨
- 아이템 및 꾸미기
- 랜덤 이벤트
- 로컬 저장
- 실행 파일 패키징 및 설치 프로그램
