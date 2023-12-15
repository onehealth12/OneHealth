import { Route, Routes } from "react-router-dom";
import PatientLogin from "./views/patient/PatientLogin";
import PatientDashboard from "./views/patient/PatientDashboard";
import PatientCreateAppointment from "./views/patient/PatientCreateAppointment";
import PatientRegister from "./views/patient/PatientRegister";
import PatientHome from "./views/patient/PatientHome";
import PatientProfile from "./views/patient/PatientProfile";
import AddAnnouncement from "./views/admin/announcement/AddAnnouncement";
import ManageAnnouncement from "./views/admin/announcement/ManageAnnouncement";
import ManageDepartment from "./views/admin/department/Department";
import AddDoctor from "./views/admin/doctor/AddDoctor";
import ManageDoctor from "./views/admin/doctor/ManageDoctor";
import AddNurse from "./views/admin/nurse/AddNurse";
import ManageNurse from "./views/admin/nurse/ManageNurse";
import ManageStaff from "./views/admin/staff/Staff";
import HospitalLogin from "./views/auth/HospitalLogin";
import DocHistory from "./views/doctor/DocHistory";
import DocTracker from "./views/doctor/DocTracker";
import ManageSchedule from "./views/doctor/ManageSchedule";
import FindAppointment from "./views/staff/appointment/FindAppointment";
import CreateAppointment from "./views/staff/appointment/CreateAppointment";
import DoctorInformation from "./views/staff/doctor/DoctorInformation";
import CreatePatient from "./views/staff/patient/CreatePatient";
import FindPatient from "./views/staff/patient/FindPatient";
import ViewPdf from "./views/ViewPdf";
import NurseTracker from "./views/nurse/NurseTracker";
import DoctorDashboard from "./views/doctor/DoctorDashboard";
import ReceptionistDashboard from "./views/staff/ReceptionistDashboard";
import DianosisList from "./views/admin/diagnosis/DianosisList";
import DocScanner from "./views/doctor/DocScanner";
import NurseScanner from "./views/nurse/NurseScanner";
import ReceptionistScanner from "./views/staff/ReceptionistScanner";
import AddMedTech from "./views/admin/medTech/AddMedTech";
import ManageMedTech from "./views/admin/medTech/ManageMedTech";
import AddRadTech from "./views/admin/radTech/AddRadTech";
import ManageRadTech from "./views/admin/radTech/ManageRadTech";
import MedTechTracker from "./views/medTech/MedTechTracker";
import MedTechScanner from "./views/medTech/MedTechScanner";
import RadTechScanner from "./views/radTech/RadTechScanner";
import RadTechTracker from "./views/radTech/RadTechTracker";

function App() {
  return (
    <>
      <Routes>
        {/**Visitor Routes */}
        <Route path="/pdf" element={<ViewPdf />} />
        <Route path="/" element={<PatientHome />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />

        {/**Patient Routes */}
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route
          path="/patient/view-appointment"
          element={<PatientDashboard />}
        />
        <Route path="/patient/book" element={<PatientCreateAppointment />} />

        {/**Hospital Auth */}
        <Route path="/hospital/auth/login" element={<HospitalLogin />} />
        {/**Admin Routes */}
        <Route path="/hospital/admin/diagnosis" element={<DianosisList />} />
        <Route
          path="/hospital/admin/announcement/add"
          element={<AddAnnouncement />}
        />
        <Route
          path="/hospital/admin/announcement/manage"
          element={<ManageAnnouncement />}
        />
        <Route path="/hospital/admin" element={<ManageDepartment />} />
        <Route path="/hospital/admin/doctor/add" element={<AddDoctor />} />
        <Route
          path="/hospital/admin/doctor/manage"
          element={<ManageDoctor />}
        />
        <Route path="/hospital/admin/nurse/add" element={<AddNurse />} />
        <Route path="/hospital/admin/nurse/manage" element={<ManageNurse />} />
        <Route path="/hospital/admin/staff/manage" element={<ManageStaff />} />
        <Route path="/hospital/admin/medtech/add" element={<AddMedTech />} />
        <Route
          path="/hospital/admin/medtech/manage"
          element={<ManageMedTech />}
        />
        <Route path="/hospital/admin/radtech/add" element={<AddRadTech />} />
        <Route
          path="/hospital/admin/radtech/manage"
          element={<ManageRadTech />}
        />

        {/**Doctor Routes */}
        <Route path="hospital/doctor/scanner" element={<DocScanner />} />
        <Route path="/hospital/doctor" element={<DoctorDashboard />} />
        <Route path="/hospital/doctor/tracker" element={<DocTracker />} />
        <Route path="/hospital/doctor/appointments" element={<DocHistory />} />
        <Route
          path="/hospital/doctor/availability"
          element={<ManageSchedule />}
        />

        {/**Nurse Routes */}
        <Route path="/hospital/nurse/" element={<NurseTracker />} />
        <Route path="/hospital/nurse/scanner" element={<NurseScanner />} />

        {/**Med Tech Routes */}
        <Route path="/hospital/medtech/" element={<MedTechTracker />} />
        <Route path="/hospital/medtech/scanner" element={<MedTechScanner />} />

        {/*Rad Tech Routes */}
        <Route path="/hospital/radtech/" element={<RadTechTracker />} />
        <Route path="/hospital/radtech/scanner" element={<RadTechScanner />} />

        {/**Receptionist Routes */}
        <Route
          path="/hospital/receptionist/"
          element={<ReceptionistDashboard />}
        />
        <Route
          path="/hospital/receptionist/appointment"
          element={<FindAppointment />}
        />
        <Route
          path="/hospital/receptionist/appointment/create"
          element={<CreateAppointment />}
        />
        <Route
          path="/hospital/receptionist/doctor"
          element={<DoctorInformation />}
        />
        <Route
          path="/hospital/receptionist/patient/create"
          element={<CreatePatient />}
        />
        <Route
          path="/hospital/receptionist/patient/find"
          element={<FindPatient />}
        />
        <Route
          path="/hospital/receptionist/scanner"
          element={<ReceptionistScanner />}
        />
      </Routes>
    </>
  );
}

export default App;
