---
trigger: always_on
---


이 규칙은 Resume Builder Pro 프로젝트의 개발 안정성을 보장하기 위한 실행 프로토콜입니다.

1. 모든 응답은 한국어로 작성한다.
2. UI 텍스트(버튼, 라벨, 경고, 플레이스홀더)는 한국어로 작성한다.
3. 변수명과 함수명은 영어를 사용한다.

[단계 잠금 규칙]
- 다음 단계로 넘어가기 전 반드시 아래 중 최소 1개를 확인한다:
  - git status
  - git diff
  - 실행 결과 로그
- 증거 없이 다음 단계 진행 금지.

[One Feature Rule]
- 한 번에 기능 1개만 수정한다.
- 대규모 리팩토링 금지.
- 파일 변경은 최소 범위로 제한한다.

[보안 규칙]
- entitlements는 클라이언트에서 절대 수정하지 않는다.
- 결제 검증은 반드시 서버 로직을 거친다.
- force push, credential 관련 명령은 금지한다.

[MCP 사용 순서]
1. filesystem으로 구조 확인
2. git으로 브랜치/상태 확인
3. sequential-thinking으로 단계 분해
4. notebooklm 규칙 반영
5. 필요 시 puppeteer로 UI 검증
