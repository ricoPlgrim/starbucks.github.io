import { useState, useEffect } from "react";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import Image from "../../components/Image/Image";
import Header from "../../components/Header/Header";
import "./PublishingGuidePage.scss";

const PaginationPreview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 25;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 현재 페이지의 아이템들 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = Array.from({ length: endIndex - startIndex }, (_, idx) => startIndex + idx + 1);

  // 현재 페이지 주변 페이지 계산 (최대 5개 표시)
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="guide-preview guide-preview--pagination">
      <div className="pagination-demo">
        {/* 리스트 영역 */}
        <div className="pagination-list">
          <h4>페이지네이션 리스트 ({currentItems.length}개 항목)</h4>
          <div className="pagination-items">
            {currentItems.map((item) => (
              <div key={item} className="pagination-item">
                <div className="pagination-item__content">
                  <span className="pagination-item__number">{item}</span>
                  <span className="pagination-item__title">페이지네이션 아이템 {item}</span>
                </div>
                <div className="pagination-item__actions">
                  <button className="pagination-item__btn">보기</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지네이션 컨트롤 */}
        <div className="pagination-controls">
          <div className="pagination-info">
            <span>총 {totalItems}개 항목 · {totalPages}페이지 중 </span>
            <strong>{currentPage}페이지</strong>
            <span> 표시중</span>
          </div>

          <div className="pagination-buttons">
            <button
              className="pagination-btn pagination-btn--prev"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ‹ 이전
            </button>

            <div className="pagination-numbers">
              {getVisiblePages().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${page === currentPage ? 'is-active' : ''} ${page === '...' ? 'is-dots' : ''}`}
                  disabled={page === '...'}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn pagination-btn--next"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              다음 ›
            </button>
          </div>
        </div>

        <div className="pagination-summary">
          <small>페이지네이션은 대량 데이터를 효율적으로 탐색할 수 있게 해줍니다</small>
        </div>
      </div>
    </div>
  );
};

const LayoutPreview = () => {
  const [visibleItems, setVisibleItems] = useState(5);
  const totalItems = 20;

  // 더보기 버튼 핸들러
  const handleLoadMore = () => {
    setVisibleItems(prev => Math.min(prev + 5, totalItems));
  };

  // 현재 표시할 아이템들
  const currentItems = Array.from({ length: visibleItems }, (_, idx) => idx + 1);

  return (
    <div className="guide-preview guide-preview--layout">
      {/* 리스트 영역 */}
      <div className="layout-list">
        <h4>더보기 리스트 예시 ({currentItems.length}/{totalItems})</h4>
        <div className="layout-items">
          {currentItems.map((item) => (
            <div key={item} className="layout-item">
              <div className="layout-item__content">
                <span className="layout-item__number">{item}</span>
                <span className="layout-item__title">리스트 아이템 {item}</span>
              </div>
              <div className="layout-item__actions">
                <button className="layout-item__btn">보기</button>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {visibleItems < totalItems && (
          <div className="layout-load-more">
            <button
              className="btn btn--secondary"
              onClick={handleLoadMore}
            >
              더보기 ({Math.min(visibleItems + 5, totalItems) - visibleItems}개)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const IconPreview = () => {
  const [copiedIcon, setCopiedIcon] = useState(null);

  const icons = [
    { label: "알림", symbol: "🔔", className: "icon-notification" },
    { label: "즐겨찾기", symbol: "⭐", className: "icon-star" },
    { label: "설정", symbol: "⚙️", className: "icon-settings" },
  ];

  const copyToClipboard = async (className, iconLabel) => {
    try {
      await navigator.clipboard.writeText(className);
      setCopiedIcon(className);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = className;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedIcon(className);
      setTimeout(() => setCopiedIcon(null), 2000);
    }
  };

  return (
    <div className="guide-preview guide-preview--icons">
      {icons.map((icon) => (
        <button
          key={icon.className}
          type="button"
          className={`icon-chip ${copiedIcon === icon.className ? "is-copied" : ""}`}
          aria-label={`${icon.label} 아이콘 복사`}
          onClick={() => copyToClipboard(icon.className, icon.label)}
        >
          <span className="icon-chip__symbol">{icon.symbol}</span>
          <span className="icon-chip__label">{icon.label}</span>
          {copiedIcon === icon.className && (
            <span className="icon-chip__copied" aria-live="polite">
              복사됨
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

const FormPreview = () => (
  <form className="guide-preview guide-preview--form">
    <label className="field">
      <span className="field__label">이메일</span>
      <input type="email" placeholder="name@example.com" />
      <small className="field__help">가입 시 사용한 이메일을 입력하세요.</small>
    </label>
    <label className="field">
      <span className="field__label">비밀번호</span>
      <input type="password" placeholder="••••••" />
      <small className="field__help is-error">8자 이상 입력해주세요.</small>
    </label>
  </form>
);

const ButtonPreview = () => (
  <div className="guide-preview guide-preview--buttons">
    <button type="button" className="btn btn--primary">
      Primary
    </button>
    <button type="button" className="btn btn--secondary">
      Secondary
    </button>
    <button type="button" className="btn btn--ghost">
      Ghost
    </button>
  </div>
);

const CardPreview = () => (
  <article className="guide-preview guide-preview--card">
    <p className="card__eyebrow">NEW</p>
    <h4>하이라이트 카드</h4>
    <p className="card__desc">
      퍼블리싱 가이드를 따르면, 컴포넌트 간 여백과 타이포가 일관되게 유지됩니다.
    </p>
  </article>
);

const TabPreview = () => {
  const tabItems = [
    {
      id: "detail",
      label: "상세",
      description: "상품 이미지, 설명, 원두 정보 등을 제공합니다.",
    },
    {
      id: "review",
      label: "리뷰",
      description: "구매자 후기와 평점을 정렬/필터링하여 보여줍니다.",
    },
    {
      id: "qa",
      label: "Q&A",
      description: "자주 묻는 질문과 답변을 탭 안에서 바로 확인할 수 있습니다.",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabItems[0].id);
  const activeItem = tabItems.find((item) => item.id === activeTab);

  return (
    <div className="guide-preview guide-preview--tabs">
      <div className="guide-preview__tablist" role="tablist" aria-label="콘텐츠 탭 예시">
        {tabItems.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="guide-preview__tabpanel"
        role="tabpanel"
        aria-live="polite"
        aria-label={`${activeItem?.label} 탭 내용`}
      >
        {activeItem?.description}
      </div>
    </div>
  );
};

const ImagePreview = () => (
  <div className="guide-preview guide-preview--images">
    <div className="image-examples">
      {/* 정상 이미지 */}
      <div className="image-example">
        <h4>정상 이미지</h4>
        <Image
          src="https://picsum.photos/300/200"
          alt="가로형 이미지 예시"
          width="200"
          height="150"
        />
      </div>

      {/* 세로형 이미지 */}
      <div className="image-example">
        <h4>세로형 이미지</h4>
        <Image
          src="https://picsum.photos/200/300"
          alt="세로형 이미지 예시"
          width="150"
          height="200"
        />
      </div>

      {/* 정사각형 이미지 */}
      <div className="image-example">
        <h4>정사각형 이미지</h4>
        <Image
          src="https://picsum.photos/200/200"
          alt="정사각형 이미지 예시"
          width="150"
          height="150"
        />
      </div>

      {/* 로드 실패 이미지 */}
      <div className="image-example">
        <h4>noimage 이미지 (폴백)</h4>
        <Image
          src="https://invalid-url-that-will-fail.com/image.jpg"
          alt="로드 실패 이미지"
          width="150"
          height="150"
        />
      </div>
    </div>
  </div>
);

const ScriptPreview = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // 카운터 증가 핸들러
  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setMessage(`카운터가 ${count + 1}로 증가했습니다!`);
    setTimeout(() => setMessage(''), 2000);
  };

  // 데이터 로드 시뮬레이션
  const handleLoadData = async () => {
    setIsLoading(true);
    setMessage('데이터를 불러오는 중...');

    // 2초 후에 데이터 로드 시뮬레이션
    setTimeout(() => {
      const mockData = {
        id: 1,
        title: "샘플 데이터",
        content: "스크립트 인터랙션 예시",
        timestamp: new Date().toLocaleString()
      };
      setData(mockData);
      setIsLoading(false);
      setMessage('데이터가 성공적으로 로드되었습니다!');
      setTimeout(() => setMessage(''), 3000);
    }, 2000);
  };

  // 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');

    setMessage(`폼이 제출되었습니다: ${name} (${email})`);
    event.target.reset();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="guide-preview guide-preview--scripts">
      {/* 상태 관리 예시 */}
      <div className="script-section">
        <h4>상태 관리 & 이벤트 핸들링</h4>
        <div className="script-demo">
          <p>카운터: <strong>{count}</strong></p>
          <button
            className="btn btn--primary"
            onClick={handleIncrement}
          >
            카운트 증가
          </button>
        </div>
      </div>

      {/* 비동기 데이터 로드 예시 */}
      <div className="script-section">
        <h4>비동기 데이터 로드</h4>
        <div className="script-demo">
          <button
            className="btn btn--secondary"
            onClick={handleLoadData}
            disabled={isLoading}
          >
            {isLoading ? '로딩 중...' : '데이터 로드'}
          </button>
          {data && (
            <div className="script-result">
              <p><strong>로드된 데이터:</strong></p>
              <p>ID: {data.id}</p>
              <p>제목: {data.title}</p>
              <p>내용: {data.content}</p>
              <p>시간: {data.timestamp}</p>
            </div>
          )}
        </div>
      </div>

      {/* 폼 제출 예시 */}
      <div className="script-section">
        <h4>폼 제출</h4>
        <div className="script-demo">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="이름 입력"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="이메일 입력"
                required
              />
              <button type="submit" className="btn btn--primary">
                제출
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div className="script-message">
          {message}
        </div>
      )}
    </div>
  );
};

const FileUploadPreview = () => {
  const [fileInfo, setFileInfo] = useState(null);
  const MAX_SIZE = 300 * 1024 * 1024; // 300MB

  const allowedTypes = ["application/pdf"];

  const isAllowed = (file) => {
    return file.type.startsWith("image/") || allowedTypes.includes(file.type);
  };

  const handleClear = () => {
    setFileInfo(null);
    const input = document.getElementById("guide-file-input");
    if (input) input.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 용량 체크
    if (file.size > MAX_SIZE) {
      alert("최대 300MB까지 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    // 타입 체크
    if (!isAllowed(file)) {
      alert("지원하지 않는 파일입니다. (허용: 이미지, PDF)");
      event.target.value = "";
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  };

  return (
    <div className="guide-preview guide-preview--file">
      <div className="file-upload-demo">
        <div className="file-upload-demo__field">
          <label className="file-upload-demo__label" htmlFor="guide-file-input">
            파일 첨부
          </label>
          <input
            id="guide-file-input"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          <p className="file-upload-demo__hint">
            • 최대 300MB&nbsp;&nbsp;• 허용: 이미지, PDF&nbsp;&nbsp;• 기타 파일은 업로드 불가
          </p>
        </div>

        <div className="file-upload-demo__status">
          {fileInfo ? (
            <>
              <div className="file-upload-demo__status-head">
                <p className="file-upload-demo__status-title">업로드 정보</p>
                <button
                  type="button"
                  className="file-upload-demo__clear"
                  onClick={handleClear}
                  aria-label="첨부 파일 삭제"
                >
                  ✕
                </button>
              </div>
              <ul>
                <li><strong>이름:</strong> {fileInfo.name}</li>
                <li><strong>크기:</strong> {formatSize(fileInfo.size)}</li>
                <li><strong>타입:</strong> {fileInfo.type}</li>
              </ul>
            </>
          ) : (
            <p className="file-upload-demo__placeholder">선택된 파일이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderPreview = () => {
  const [currentPage, setCurrentPage] = useState("guide");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="guide-preview guide-preview--header">
      <div className="header-demo">
        <div className="header-demo__description">
          <p>모바일 햄버거 버튼을 눌러 사이드 메뉴를 열고, 2·3뎁스 펼침을 확인하세요.</p>
          <p>실제 Header 컴포넌트를 그대로 사용해 동작을 시연합니다.</p>
        </div>

        {/* 실제 Header 컴포넌트를 포함한 데모 프레임 */}
        <div className="header-demo__mobile-frame">
          <div className="header-demo__mobile-screen">
            <Header currentPage={currentPage} onPageChange={handlePageChange} />
            <div className="header-demo__mobile-content">
              <h4>모바일 헤더 데모</h4>
              <p>현재 페이지: <strong>{currentPage === "guide" ? "퍼블리싱 가이드" : "URL 관리"}</strong></p>
              <p>우측 햄버거 버튼을 눌러 2·3뎁스 메뉴를 펼쳐보세요.</p>
              <p>사이드 메뉴는 슬라이드 인/아웃으로 동작합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const guideSections = [
  {
    id: "header",
    label: "헤더",
    title: "모바일 헤더 레이아웃",
    description:
      "모바일 환경을 위한 반응형 헤더 디자인입니다. 햄버거 버튼으로 사이드 메뉴를 열 수 있으며, 3뎁스 메뉴 구조를 지원합니다.",
    code: `// 모바일 헤더 컴포넌트 구조
function Header({ currentPage, onPageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // 햄버거 버튼 토글
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 2뎁스, 3뎁스 메뉴 토글
  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 메뉴 클릭 시 닫기
  const closeMenu = () => {
    setIsMenuOpen(false);
    setExpandedItems({});
  };

  return (
    <header className="header">
      {/* 햄버거 버튼 */}
      <button className="header__hamburger" onClick={toggleMenu}>
        <span></span><span></span><span></span>
      </button>

      {/* 사이드 메뉴 */}
      <aside className={\`header__aside \${isMenuOpen ? 'is-open' : ''}\`}>
        {/* 3뎁스 메뉴 구조 */}
        <nav className="header__nav">
          {/* 메뉴 아이템들 */}
        </nav>
      </aside>
    </header>
  );
}`,
    PreviewComponent: HeaderPreview,
  },
  {
    id: "file-upload",
    label: "파일첨부",
    title: "파일 첨부 UI",
    description:
      "이미지와 PDF만 허용하며 최대 300MB까지 첨부할 수 있는 기본 파일 업로드 UI입니다. 허용되지 않는 타입은 얼럿으로 안내합니다.",
    code: `const MAX_SIZE = 300 * 1024 * 1024; // 300MB
const allowed = (file) => file.type.startsWith("image/") || file.type === "application/pdf";

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > MAX_SIZE) {
    alert("최대 300MB까지 첨부할 수 있습니다.");
    e.target.value = "";
    return;
  }
  if (!allowed(file)) {
    alert("지원하지 않는 파일입니다. (허용: 이미지, PDF)");
    e.target.value = "";
  }
};`,
    PreviewComponent: FileUploadPreview,
  },
  {
    id: "layout",
    label: "더보기",
    title: "더보기 레이아웃",
    description:
      "더보기 버튼으로 대량의 리스트 데이터를 점진적으로 로드합니다. 초기 제한된 개수부터 시작해 사용자의 필요에 따라 추가 데이터를 불러옵니다.",
    code: `// 더보기 기능 구현
const [visibleItems, setVisibleItems] = useState(5);
const totalItems = 20;

// 더보기 핸들러
const handleLoadMore = () => {
  setVisibleItems(prev => Math.min(prev + 5, totalItems));
};

// 현재 표시할 아이템들
const displayedItems = items.slice(0, visibleItems);

return (
  <div className="layout-list">
    {displayedItems.map(item => (
      <div key={item.id} className="layout-item">
        {/* 아이템 내용 */}
      </div>
    ))}

    {visibleItems < totalItems && (
      <button onClick={handleLoadMore}>
        더보기 ({Math.min(visibleItems + 5, totalItems) - visibleItems}개)
      </button>
    )}
  </div>
);`,
    PreviewComponent: LayoutPreview,
  },
  {
    id: "icon",
    label: "아이콘",
    title: "아이콘 사용 가이드",
    description:
      "라인 아이콘과 솔리드 아이콘을 구분하고, 접근성 텍스트(`aria-label`)를 반드시 제공하세요.",
    code: `<button class="icon-button" aria-label="알림">
  <svg width="20" height="20" aria-hidden="true">
    <!-- icon -->
  </svg>
</button>`,
    PreviewComponent: IconPreview,
  },
  {
    id: "form",
    label: "폼",
    title: "폼 요소",
    description:
      "레이블, 플레이스홀더, 보조텍스트를 구분해 시각·보조기기 사용성을 높입니다.",
    code: `<label class="field">
  <span class="field__label">이메일</span>
  <input type="email" placeholder="name@example.com" />
  <small class="field__help">가입 시 사용한 이메일을 입력하세요.</small>
</label>`,
    PreviewComponent: FormPreview,
  },
  {
    id: "button",
    label: "버튼",
    title: "버튼 타입",
    description:
      "Primary/Secondary/Quiet 버튼을 픽셀값 대신 `rem`으로 정의해 접근성을 확보합니다.",
    code: `<button class="btn btn--primary">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--ghost">Ghost</button>`,
    PreviewComponent: ButtonPreview,
  },
  {
    id: "component",
    label: "컴포넌트",
    title: "카드 컴포넌트",
    description:
      "카드는 정형화된 높이를 갖고, 본문은 2줄까지 잘라내어 목록 가독성을 높입니다.",
    code: `<article class="card">
  <p class="card__eyebrow">NEW</p>
  <h4>하이라이트 카드</h4>
  <p class="card__desc">2줄에서 말줄임 처리를 적용합니다.</p>
</article>`,
    PreviewComponent: CardPreview,
  },
  {
    id: "tab",
    label: "탭",
    title: "탭 인터페이스",
    description:
      "탭은 버튼 역할을 하며, `aria-selected`와 `role=\"tablist\"` 속성을 설정합니다.",
    code: `<div role="tablist" aria-label="콘텐츠 탭">
  <button role="tab" aria-selected="true">상세</button>
  <button role="tab" aria-selected="false">리뷰</button>
  <button role="tab" aria-selected="false">Q&A</button>
</div>`,
    PreviewComponent: TabPreview,
  },
  {
    id: "image",
    label: "이미지",
    title: "이미지 컴포넌트",
    description:
      "이미지 로드 실패 시 자동으로 'noimage' 이미지를 표시하고, 원본 이미지의 가로/세로 비율에 따라 자동으로 클래스를 부여합니다.",
    code: `<Image
  src="https://example.com/image.jpg"
  alt="이미지 설명"
  width="300"
  height="200"
  onLoad={() => console.log('이미지 로드됨')}
  onError={() => console.log('이미지 로드 실패')}
/>`,
    PreviewComponent: ImagePreview,
  },
  {
    id: "script",
    label: "스크립트",
    title: "JavaScript 인터랙션",
    description:
      "React의 이벤트 핸들링, 상태 관리, API 연동을 포함한 인터랙션 구현 패턴입니다. 사용자 입력에 따라 UI가 동적으로 변화합니다.",
    code: `// 상태 관리
const [count, setCount] = useState(0);

// 이벤트 핸들러
const handleClick = () => {
  setCount(prev => prev + 1);
};

// 비동기 데이터 로드
const loadData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

// 폼 제출
const handleSubmit = (event) => {
  event.preventDefault();
  // 폼 데이터 처리
  console.log('폼 제출됨');
};`,
    PreviewComponent: ScriptPreview,
  },
  {
    id: "pagination",
    label: "페이지네이션",
    title: "페이지네이션 레이아웃",
    description:
      "대량의 데이터를 여러 페이지로 나누어 표시하는 네비게이션 컴포넌트입니다. 현재 페이지 표시와 이전/다음 이동 기능을 제공하며, 긴 목록을 효율적으로 탐색할 수 있습니다.",
    code: `// 페이지네이션 상태 관리
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(totalItems / itemsPerPage);

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
    // 데이터 로드 로직
    loadPageData(page);
  }
};

// 페이지네이션 UI 렌더링
const renderPagination = () => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={i === currentPage ? 'active' : ''}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        이전
      </button>
      {pages}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
};`,
    PreviewComponent: PaginationPreview,
  },
];

function PublishingGuidePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id);

  // 네비게이션 클릭 핸들러 - 네비게이션 바 높이 고려한 부드러운 스크롤
  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // 네비게이션 바 높이 계산
      const navElement = document.querySelector('.app-nav');
      const navHeight = navElement ? navElement.offsetHeight : 0;

      // 네비게이션 바 높이를 고려한 스크롤 위치 계산
      const targetPosition = element.offsetTop - navHeight - 20; // 추가 패딩

      // 부드러운 스크롤
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // 활성화 섹션 업데이트
      setActiveSection(sectionId);
    }
  };

  // 스크롤 이벤트로 활성화 섹션 감지
  useEffect(() => {
    const handleScroll = () => {
      const sections = guideSections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(section => section.element);

      if (sections.length === 0) return;

      // 상단 네비게이션 바 높이 계산
      const navElement = document.querySelector('.app-nav');
      const navHeight = navElement ? navElement.offsetHeight : 0;

      const scrollPosition = window.scrollY + navHeight + 50; // 네비 높이 + 추가 오프셋

      // 아래에서 위로 순회하며 현재 위치에 해당하는 섹션 찾기
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const offsetTop = section.element.offsetTop;

        if (scrollPosition >= offsetTop) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    // DOM이 완전히 로드된 후 실행되도록 타임아웃 설정
    const timeoutId = setTimeout(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <PageTemplate title="퍼블리싱 가이드">
      <section className="publishing-guide">
        <div className="publishing-guide__layout">
          <nav className="publishing-guide__lnb" aria-label="퍼블리싱 가이드 메뉴">
            <p className="publishing-guide__lnb-title">Guide</p>
            <ul className="publishing-guide__lnb-list">
              {guideSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      className={`publishing-guide__lnb-link${isActive ? " is-active" : ""}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => handleNavClick(section.id)}
                    >
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="publishing-guide__content">
            {guideSections.map((section) => (
              <article key={section.id} id={section.id} className="guide-section">
                <header className="guide-section__header">
                  <p className="guide-section__eyebrow">{section.label}</p>
                  <div>
                    <h3 className="guide-section__title">{section.title}</h3>
                    <p className="guide-section__description">{section.description}</p>
                  </div>
                </header>

                <div className="guide-section__body">
                  <div className="guide-section__code">
                    <p className="guide-section__code-label">예시 코드</p>
                    <pre>
                      <code>{section.code}</code>
                    </pre>
                  </div>

                  <div className="guide-section__preview">
                    <p className="guide-section__code-label">UI 미리보기</p>
                    <section.PreviewComponent />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}

export default PublishingGuidePage;


