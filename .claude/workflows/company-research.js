export const meta = {
  name: 'company-research',
  description: '기업 신입 채용 정책·일정·전형 멀티에이전트 리서치 — 정책 변화 스캔 내장. args: {company, role?, question?}',
  whenToUse: '특정 기업 지원 검토, 채용 캘린더 작성·갱신 시. "직전 회차 실적 확정"과 "올해 정책 확정"을 구분해 보고한다.',
  phases: [
    { title: 'Research', detail: '공식 소스 / 커뮤니티 실측 / 정책 변화 스캔 (병렬)' },
    { title: 'Synthesize', detail: '[확정]/[예상]/[미확인] 구분 종합' },
  ],
}

const A = typeof args === 'string' ? JSON.parse(args) : (args || {})  // args는 문자열로 올 수 있음 (실측)
const C = A.company
if (!C) return { error: 'args.company 필요 — 예: {company: "OO전자", role: "백엔드"}' }
const ROLE = A.role ? ` (관심 직군: ${A.role})` : ''
const EXTRA = A.question ? `\n추가로 답할 질문: ${A.question}` : ''

const P = `[페르소나] 너는 IT 대기업 채용 전문가다(CLAUDE.md 페르소나). 확인된 사실과 추정을 엄격히 구분하고, 모든 출처에 작성 시점·회차를 명기하라. 핵심 규율: "직전 회차 실적 [확정]" ≠ "올해 정책 [확정]" — 절대 혼동 금지. 최종 텍스트는 사람에게 보이지 않으니 StructuredOutput으로만 반환하라.`

const R_SCHEMA = {
  type: 'object',
  properties: {
    findings: { type: 'string', description: '발견 사실 전체 — [확정]/[예상]/[미확인] 표기, 회차 명기' },
    sources: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, note: { type: 'string' } }, required: ['url', 'note'] } },
    reliability: { type: 'string', description: '신뢰도·한계·접근 실패 기록' },
  },
  required: ['findings', 'sources', 'reliability'],
}

const S_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: '종합 — 전형 구조·일정·코테 형식·언어·난이도, [확정]/[예상]/[미확인] 구분' },
    policy_changes: { type: 'string', description: '정책 변화 판정 (공채 유지/폐지/전환 — 근거)' },
    action_items: { type: 'string', description: '지원 전략 함의·다음 액션 3줄 이내' },
    open_questions: { type: 'string', description: '미확인 잔여 — 재확인 시점 제안' },
  },
  required: ['summary', 'policy_changes', 'action_items', 'open_questions'],
}

phase('Research')
const reports = await parallel([
  () => agent(`${P}\n임무: "${C}"${ROLE}의 신입 개발자 채용을 공식 소스에서 조사하라 — 공식 채용 사이트·뉴스룸·최신 공고 원문·모집요강(WebSearch+WebFetch). 수집: 전형 단계, 접수·시험 일정, 코딩테스트 형식(문제 수/시간/플랫폼/언어 제한), 자격 요건.${EXTRA}`, { label: '공식소스', phase: 'Research', schema: R_SCHEMA }),
  () => agent(`${P}\n임무: "${C}"${ROLE} 채용의 응시자 실측을 수집하라 — 후기 블로그(velog/tistory)·커뮤니티를 다각도 검색. 각 증언에 작성일·응시 회차 필수 명기, 최신 회차 우선. 수집: 코테 실제 난이도·유형·풀이 다수설, 몇 솔 분포·커트라인 발언, 면접 구성, 일정 실적(발표까지 소요일).`, { label: '커뮤니티실측', phase: 'Research', schema: R_SCHEMA }),
  () => agent(`${P}\n임무: "${C}"의 채용 **정책 변화**를 최근 2년 범위로 스캔하라 — 공채 폐지/축소, 채용연계형(교육·인턴십) 전환, 수시 전환, 전형 개편(코테 폐지·대체) 관련 보도·공고 이력(연도별 공고 존재 여부 대조). 과거 회차가 있었는데 최근 회차가 사라졌다면 그 자체가 신호다.`, { label: '정책변화스캔', phase: 'Research', schema: R_SCHEMA }),
])

phase('Synthesize')
const ok = reports.filter(Boolean)
const merged = await agent(`${P}\n다음은 "${C}" 채용에 대한 독립 조사 3건(공식/커뮤니티/정책변화)이다. 상충 시 우선순위: 공식 1차 소스 > 최신 회차 실측 > 과거 실측. 종합 보고를 작성하라.${EXTRA}\n\n${ok.map((r, i) => `[조사 ${i + 1}]\n${r.findings}\n(신뢰도: ${r.reliability})`).join('\n\n')}`, { label: '종합', phase: 'Synthesize', schema: S_SCHEMA })

return { company: C, result: merged, sources: ok.flatMap(r => r.sources) }
