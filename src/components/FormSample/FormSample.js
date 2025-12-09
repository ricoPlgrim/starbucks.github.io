import { useState } from "react";
import "./FormSample.scss";

function FormSample() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "이름을 입력해주세요.";
    if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone)) nextErrors.phone = "휴대폰 번호를 010-1234-5678 형식으로 입력해주세요.";
    if (!form.address.trim()) nextErrors.address = "주소를 입력해주세요.";
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = "유효한 이메일을 입력해주세요.";
    if (form.password.length < 8) nextErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("유효성 검사가 완료되었습니다!");
    }
  };

  return (
    <form className="form-sample" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">이름</span>
        <input
          type="text"
          name="name"
          placeholder="홍길동"
          value={form.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
        />
        <small className={`field__help ${errors.name ? "is-error" : ""}`}>
          {errors.name || "본인 확인이 가능한 이름을 입력하세요."}
        </small>
      </label>

      <label className="field">
        <span className="field__label">휴대폰 번호</span>
        <input
          type="tel"
          name="phone"
          placeholder="010-1234-5678"
          value={form.phone}
          onChange={handleChange}
          aria-invalid={!!errors.phone}
        />
        <small className={`field__help ${errors.phone ? "is-error" : ""}`}>
          {errors.phone || "숫자만 입력해도 자동으로 처리됩니다."}
        </small>
      </label>

      <label className="field">
        <span className="field__label">주소</span>
        <input
          type="text"
          name="address"
          placeholder="도로명 주소를 입력하세요"
          value={form.address}
          onChange={handleChange}
          aria-invalid={!!errors.address}
        />
        <small className={`field__help ${errors.address ? "is-error" : ""}`}>
          {errors.address || "배송 또는 연락 가능한 주소를 입력하세요."}
        </small>
      </label>

      <label className="field">
        <span className="field__label">이메일</span>
        <input
          type="email"
          name="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
        />
        <small className={`field__help ${errors.email ? "is-error" : ""}`}>
          {errors.email || "가입 시 사용한 이메일을 입력하세요."}
        </small>
      </label>

      <label className="field">
        <span className="field__label">비밀번호</span>
        <input
          type="password"
          name="password"
          placeholder="8자 이상 입력"
          value={form.password}
          onChange={handleChange}
          aria-invalid={!!errors.password}
        />
        <small className={`field__help ${errors.password ? "is-error" : ""}`}>
          {errors.password || "문자, 숫자 조합으로 8자 이상 입력하세요."}
        </small>
      </label>

      <button type="submit" className="btn btn--primary btn--md">
        유효성 검사
      </button>
      {message && <p className="form-success">{message}</p>}
    </form>
  );
}

export default FormSample;

