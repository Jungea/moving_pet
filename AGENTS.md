# Codex 작업 안내

## 프로젝트 목적

이 저장소는 Windows 우선 Electron Desktop Pet 프로토타입입니다. 현재 목표는 투명한 화면 오버레이 위에 펫을 표시하고 행동, 이동, click-through, 클릭·드래그 상호작용, 배고픔·에너지·친밀도, 먹이·놀이, 경험치·레벨, 로컬 저장, 시스템 트레이 종료를 제공하는 것입니다.

현재 범위를 임의로 확장하지 마세요. 육성 게임 요소, 저장, 인벤토리, 실제 아트, 패키징은 별도 요청이 있을 때만 구현합니다.

## 기술 기준

- Electron 44, TypeScript, HTML/CSS만 사용합니다.
- 새 의존성은 먼저 필요성을 확인하고 최소화합니다.
- Renderer에는 Node.js API를 직접 노출하지 않습니다.
- Renderer와 main 사이의 새 기능은 preload의 좁은 IPC API로 추가합니다.
- Windows 동작을 우선하며, 플랫폼별 분기가 필요하면 이유를 주석 또는 문서에 남깁니다.

## 책임 경계

| 위치 | 책임 |
| --- | --- |
| `src/main` | BrowserWindow, tray, display, 저장, IPC 수신 등 OS/Electron 기능 |
| `src/preload` | renderer에 노출하는 최소 IPC 인터페이스 |
| `src/renderer/pet` | 펫 DOM과 화면 표현 |
| `src/renderer/behavior` | 상태 전환, 시간, 이동 규칙 |
| `src/renderer/interaction` | 포인터 판정, click-through, 클릭과 드래그 |
| `src/renderer/state` | 필요 상태, 먹이·놀이 돌봄 규칙, 성장 계산 |
| `src/shared` | 프로세스 간 공유 가능한 타입 |

후속 시스템은 다음 위치에 추가합니다.

- Pet State 확장: `src/shared/pet-state.ts`
- Save System: `src/main/save`와 preload의 `loadState` / `saveState` API
- Inventory System: `src/shared` 타입과 renderer UI

구체 요구가 없으면 빈 폴더, 미사용 인터페이스, 더미 저장소를 미리 만들지 않습니다.

## 구현 규칙

- 이동·행동 규칙은 renderer DOM 코드가 아니라 `behavior` 모듈에 둡니다.
- 렌더링은 `pet` 모듈에서 수행하고, 상태 결정과 분리합니다.
- 투명 영역은 계속 click-through 상태여야 합니다. 새 UI를 더할 때는 상호작용 영역만 입력을 받게 하세요.
- 저장 데이터는 main 프로세스에서 검증하며 renderer가 파일 시스템에 직접 접근하지 않게 합니다.
- `BrowserWindow` 보안 옵션인 `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`를 유지합니다.
- `dist`, `dist-test`, `node_modules`는 생성물입니다. 직접 수정하거나 버전 관리하지 않습니다.

## 검증

소스 수정 후 아래 명령을 실행합니다.

```powershell
npm run check
```

GUI 또는 Electron main 프로세스를 변경했다면, 가능하면 `npm start`로 시작 오류를 확인합니다. UI를 변경한 경우에는 Windows에서 click-through, 이동 방향, 트레이 종료를 수동 확인합니다.

## 릴리즈 문서

현재 소스 릴리즈 문서는 `release/v0.5.0`에 있습니다. 사용자에게 보이는 기능, 실행 조건, 제한사항이 변경되면 아래 파일을 함께 갱신합니다.

- `release/v0.5.0/README.md`
- `release/v0.5.0/RELEASE_NOTES.md`
- `release/v0.5.0/MANIFEST.md`
