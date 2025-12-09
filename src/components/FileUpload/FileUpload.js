import { useState } from "react";
import "./FileUpload.scss";

const MAX_SIZE = 300 * 1024 * 1024; // 300MB
const allowedTypes = ["application/pdf"];

const isAllowed = (file) => file.type.startsWith("image/") || allowedTypes.includes(file.type);

const formatSize = (bytes) => {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

function FileUpload() {
  const [fileInfo, setFileInfo] = useState(null);

  const handleClear = () => {
    setFileInfo(null);
    const input = document.getElementById("component-file-input");
    if (input) input.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      alert("최대 300MB까지 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

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

  return (
    <div className="file-upload-demo">
      <div className="file-upload-demo__field">
        <label className="file-upload-demo__label" htmlFor="component-file-input">
          파일 첨부
        </label>
        <input
          id="component-file-input"
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
  );
}

export default FileUpload;

