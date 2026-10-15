# Moving Pet

Windows 화면 위를 자유롭게 돌아다니는 Desktop Pet 애플리케이션의 Electron + TypeScript 프로토타입입니다.

현재 버전은 캐릭터의 표시·이동·상호작용과 최소 육성 상태를 검증하는 프로토타입입니다. 아이템과 성장 같은 게임 기능은 아직 구현하지 않았습니다.

## 현재 기능

- 투명하고 테두리 없는 always-on-top 창
- 펫이 없는 투명 영역의 click-through
- 화면 하단에서 움직이는 CSS placeholder 캐릭터
- `idle` / `walk` / `sleep` 상태 전환
- 화면 좌우 이동과 경계에서의 방향 전환
- 이동 방향에 따른 캐릭터 좌우 반전
- 클릭 시 짧은 반응 애니메이션
- 드래그를 통한 화면 안 위치 변경
- 배고픔과 에너지 상태 변화
- 에너지가 낮을 때 잠들고 회복 후 깨어나는 행동
- 클릭 시 상태 말풍선 표시
- 먹이주기와 놀아주기
- 쓰다듬기·먹이·놀이에 따른 친밀도 변화
- 위치와 상태의 로컬 저장 및 재시작 복원
- 시스템 트레이와 종료 메뉴

## 요구 환경

- Windows 10 또는 11
- Node.js 22.12 이상
- npm

## 시작하기

```powershell
npm ci
npm start
```

처음 실행하면 Electron 런타임을 준비할 수 있습니다. 앱은 일반 창이나 작업 표시줄 항목을 만들지 않습니다. 종료하려면 Windows 알림 영역의 `Moving Pet` 아이콘을 우클릭한 뒤 **종료**를 선택합니다.

## 개발 명령

| 명령 | 설명 |
| --- | --- |
| `npm run build` | TypeScript 컴파일 및 renderer 정적 파일 복사 |
| `npm start` | 빌드 후 Electron 앱 실행 |
| `npm test` | 행동 시스템 단위 테스트 실행 |
| `npm run check` | 빌드와 전체 테스트 실행 |

## 구조

```text
src/
├─ main/          Electron 창, 트레이, OS 기능
│  └─ save/       JSON 로컬 저장과 데이터 검증
├─ preload/       제한된 IPC 브리지
├─ renderer/      화면 표시와 브라우저 측 동작
│  ├─ behavior/   idle/walk 상태와 이동 규칙
│  ├─ interaction/입력과 click-through 제어
│  ├─ pet/        펫 DOM 렌더링
│  └─ state/      배고픔·에너지 변화와 돌봄 규칙
└─ shared/        프로세스가 공유하는 최소 타입
```

`Pet Renderer`, `Pet State`, `Behavior System`, `Interaction System`, `Save System`은 현재 분리되어 있습니다. Inventory System은 실제 기능 요구가 확정될 때 추가합니다.

## 테스트

```powershell
npm run check
```

자동 테스트 12개는 행동 전환, 상태 변화, 돌봄 규칙, 저장 마이그레이션과 JSON 저장·복원을 검증합니다. GUI 특성상 다음 항목은 Windows에서 수동 확인이 필요합니다.

1. 펫이 없는 영역을 클릭했을 때 뒤의 앱이 입력을 받는지
2. 펫을 클릭했을 때 `pet!` 반응과 배고픔·에너지·친밀도 말풍선이 표시되는지
3. `먹이주기`와 `놀아주기` 버튼이 수치와 반응을 변경하는지
4. 펫을 드래그한 뒤 놓으면 새 위치에서 행동을 이어가는지
5. 종료 후 재실행했을 때 위치와 상태가 복원되는지
6. 에너지가 낮으면 잠들고 회복 후 깨어나는지
7. 트레이의 **종료** 메뉴가 앱을 종료하는지

## 범위 밖 항목

- 실제 캐릭터 이미지 및 스프라이트
- 성장, 레벨, 인벤토리, 꾸미기 아이템
- 다중 모니터 지원
- 설치 프로그램, 자동 업데이트, 코드 서명

프로토타입 릴리즈 문서는 [release/v0.4.0](./release/v0.4.0/README.md)에서 확인할 수 있습니다.
