# Memory Index

<!-- 메모리 1개 = 파일 1개. 여기엔 한 줄 포인터만 쌓는다. 형식:
- [제목](경로/파일명.md) — 한 줄 요약(훅)
-->

<!-- 권장 폴더 구조 (원 사용자가 캠페인 중반에 정착시킨 구조 — 처음부터 이렇게 시작하면 좋다):

memory/
├── MEMORY.md                      # 이 인덱스 (섹션별로 정리)
├── <이름>-profile-facts.md        # 프로필 사실 매핑 (type: user)
├── job-applications-<시즌>.md     # 캠페인 연대기 — append-only 히스토리 로그 (type: project)
├── companies/                     # ★ 회사별 폴더 — 지원하는 회사마다 하나
│   └── <회사명>/
│       └── status.md              # "현재 상태" 페이지: 지금 어느 단계인가·다음 마감·확정 사실·액션
├── projects/                      # 프로젝트·경험 도씨에 (자소서·면접 답변의 근거 원장)
│   └── <대표프로젝트>-deepdive.md  # 아키텍처·지표·본인 역할·설계 근거 (type: project)
└── rules/                         # 작업 원칙 — 실수에서 얻은 교훈을 규칙으로 박제 (type: feedback)
    └── fact-verification-rules.md # 예: "후기·수치는 작성 시점 확인" 같은 검증 원칙

운용 원칙:
1. 연대기(job-applications-*)는 지우지 말고 쌓기만 한다(append-only). "지금 뭐 하는 단계인가"는
   companies/<회사>/status.md 가 정본 — 세션 시작 때 Claude가 이것부터 읽게 된다.
2. status.md는 짧게 유지: 트랙 상태 한 줄 + 확정 일정 + 다음 액션 + 관련 문서 링크.
   히스토리·경위가 궁금하면 연대기로 링크([[슬러그]]).
3. rules/는 실수가 났을 때마다 자란다 — "왜 틀렸고 다음에 어떻게 하는가"를 Why/How to apply로.
-->

<!-- 메모리 파일 형식 (각 파일 상단 frontmatter):
---
name: short-kebab-case-slug
description: 한 줄 요약 — 회상 시 관련성 판단에 쓰임
metadata:
  type: user | feedback | project | reference
---

본문. feedback/project는 **Why:** 와 **How to apply:** 를 붙인다.
관련 메모리는 [[슬러그]]로 링크.
-->
