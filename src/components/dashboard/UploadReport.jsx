import { useRef, useState } from "react";

import {
  Upload,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useReports } from "../../context/ReportsContext";
import { useNotifications } from "../../context/NotificationsContext";

const UploadReport = () => {
  const { addReport } = useReports();
  const { addNotification } = useNotifications();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setErrorMessage("");
    setUploadSuccess(false);

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        "File is too large. The maximum allowed size is 10MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMessage("Please select a report before uploading.");
      return;
    }

    setErrorMessage("");

    const fileType = selectedFile.type.includes("image")
      ? "Imaging"
      : "Blood Test";

    const reportData = {
      name: selectedFile.name,
      type: fileType,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      doctor: "Uploaded by Patient",

      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      file: selectedFile,
    };

    const newReportId = addReport(reportData);

    addNotification({
      title: "New Report Uploaded",
      message: `Your report "${selectedFile.name}" was uploaded successfully.`,
      type: "report",
      path: `/patient/reports/${newReportId}`,
    });

    setSelectedFile(null);
    setUploadSuccess(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      setUploadSuccess(false);
    }, 4000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrorMessage("");
    setUploadSuccess(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="upload-report">
      <div className="upload-header">
        <div>
          <h2>Upload New Report</h2>

          <p>
            Upload your medical reports, lab results,
            or medical images.
          </p>
        </div>

        <div className="upload-icon">
          <Upload size={22} />
        </div>
      </div>

      <div
        className={`upload-dropzone ${
          errorMessage ? "upload-dropzone-error" : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          hidden
        />

        {!selectedFile ? (
          <>
            <div className="upload-main-icon">
              <Upload size={30} />
            </div>

            <h3>Click to upload your report</h3>

            <p>PDF, JPG, JPEG or PNG</p>

            <span>Maximum file size: 10MB</span>
          </>
        ) : (
          <div className="selected-file">
            <div className="selected-file-icon">
              {selectedFile.type.includes("image") ? (
                <Image size={25} />
              ) : (
                <FileText size={25} />
              )}
            </div>

            <div className="selected-file-info">
              <strong>{selectedFile.name}</strong>

              <span>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={(event) => {
                event.stopPropagation();
                removeFile();
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="upload-error">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {selectedFile && (
        <button
          type="button"
          className="upload-button"
          onClick={handleUpload}
        >
          <Upload size={18} />
          Upload Report
        </button>
      )}

      {uploadSuccess && (
        <div className="upload-success">
          <CheckCircle size={18} />

          <span>Report uploaded successfully!</span>
        </div>
      )}
    </section>
  );
};

export default UploadReport;