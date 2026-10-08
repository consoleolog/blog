// Blog posts shared by Blog Home and Blog Post. Body blocks: ['h', text] | ['p', text] | ['code', lang, source]
export const POSTS = [
  { id:'token-refresh', date:'2026.03.14', tags:['React','HTTP Client'],
    ko:{ title:'동시 요청 속 토큰 재발급, Promise 하나로 묶기', summary:'여러 API가 동시에 401을 받을 때 재발급 요청이 쏟아지는 문제를 진행 중인 Promise 캐싱으로 해결한 과정',
      body:[
        ['h','문제'],
        ['p','한 페이지가 렌더링될 때 여러 API가 동시에 호출됩니다. 액세스 토큰이 만료된 상태라면 모든 요청이 401을 받고, 각자 토큰 재발급을 요청합니다. 그 결과 재발급 API가 페이지당 여러 번 호출되고, 먼저 발급된 토큰이 뒤늦게 덮어써지는 경쟁 상태가 생겼습니다.'],
        ['h','해결'],
        ['p','진행 중인 요청의 Promise를 Map에 캐싱해, 같은 키의 요청은 하나의 Promise를 공유하도록 했습니다. 재발급도 같은 방식으로 한 번만 실행되고, 나머지 요청은 그 결과를 기다렸다가 재시도합니다.'],
        ['code','ts',`const inflight = new Map<string, Promise<string>>();

function refreshToken() {
  if (!inflight.has('refresh')) {
    const p = api.post('/auth/refresh')
      .then(res => res.data.accessToken)
      .finally(() => inflight.delete('refresh'));
    inflight.set('refresh', p);
  }
  return inflight.get('refresh')!;
}`],
        ['h','결과'],
        ['p','페이지당 재발급 요청이 1회로 줄었고, 동일 요청의 중복 방지를 클라이언트 공통 계층에서 처리하게 되었습니다.'],
      ] },
    en:{ title:'Token refresh under concurrent requests: sharing one Promise', summary:'How caching the in-flight Promise stopped a flood of refresh requests when many APIs hit 401 at once',
      body:[
        ['h','The problem'],
        ['p','A single page fires several API calls at once. When the access token has expired, every request gets a 401 and asks for a new token on its own. The refresh endpoint was hit several times per page, and a later response could overwrite a token that had just been issued.'],
        ['h','The fix'],
        ['p','I cached in-flight Promises in a Map so requests with the same key share one Promise. Refresh runs once the same way, and the other requests wait for it and retry.'],
        ['code','ts',null],
        ['h','Result'],
        ['p','Refresh requests dropped to one per page, and duplicate-request prevention now lives in a shared client layer.'],
      ] },
    ja:{ title:'同時リクエスト下のトークン再発行、Promiseひとつにまとめる', summary:'複数APIが同時に401を受けて再発行が殺到する問題を、進行中Promiseのキャッシュで解決した過程',
      body:[
        ['h','問題'],
        ['p','1ページの描画時に複数のAPIが同時に呼ばれます。アクセストークンが期限切れだと、すべてのリクエストが401を受け、それぞれがトークン再発行を要求していました。その結果、再発行APIがページごとに何度も呼ばれ、後から返ったトークンが先のものを上書きする競合も起きていました。'],
        ['h','解決'],
        ['p','進行中リクエストのPromiseをMapにキャッシュし、同じキーのリクエストは一つのPromiseを共有するようにしました。再発行も同じ仕組みで一度だけ実行され、他のリクエストはその結果を待って再試行します。'],
        ['code','ts',null],
        ['h','結果'],
        ['p','ページあたりの再発行リクエストが1回になり、同一リクエストの重複防止をクライアント共通レイヤーで扱えるようになりました。'],
      ] } },
  { id:'liquibase', date:'2026.11.02', tags:['Spring','Liquibase'],
    ko:{ title:'CI/CD 없는 폐쇄망에서 Liquibase로 스키마 관리하기', summary:'수작업 SQL 배포를 changelog 기반 자동 적용으로 바꾸며 겪은 시행착오',
      body:[
        ['h','배경'],
        ['p','정규화되지 않은 기존 DB를 JPA 엔티티 중심으로 재설계했지만, CI/CD 도구가 없는 폐쇄망이라 스키마 변경과 데이터 이관을 매번 수작업으로 배포해야 했습니다.'],
        ['h','왜 Liquibase인가'],
        ['p','외부 의존성 반입이 제한된 환경이라 별도 인프라 없이 애플리케이션에 내장할 수 있어야 했습니다. Liquibase는 라이브러리 하나로 동작하고, 기동 시 changelog를 읽어 아직 적용되지 않은 변경만 실행합니다.'],
        ['code','yaml',`databaseChangeLog:
  - changeSet:
      id: 2026-05-01-add-status
      author: chaeryeong
      changes:
        - addColumn:
            tableName: item
            columns:
              - column: { name: status, type: varchar(20) }
      rollback:
        - dropColumn: { tableName: item, columnName: status }`],
        ['h','결과'],
        ['p','수작업 SQL 실행 단계가 줄어 배포 절차가 단순해졌고, 적용 이력과 롤백 기준이 생겨 마이그레이션 누락이나 순서 오류 위험이 낮아졌습니다.'],
      ] },
    en:{ title:'Managing schemas with Liquibase on an air-gapped network', summary:'Lessons from replacing manual SQL deploys with changelog-based automatic migrations',
      body:[
        ['h','Background'],
        ['p','I redesigned a non-normalized legacy database around JPA entities, but the network was air-gapped with no CI/CD tools, so every schema change and data migration had to be deployed by hand.'],
        ['h','Why Liquibase'],
        ['p','Bringing in external dependencies was restricted, so the tool had to run inside the application with no extra infrastructure. Liquibase works as a single library and, on startup, applies only the changelog entries that have not run yet.'],
        ['code','yaml',null],
        ['h','Result'],
        ['p','Fewer manual SQL steps made deployment simpler, and change history plus rollback criteria lowered the risk of missed or out-of-order migrations.'],
      ] },
    ja:{ title:'CI/CDのない閉域網でLiquibaseによるスキーマ管理', summary:'手作業のSQLデプロイをchangelogベースの自動適用に切り替えた試行錯誤',
      body:[
        ['h','背景'],
        ['p','正規化されていない既存DBをJPAエンティティ中心に再設計しましたが、CI/CDツールのない閉域網のため、スキーマ変更とデータ移行を毎回手作業でデプロイする必要がありました。'],
        ['h','なぜLiquibaseか'],
        ['p','外部依存の持ち込みが制限された環境なので、追加インフラなしでアプリに組み込めることが条件でした。Liquibaseはライブラリ一つで動作し、起動時にchangelogを読んで未適用の変更だけを実行します。'],
        ['code','yaml',null],
        ['h','結果'],
        ['p','手作業のSQL実行が減ってデプロイ手順が簡素になり、適用履歴とロールバック基準によってマイグレーションの漏れや順序ミスのリスクが下がりました。'],
      ] } },
  { id:'uml-auth', date:'2025.02.20', pinned:true, tags:['Spring Boot','UML'],
    ko:{ title:'구현 전에 UML부터: 복잡한 인증 흐름 설계기', summary:'GS 인증 대응으로 늘어난 인증 분기를 시퀀스 · 상태 다이어그램으로 먼저 정리한 이야기',
      body:[
        ['h','배경'],
        ['p','GS 인증의 보안성 기준을 충족하기 위해 기존 로그인에 이메일 인증, 비밀번호 찾기 등 인증 절차가 추가되면서 분기와 예외 흐름이 크게 복잡해졌습니다.'],
        ['h','접근'],
        ['p','바로 구현하는 대신 시퀀스 다이어그램으로 인증 흐름을, 상태 다이어그램으로 계정 상태 전이를 먼저 설계했습니다.'],
        ['code','text',`[미인증] --이메일 인증--> [활성]
[활성] --로그인 5회 실패--> [잠금]
[잠금] --비밀번호 재설정--> [활성]
[활성] --90일 미접속--> [휴면]`],
        ['h','결과'],
        ['p','누락된 분기와 예외 케이스를 구현 전에 발견해 재작업을 줄였고, 설계 산출물을 인증 대응과 팀 내 공유 자료로 활용했습니다.'],
      ] },
    en:{ title:'UML before code: designing a complex auth flow', summary:'Mapping the auth branches added for GS certification with sequence and state diagrams first',
      body:[
        ['h','Background'],
        ['p','To meet GS certification security criteria, email verification and password recovery were added to the existing login, and the branches and exception paths grew much more complex.'],
        ['h','Approach'],
        ['p','Instead of coding right away, I first designed the auth flow with sequence diagrams and account state transitions with a state diagram.'],
        ['code','text',`[Unverified] --verify email--> [Active]
[Active] --5 failed logins--> [Locked]
[Locked] --reset password--> [Active]
[Active] --90 days inactive--> [Dormant]`],
        ['h','Result'],
        ['p','Missing branches and edge cases surfaced before implementation, which cut rework, and the diagrams were reused for certification and team knowledge sharing.'],
      ] },
    ja:{ title:'実装の前にUML：複雑な認証フローの設計記', summary:'GS認証対応で増えた認証分岐を、シーケンス図・状態遷移図で先に整理した話',
      body:[
        ['h','背景'],
        ['p','GS認証のセキュリティ基準を満たすため、既存のログインにメール認証やパスワード再設定などの手順が加わり、分岐と例外フローが大きく複雑になりました。'],
        ['h','アプローチ'],
        ['p','すぐに実装する代わりに、シーケンス図で認証フローを、状態遷移図でアカウントの状態遷移を先に設計しました。'],
        ['code','text',`[未認証] --メール認証--> [有効]
[有効] --ログイン5回失敗--> [ロック]
[ロック] --パスワード再設定--> [有効]
[有効] --90日未ログイン--> [休眠]`],
        ['h','結果'],
        ['p','漏れていた分岐や例外ケースを実装前に見つけて手戻りを減らし、設計成果物を認証対応とチーム内の共有資料として活用しました。'],
      ] } },
  { id:'overlay', date:'2025.09.08', tags:['React','UI'],
    ko:{ title:'외부 라이브러리 없이 오버레이 컴포넌트 만들기', summary:'포커스 트랩, 스크롤 잠금, 중첩 오버레이까지 직접 구현하며 정리한 체크리스트',
      body:[
        ['h','배경'],
        ['p','외부 라이브러리 도입이 제한된 프로젝트라 오버레이, 폼 등 공통 UI 컴포넌트를 직접 설계 · 구현해 화면 전반에서 재사용했습니다.'],
        ['h','체크리스트'],
        ['p','열릴 때 첫 포커스 이동, Tab 순환(포커스 트랩), Esc로 닫기, 배경 스크롤 잠금, 닫힐 때 원래 위치로 포커스 복귀, 중첩 시 가장 위 오버레이만 반응하기.'],
        ['code','tsx',`function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}`],
      ] },
    en:{ title:'Building overlay components without external libraries', summary:'A checklist from implementing focus traps, scroll locking and nested overlays by hand',
      body:[
        ['h','Background'],
        ['p','External libraries were restricted on this project, so I designed and built shared UI components such as overlays and forms and reused them across screens.'],
        ['h','Checklist'],
        ['p','Move focus in on open, cycle Tab inside (focus trap), close on Esc, lock background scroll, return focus on close, and let only the topmost overlay respond when nested.'],
        ['code','tsx',null],
      ] },
    ja:{ title:'外部ライブラリなしでオーバーレイコンポーネントを作る', summary:'フォーカストラップ、スクロールロック、ネストしたオーバーレイまで自作して整理したチェックリスト',
      body:[
        ['h','背景'],
        ['p','外部ライブラリの導入が制限されたプロジェクトだったため、オーバーレイやフォームなどの共通UIコンポーネントを自ら設計・実装し、画面全体で再利用しました。'],
        ['h','チェックリスト'],
        ['p','開いたときのフォーカス移動、Tabの循環(フォーカストラップ)、Escで閉じる、背景スクロールのロック、閉じたときのフォーカス復帰、ネスト時は最前面のオーバーレイだけが反応すること。'],
        ['code','tsx',null],
      ] } },
];
// Code blocks marked null reuse the Korean version's source.
for (const p of POSTS) for (const l of ['en','ja']) p[l].body.forEach((b, i) => { if (b[0] === 'code' && b[2] == null) b[2] = p.ko.body[i][2]; });
