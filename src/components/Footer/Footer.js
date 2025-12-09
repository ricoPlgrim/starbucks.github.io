import "./Footer.scss";

const defaultNav = [
  { label: "회사소개", href: "#" },
  { label: "개인정보처리방침", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "문의하기", href: "#" },
];

const defaultInfo = {
  address: "서울시 어딘가 123, 스타벅스코리아",
  contact: "고객센터 1234-5678 | support@starbucks.co.kr",
};

const defaultSns = ["Instagram", "Facebook", "Youtube"];

function Footer({ nav = defaultNav, info = defaultInfo, sns = defaultSns, logo = "스타벅스" }) {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__logo">{logo}</div>
        <nav className="footer__nav" aria-label="푸터 메뉴">
          {nav.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer__bottom">
        <div className="footer__info">
          <p>{info.address}</p>
          <p>{info.contact}</p>
        </div>
        <div className="footer__sns" aria-label="소셜 링크">
          {sns.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

