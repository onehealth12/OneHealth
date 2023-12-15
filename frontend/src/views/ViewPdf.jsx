import React, { useState, useEffect } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import Rx from "../assets/Rx.png";
import { useLocation } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    margin: 20,
    width: "90%",
    height: "90vh", // Adjust the height as needed
    position: "relative",
  },
  header: {
    height: "15vh",
    textAlign: "center",
  },
  medicineSection: {
    height: "85vh",
    marginBottom: 20, // Add bottom margin to create space
  },
  footer: {
    width: "30%",
    height: "20vh",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
};

const ViewPdf = () => {
  // Retrieve the appointment ID from react-router's location state
  const location = useLocation();
  const appointmentId = location.state.appointmentId;

  // State to store appointment data
  const [appointmentData, setAppointmentData] = useState(null);

  useEffect(() => {
    // Fetch the appointment data using the appointment ID
    axios
      .get(`http://localhost:5000/api/patient/appointment/${appointmentId}`)
      .then((res) => {
        // Set the appointment data in the state
        setAppointmentData(res.data);
      })
      .catch((err) => console.log(err));
  }, [appointmentId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div style={styles.container}>
      {appointmentData && (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <Document>
            <Page size="A4">
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={{ fontSize: 32, marginBottom: 10 }}>
                    One Cainta Hospital
                  </Text>
                  <Text style={{ fontSize: 12, marginBottom: 10 }}>
                    PhilHealth Accredited Level-1 Hospital
                  </Text>
                  <Text style={{ fontSize: 12, marginBottom: 10 }}>
                    Municipal Compound, Brgy. Sto. Domingo, Cainta, Rizal
                  </Text>
                  <Text style={{ fontSize: 12, marginBottom: 10 }}>
                    8696-26-04 to 05
                  </Text>
                </View>

                <View style={{ marginTop: 10, borderTop: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16, marginBottom: 5, flex: 1 }}>
                      Patient Name: {appointmentData.patientFirstName}{" "}
                      {appointmentData.patientLastName}
                    </Text>
                    <Text style={{ fontSize: 16, flex: 1 }}>
                      Date: {formatDate(appointmentData.prescription.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.medicineSection}>
                    <Image style={{ width: 100 }} src={Rx} />
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ flex: 1, fontSize: 16, fontWeight: "bold" }}
                      >
                        Medicine Name:
                      </Text>
                      <Text style={{ flex: 1, fontSize: 16 }}>Dosage:</Text>
                      <Text style={{ flex: 1, fontSize: 16 }}>Quantity:</Text>
                      <Text style={{ flex: 1, fontSize: 16 }}>Notes:</Text>
                    </View>
                    {appointmentData.prescription.medicines.map((medicine) => (
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            marginBottom: 5,
                            fontSize: 16,
                            fontWeight: "bold",
                            width: 200,
                            wordWrap: "break-word",
                          }}
                        >
                          {medicine.name}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 16,
                            width: 200,
                            wordWrap: "break-word",
                          }}
                        >
                          {medicine.dosage}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 16,
                            width: 200,
                            wordWrap: "break-word",
                          }}
                        >
                          {medicine.quantity}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 16,
                            width: 200,
                            wordWrap: "break-word",
                          }}
                        >
                          {medicine.notes}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.footer}>
                    {appointmentData.doctorId &&
                      appointmentData.doctorId.signature && (
                        <Image
                          style={{ width: "100%", height: 150 }}
                          src={appointmentData.doctorId.signature.url}
                        />
                      )}
                    {appointmentData.doctorId && (
                      <Text
                        style={{
                          marginBottom: 5,
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {appointmentData.doctorId.firstName}{" "}
                        {appointmentData.doctorId.lastName}, M.D.
                      </Text>
                    )}
                    {appointmentData.doctorId && (
                      <Text
                        style={{ marginTop: 15, marginBottom: 5, fontSize: 14 }}
                      >
                        Lic No.: {appointmentData.doctorId.licenseNumber}
                      </Text>
                    )}
                    {appointmentData.doctorId && (
                      <Text
                        style={{ marginTop: 15, marginBottom: 5, fontSize: 14 }}
                      >
                        PTR No.
                      </Text>
                    )}
                    {appointmentData.doctorId && (
                      <Text style={{ marginTop: 15, fontSize: 14 }}>
                        S2 No.
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  );
};

export default ViewPdf;
