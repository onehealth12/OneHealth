import {useState, React} from "react";
import Navbar from "../../components/Navbar";
import hero from "../../assets/Hero.png";
import { MdLocationOn } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsEnvelopeFill } from "react-icons/bs";
import obgynIcon from "../../assets/female_reproductive_system.svg";
import genMedIcon from "../../assets/stethoscope.svg";
import interMedIcon from "../../assets/viral_lung_infection.svg";
import pediaIcon from "../../assets/pediatrics.svg";
import { useNavigate } from "react-router-dom";



const PatientHome = () => {
  const [userRole, setUserRole] = useState("patient");
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/patient/book')
  }


  return (
    <>
      <div className="w-full h-screen">
      <Navbar userRole={userRole}/>

        {/**Hero */}
        <div className="h-[91vh]">
          <div className="flex text-left justify-center items-center h-full gap-8">
            <img src={hero} className="hidden md:block " width="400px" />
            <div>
              <h1 className="font-extrabold text-slate-500 text-lg">
                ONE CAINTA HOSPITAL
              </h1>
              <p className="font-semibold text-4xl">Welcome to OneHealth</p>
              <button  onClick={handleClick} className="bg-[#4867D6] uppercase w-full p-4 text-white mt-8">
                Book an appointment
              </button>
            </div>
          </div>
        </div>

        {/**Services */}
        <div className="md:h-screen bg-[#4867D6]">
          <div className="py-4 text-white ">
            <h1 className="font-bold text-4xl text-center pt-4 text-white mb-4">Our Services</h1>
            <p className="md:w-2/3 lg:w-3/5 mx-auto text-center">
              The Cainta Municipal Hospital is a government-owned, general,
              level 1 that provides free medigal and surgical treatment.
            </p>
          </div>
          <div className="grid mt-16 justify-items-center text-white md:grid-cols-4">
            <div className="grid grid-cols-1 justify-items-center py-8 px-4">
              <img src={genMedIcon} alt="" />
              <h1 className="text-2xl font-semibold uppercase text-center w-full">
                General Medicine
              </h1>
              <p className="italic font-light text-center">
                A specialty of medicine which involves in the prevention,
                diagnosis, and wide range treatment of both acute and chronic
                disease affecting different parts of the body that do not
                require surgery.
              </p>
            </div>
            <div className="grid grid-cols-1 justify-items-center py-8 px-4">
              <img src={obgynIcon} alt="" />
              <h1 className="text-2xl font-semibold uppercase text-center w-full">
                OB-GYN{" "}
              </h1>
              <p className="italic font-light text-center">
                Specializes in the health of females assigned at birth.
                Providing care related to biological functions such as
                menstruation, childbirth and menopause.
              </p>
            </div>
            <div className="grid grid-cols-1 justify-items-center py-8 px-4">
              <img src={pediaIcon} alt="" />
              <h1 className="text-2xl font-semibold uppercase text-center w-full">
                Pediatrics
              </h1>
              <p className="italic font-light text-center">
                A specialty cornered with physical, mental, and social health of
                children from birth to young adulthood. A broad spectrum of
                preventive health care to the diagnosis and treatment of acute
                and chronic diseases.
              </p>
            </div>
            <div className="grid grid-cols-1 justify-items-center py-8 px-4">
              <img src={interMedIcon} alt="" />
              <h1 className="text-2xl font-semibold uppercase text-center w-full">
                Internal Medicine
              </h1>
              <p className="italic font-light text-center">
                Specialize in diagnosis, and treatment of conditions that affect
                the internal organs. Conditions such as heart disease,
                hypertension, diabetes, obesity and lung disease.
              </p>
            </div>
          </div>
        </div>

        {/**Contact */}
        <div className="h-screen bg-[#4867D6] p-2">
          <div className="h-full flex justify-center items-center">
            <form>
              <div className="font-extrabold text-2xl text-white mb-4">
                <h1>Inquiries?</h1>
                <h1>Send us a message.</h1>
              </div>
              <div className=" grid grid-cols-2 gap-y-2 gap-x-4">
                <label className="text-white">Name</label>
                <label className="text-white">Email</label>
                <input className="p-2" type="text" placeholder="Enter name" />
                <input className="p-2" type="email" placeholder="Enter email" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-y-2 gap-x-4">
                <label className="text-white">Message</label>
                <textarea
                className="resize-none"
                  name=""
                  id=""
                  cols="30"
                  rows="5"
                  placeholder="Enter your message here"
                />
              </div>
              <div className="mt-4">
                <button className="bg-white w-full p-2">Submit</button>
              </div>
              <div className="grid grid-cols-3 justify-items-center mt-8 text-white">
                <div className="w-4/5 p-4 text-center">
                  <MdLocationOn
                    className="mx-auto"
                    color="white"
                    fontSize="3em"
                  />
                  <p className="break-words text-center">Municipal Compound, Brgy. Sto. Domingo, Cainta, Rizal</p>
                </div>
                <div className="w-4/5 p-4">
                  <BsFillTelephoneFill
                    className="mx-auto"
                    color="white"
                    fontSize="2.7em"
                  />
                  <p className="break-words text-center">8696-26-04 to 05</p>
                </div>
                <div className="w-4/5 p-4">
                  <BsEnvelopeFill
                    className="mx-auto"
                    color="white"
                    fontSize="2.7em"
                  />
                  <p className="break-words text-center">onecainta@gmail.com</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientHome;
