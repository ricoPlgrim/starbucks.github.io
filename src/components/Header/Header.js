import { useState, useRef, useEffect } from "react";
import "./Header.scss";

function Header({ currentPage, onPageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  // 각 서브메뉴의 DOM 참조 (2뎁스, 3뎁스 애니메이션용)
  const submenuRefs = useRef({});
  // expandedItems의 최신 상태를 추적하기 위한 ref
  const expandedItemsRef = useRef(expandedItems);

  /**
   * 메뉴 토글 이벤트 핸들러
   * 햄버거 버튼 클릭 시 사이드 메뉴 열기/닫기
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * 2뎁스, 3뎁스 메뉴 토글 이벤트 핸들러
   * 서브메뉴 클릭 시 해당 메뉴 열기/닫기
   * @param {string} key - 메뉴 ID
   */
  const toggleExpanded = (key) => {
    setExpandedItems(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };
      // ref에도 최신 상태 저장
      expandedItemsRef.current = newState;
      return newState;
    });
  };

  /**
   * 메뉴 클릭 시 사이드 메뉴 닫기
   * 링크 클릭 시 호출됨
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
    setExpandedItems({});
  };

  // expandedItems가 변경될 때마다 ref 업데이트
  useEffect(() => {
    expandedItemsRef.current = expandedItems;
  }, [expandedItems]);

  /**
   * 단일 메뉴의 정확한 높이를 측정하는 함수
   * transition을 일시적으로 비활성화하여 정확한 높이 측정
   * @param {HTMLElement} ref - 측정할 요소
   * @returns {number} - 실제 콘텐츠 높이
   */
  const measureHeight = (ref) => {
    if (!ref) return 0;
    
    // 현재 max-height 저장
    const originalMaxHeight = ref.style.maxHeight;
    
    // transition을 일시적으로 비활성화하여 높이 측정 중 애니메이션 방지
    ref.style.transition = "none";
    
    // max-height를 매우 큰 값으로 설정하여 제약 제거
    ref.style.maxHeight = "9999px";
    
    // 브라우저가 레이아웃을 재계산하도록 강제
    // offsetHeight 접근으로 reflow 발생
    // eslint-disable-next-line no-unused-expressions
    ref.offsetHeight;
    
    // scrollHeight 측정 (모든 콘텐츠 포함)
    const height = ref.scrollHeight;
    
    // max-height만 원래 값으로 복원 (transition은 그대로 none으로 유지)
    // transition은 recalculateAllHeights에서 높이 설정 시 활성화됨
    ref.style.maxHeight = originalMaxHeight;
    
    return height;
  };

  /**
   * 모든 열려있는 메뉴의 높이를 재계산하는 함수
   * @param {Object} expandedItemsState - 현재 expandedItems 상태
   */
  const recalculateAllHeights = (expandedItemsState) => {
    // 먼저 닫혀있는 메뉴는 max-height를 0으로 설정
    Object.keys(submenuRefs.current).forEach((key) => {
      const ref = submenuRefs.current[key];
      if (ref && !expandedItemsState[key]) {
        ref.style.maxHeight = "0";
      }
    });

    // 열려있는 메뉴를 3뎁스와 2뎁스로 분류
    const depth3Keys = []; // 3뎁스 메뉴 (submenu.id)
    const depth2Keys = []; // 2뎁스 메뉴 (menu.id)
    
    Object.keys(expandedItemsState).forEach((key) => {
      if (expandedItemsState[key]) {
        const parentId = findParentMenuId(key);
        if (parentId) {
          // 3뎁스 메뉴 (부모가 있음 = submenu.id)
          depth3Keys.push(key);
        } else {
          // 2뎁스 메뉴 (부모가 없음 = menu.id)
          depth2Keys.push(key);
        }
      }
    });

    // 1단계: 3뎁스 메뉴의 높이를 먼저 계산 (자식부터)
    // 각 메뉴를 개별적으로 처리하여 정확한 높이 측정
    depth3Keys.forEach((key) => {
      const ref = submenuRefs.current[key];
      if (ref) {
        // 높이 측정 (transition 비활성화 상태에서 측정)
        const height = measureHeight(ref);
        
        // transition을 다시 활성화하고 높이 설정
        // 이렇게 하면 0 또는 이전 높이에서 height로 부드럽게 transition
        ref.style.transition = "";
        ref.style.maxHeight = height + "px";
      }
    });

    // 2단계: 2뎁스 메뉴의 높이를 계산 (3뎁스 높이가 포함된 상태)
    // 3뎁스가 열려있으면 그 높이가 2뎁스의 scrollHeight에 포함됨
    depth2Keys.forEach((key) => {
      const ref = submenuRefs.current[key];
      if (ref) {
        // 높이 측정 (transition 비활성화 상태에서 측정)
        const height = measureHeight(ref);
        
        // transition을 다시 활성화하고 높이 설정
        // 이렇게 하면 0 또는 이전 높이에서 height로 부드럽게 transition
        ref.style.transition = "";
        ref.style.maxHeight = height + "px";
      }
    });
  };

  /**
   * 서브메뉴의 max-height 설정 (아코디언 애니메이션용)
   * expandedItems가 변경될 때마다 실행됨
   * 3뎁스가 열릴 때 2뎁스의 높이도 재계산되도록 처리
   */
  useEffect(() => {
    let rafId1 = null;
    let rafId2 = null;
    let timeoutId = null;
    let isCancelled = false;

    // requestAnimationFrame을 사용하여 DOM 업데이트 후 높이 재계산
    // 이중 requestAnimationFrame으로 브라우저 렌더링 완료 후 높이 계산
    const updateHeights = () => {
      // 취소되었으면 실행하지 않음
      if (isCancelled) return;

      // ref에서 최신 expandedItems 상태를 가져와서 일관성 보장
      const currentExpandedItems = expandedItemsRef.current;

      // 첫 번째 단계: DOM 업데이트 후 높이 재계산
      recalculateAllHeights(currentExpandedItems);

      // 두 번째 단계: 한 프레임 후 다시 한 번 재계산 (3뎁스 높이가 2뎁스에 반영되도록)
      rafId2 = requestAnimationFrame(() => {
        if (isCancelled) return;
        
        const latestExpandedItems = expandedItemsRef.current;
        recalculateAllHeights(latestExpandedItems);
        
        // 세 번째 단계: CSS transition이 거의 완료된 후 최종 재계산
        // transition이 0.3s이므로 350ms 후에 재계산
        timeoutId = setTimeout(() => {
          if (isCancelled) return;
          
          const finalExpandedItems = expandedItemsRef.current;
          recalculateAllHeights(finalExpandedItems);
        }, 350);
      });
    };

    // DOM 업데이트 후 높이 재계산
    rafId1 = requestAnimationFrame(() => {
      requestAnimationFrame(updateHeights);
    });

    // cleanup 함수: 컴포넌트 언마운트 또는 의존성 변경 시 실행 중인 애니메이션 취소
    return () => {
      isCancelled = true;
      if (rafId1 !== null) {
        cancelAnimationFrame(rafId1);
      }
      if (rafId2 !== null) {
        cancelAnimationFrame(rafId2);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [expandedItems]);

  // GNB 메뉴 데이터 (3뎁스 구조)
  const gnbMenu = [
    {
      id: "menu1",
      label: "메뉴 1",
      children: [
        {
          id: "submenu1-1",
          label: "서브메뉴 1-1",
          children: [
            { id: "depth3-1-1", label: "3뎁스 1-1-1", href: "#" },
            { id: "depth3-1-2", label: "3뎁스 1-1-2", href: "#" }
          ]
        },
        {
          id: "submenu1-2",
          label: "서브메뉴 1-2",
          children: [
            { id: "depth3-1-3", label: "3뎁스 1-2-1", href: "#" },
            { id: "depth3-1-4", label: "3뎁스 1-2-2", href: "#" }
          ]
        }
      ]
    },
    {
      id: "menu2",
      label: "메뉴 2",
      children: [
        {
          id: "submenu2-1",
          label: "서브메뉴 2-1",
          children: [
            { id: "depth3-2-1", label: "3뎁스 2-1-1", href: "#" },
            { id: "depth3-2-2", label: "3뎁스 2-1-2", href: "#" }
          ]
        },
        {
          id: "submenu2-2",
          label: "서브메뉴 2-2",
          children: [
            { id: "depth3-2-3", label: "3뎁스 2-2-1", href: "#" }
          ]
        }
      ]
    },
    {
      id: "menu3",
      label: "메뉴 3",
      children: [
        {
          id: "submenu3-1",
          label: "서브메뉴 3-1",
          href: "#"
        },
        {
          id: "submenu3-2",
          label: "서브메뉴 3-2",
          href: "#"
        }
      ]
    }
  ];

  /**
   * 부모 메뉴 ID 찾기 (3뎁스의 경우 2뎁스 ID 반환)
   * @param {string} childId - 자식 메뉴 ID
   * @returns {string|null} - 부모 메뉴 ID 또는 null
   */
  const findParentMenuId = (childId) => {
    for (const menu of gnbMenu) {
      if (menu.children) {
        for (const submenu of menu.children) {
          if (submenu.id === childId) {
            // 3뎁스의 부모인 2뎁스 ID 반환
            return menu.id;
          }
        }
      }
    }
    return null;
  };

  return (
    <header className="header">
      <div className="header__inner">
        {/* 로고 */}
        <div className="header__logo">
          <h1>스타벅스</h1>
        </div>

        {/* 햄버거 버튼 */}
        <button
          className={`header__hamburger ${isMenuOpen ? "is-active" : ""}`}
          onClick={toggleMenu}
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
        >
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </button>
      </div>

      {/* 모바일 사이드 메뉴 */}
      <aside className={`header__aside ${isMenuOpen ? "is-open" : ""}`}>
        <div className="header__aside-inner">
          {/* 닫기 버튼 */}
          <button
            className="header__aside-close"
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 메뉴 리스트 */}
          <nav className="header__nav">
            <ul className="header__nav-list">
              {/* GNB 메뉴 (3뎁스) */}
              {gnbMenu.map((menu) => (
                <li key={menu.id} className="header__nav-item header__nav-item--has-children">
                  <button
                    className="header__nav-link header__nav-link--expandable"
                    onClick={() => toggleExpanded(menu.id)}
                    aria-expanded={expandedItems[menu.id]}
                  >
                    {menu.label}
                    <span className="header__nav-arrow" aria-hidden="true">
                      <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>

                  {/* 2뎁스 메뉴 (아코디언 애니메이션) */}
                  {menu.children && (
                    <ul
                      ref={(el) => (submenuRefs.current[menu.id] = el)}
                      className={`header__nav-sublist ${expandedItems[menu.id] ? "is-open" : ""}`}
                    >
                      {menu.children.map((submenu) => (
                        <li key={submenu.id} className="header__nav-subitem">
                          {submenu.children ? (
                            <>
                              <button
                                className="header__nav-sublink header__nav-sublink--expandable"
                                onClick={() => toggleExpanded(submenu.id)}
                                aria-expanded={expandedItems[submenu.id]}
                              >
                                {submenu.label}
                                <span className="header__nav-arrow" aria-hidden="true">
                                  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                              </button>

                              {/* 3뎁스 메뉴 (아코디언 애니메이션) */}
                              {submenu.children && (
                                <ul
                                  ref={(el) => (submenuRefs.current[submenu.id] = el)}
                                  className={`header__nav-sublist header__nav-sublist--depth3 ${expandedItems[submenu.id] ? "is-open" : ""}`}
                                >
                                  {submenu.children.map((depth3) => (
                                    <li key={depth3.id} className="header__nav-subitem">
                                      <a
                                        href={depth3.href}
                                        className="header__nav-sublink"
                                        onClick={closeMenu}
                                      >
                                        {depth3.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <a
                              href={submenu.href}
                              className="header__nav-sublink"
                              onClick={closeMenu}
                            >
                              {submenu.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* 오버레이 */}
      {isMenuOpen && (
        <div
          className="header__overlay"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
}

export default Header;
