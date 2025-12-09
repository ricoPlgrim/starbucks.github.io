import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./SamplePage.scss";

const PlaceholderCard = ({ title, desc }) => (
  <div className="sample-card">
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const SampleFooter = () => (
  <footer className="sample-footer">
    <div className="sample-footer__inner">
      <div>
        <h5>Footer 영역</h5>
        <p>공통 푸터 컴포넌트를 대신할 샘플 섹션입니다.</p>
      </div>
      <div>
        <h5>링크</h5>
        <p>회사 정보 / 고객센터 등</p>
      </div>
    </div>
  </footer>
);

function SamplePage() {
  return (
    <div className="sample-page">
      <Header currentPage="sample" onPageChange={() => {}} />

      <main className="sample-main">
        <section className="sample-hero">
          <div className="sample-hero__text">
            <p className="badge">Page Template</p>
            <h1>프로젝트용 샘플 페이지</h1>
            <p className="lead">헤더/푸터는 공통 컴포넌트, 본문은 자유롭게 교체할 수 있도록 만든 기본 레이아웃입니다.</p>
            <div className="actions">
              <button className="btn btn--primary btn--md">Primary CTA</button>
              <button className="btn btn--secondary btn--md">Secondary</button>
            </div>
          </div>
          <div className="sample-hero__placeholder">
            <p className="label">비주얼 영역</p>
            <p className="hint">배너 / 이미지 / 그래프 등을 배치하세요.</p>
          </div>
        </section>

        <section className="sample-section">
          <div className="section-head">
            <h3>콘텐츠 영역</h3>
            <p>필요한 모듈을 자유롭게 배치할 공간입니다.</p>
          </div>
          <div className="sample-grid">
            <PlaceholderCard title="블록 1" desc="여기에 카드형 콘텐츠를 배치합니다." />
            <PlaceholderCard title="블록 2" desc="리스트, 표, 폼 등을 넣을 수 있습니다." />
            <PlaceholderCard title="블록 3" desc="그래프, 배너 등 원하는 모듈을 추가하세요." />
          </div>
        </section>

        <section className="sample-section sample-cta">
          <div>
            <h3>CTA 영역</h3>
            <p>프로젝트별 목표 행동을 넣어주세요.</p>
          </div>
          <div className="actions">
            <button className="btn btn--primary btn--md">주요 액션</button>
            <button className="btn btn--ghost btn--md">보조 액션</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SamplePage;

