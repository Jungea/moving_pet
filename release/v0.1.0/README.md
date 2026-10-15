# Moving Pet v0.1.0

Windows용 Desktop Pet의 1차 프로토타입 릴리즈입니다.

이 릴리즈는 개발 및 기능 검증을 위한 **소스 기반 프로토타입**입니다. Windows 설치 파일이나 배포용 실행 파일은 아직 포함하지 않습니다.

## 주요 기능

- Electron + TypeScript 프로젝트 구성
- frameless 및 transparent 데스크톱 창
- always-on-top 표시
- 펫이 없는 투명 영역 click-through
- 화면 하단 CSS placeholder 캐릭터
- 화면 좌우 이동 및 경계 반전
- idle / walk 상태 전환
- 이동 방향에 따른 캐릭터 좌우 반전
- 기본 시스템 트레이
- 트레이 메뉴를 통한 앱 종료

## 실행

요구 환경:

- Windows 10/11
- Node.js 22.12 이상
- npm

프로젝트 루트에서 다음 명령을 실행합니다.

```powershell
npm ci
npm start
```

앱을 종료하려면 Windows 알림 영역의 `Moving Pet` 아이콘을 우클릭하고 **종료**를 선택합니다.

## 검증

```powershell
npm run check
```

위 명령은 다음 작업을 수행합니다.

1. main, preload, renderer TypeScript 빌드
2. renderer 정적 파일 복사
3. 행동 시스템 단위 테스트 실행

## 현재 상태

- TypeScript 빌드 성공
- 행동 시스템 테스트 2개 통과
- Electron 시작 스모크 테스트 완료
- npm 설치 감사 기준 취약점 0개

## 알려진 제한사항

- 기본 모니터에서만 동작합니다.
- 클릭과 드래그에 대한 게임 동작은 아직 없습니다.
- Save, Inventory, 성장 및 육성 시스템은 구현하지 않았습니다.
- Windows 설치 파일과 자동 업데이트는 제공하지 않습니다.
- 실제 캐릭터 이미지 대신 CSS placeholder를 사용합니다.

자세한 파일 구성은 [MANIFEST.md](./MANIFEST.md)를 참고하세요.
