import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PatientLayout = ({ children }) => {
  return (
    <div className="patient-layout">

      <Sidebar />

      <div className="patient-content">

        <Topbar />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default PatientLayout;