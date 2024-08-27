import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "../../../src/services/RemoteApi";
import * as DocumentPicker from "expo-document-picker";

const BankVerify = ({ onPrevious, onNext, initialValues }) => {
  const [pickedDocument, setPickedDocument] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [nameMismatch, setNameMismatch] = useState(true); // Example state, set as needed
  const [bankVerifyFailed, setBankVerifyFailed] = useState(true); // Example state, set as needed

  const validationSchema = Yup.object().shape({
    documentType: Yup.string().required("Document type is required"),
  });

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (result.type === "success") {
      setPickedDocument(result);
    }
  };

  const uploadDocument = async () => {
    if (!pickedDocument) return;

    let formData = new FormData();
    formData.append("file", {
      uri: pickedDocument.uri,
      name: pickedDocument.name,
      type: pickedDocument.mimeType,
    });

    try {
      const response = await RemoteApi.postWithFormData(
        "/file/upload-transaction",
        formData
      );

      // Handle success or error based on the response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Formik
      initialValues={{
        documentType: "",
        radioSelection: "nameAsPerBank",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (showBankDetails) {
          uploadDocument();
        }
        onNext(values); // Call onNext with the form values
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          {nameMismatch && !bankVerifyFailed ? (
            <>
              <Text style={styles.modalTitle}>Name Mismatch Found!</Text>
              <Text>
                Client’s bank details list the name as{" "}
                <Text style={{ fontWeight: "bold" }}>Saurabh Bajaj</Text>, while
                his/her PAN card shows{" "}
                <Text style={{ fontWeight: "bold" }}>Sourabh Bajaj</Text>. Please
                update the name to match exactly.
              </Text>

              <CustomRadioButton
                options={[
                  { label: "Change bank details", value: "changeBankDetails" },
                  {
                    label: "Consider client’s name as per bank records as official name",
                    value: "nameAsPerBank",
                  },
                ]}
                value={values.radioSelection}
                setValue={(value) => {
                  setFieldValue("radioSelection", value);
                  setShowBankDetails(value === "changeBankDetails");
                }}
              />

              {showBankDetails && (
                <View style={styles.bankDetails}>
                  <Text style={styles.label}>Document Type*</Text>
                  <DropdownComponent
                    label="Document Type"
                    data={[
                      { label: "PAN Card", value: "PAN" },
                      { label: "Aadhar Card", value: "AADHAR" },
                      // Add more options as required
                    ]}
                    value={values.documentType}
                    setValue={(value) => setFieldValue("documentType", value)}
                    containerStyle={styles.dropdown}
                  />
                  {touched.documentType && errors.documentType && (
                    <Text style={styles.error}>{errors.documentType}</Text>
                  )}

                  <TouchableOpacity onPress={pickDocument} style={styles.uploadBtn}>
                    <Text style={styles.uploadText}>
                      {pickedDocument ? pickedDocument.name : "Upload Document"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : null}

          {bankVerifyFailed ? (
            <>
              <Text style={styles.error}>Bank verification failure</Text>
              <View style={styles.bankDetails}>
                <Text style={styles.label}>Document Type*</Text>
                <DropdownComponent
                  label="Document Type"
                  data={[
                    { label: "Cancelled Cheque", value: "CANCELLED_CHEQUE" },
                    { label: "Bank Passbook", value: "BANK_PASSBOOK" },
                    // Add more options as required
                  ]}
                  value={values.documentType}
                  setValue={(value) => setFieldValue("documentType", value)}
                  containerStyle={styles.dropdown}
                />
                {touched.documentType && errors.documentType && (
                  <Text style={styles.error}>{errors.documentType}</Text>
                )}

                <TouchableOpacity onPress={pickDocument} style={styles.uploadBtn}>
                  <Text style={styles.uploadText}>
                    {pickedDocument ? pickedDocument.name : "Upload Document"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onPrevious} style={styles.skipButton}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#d32f2f",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  uploadBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  uploadText: {
    color: "#114EA8",
  },
  bankDetails: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  skipButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#114EA8",
    flexGrow: 1,
    marginRight: 10,
  },
  confirmButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#114EA8",
    flexGrow: 1,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});

export default BankVerify;
