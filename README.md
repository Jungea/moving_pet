# Moving Pet

Windows 화면 위를 자유롭게 돌아다니는 Desktop Pet 애플리케이션의 Electron + TypeScript 프로토타입입니다.

현재 버전은 캐릭터의 표시·이동·기본 행동을 검증하는 1차 단계입니다. 육성, 저장, 아이템 같은 게임 기능은 아직 구현하지 않았습니다.

## 현재 기능

- 투명하고 테두리 없는 always-on-top 창
- 펫이 없는 투명 영역의 click-through
- 화면 하단에서 움직이는 CSS placeholder 캐릭터
- `idle` / `walk` 상태 전환
- 화면 좌우 이동과 경계에서의 방향 전환
- 이동 방향에 따른 캐릭터 좌우 반전
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
├─ preload/       제한된 IPC 브리지
├─ renderer/      화면 표시와 브라우저 측 동작
│  ├─ behavior/   idle/walk 상태와 이동 규칙
│  ├─ interaction/입력과 click-through 제어
│  └─ pet/        펫 DOM 렌더링
└─ shared/        프로세스가 공유하는 최소 타입
```

`Pet Renderer`, `Pet State`, `Behavior System`, `Interaction System`은 현재 분리되어 있습니다. Save System과 Inventory System은 실제 기능 요구가 확정될 때 추가합니다.

## 테스트

```powershell
npm run check
```

자동 테스트는 행동 전환과 화면 경계 방향 반전을 검증합니다. GUI 특성상 다음 항목은 Windows에서 수동 확인이 필요합니다.

1. 펫이 없는 영역을 클릭했을 때 뒤의 앱이 입력을 받는지
2. 펫 위에 포인터를 올렸을 때 입력이 차단되는지
3. 트레이의 **종료** 메뉴가 앱을 종료하는지

## 범위 밖 항목

- 실제 캐릭터 이미지 및 스프라이트
- 클릭·드래그에 따른 게임 상호작용
- 먹이주기, 놀이, 능력치, 성장, 아이템
- 로컬 저장
- 다중 모니터 지원
- 설치 프로그램, 자동 업데이트, 코드 서명

프로토타입 릴리즈 문서는 [release/v0.1.0](./release/v0.1.0/README.md)에서 확인할 수 있습니다.
