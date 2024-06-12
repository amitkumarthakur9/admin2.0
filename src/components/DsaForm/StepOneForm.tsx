import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Picker } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RemoteApi from '../../services/RemoteApi';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string().matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits').required('Mobile number is required'),
  panNumber: Yup.string().required('PAN is required'),
  pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be exactly 6 digits').required('Pincode is required'),
  country: Yup.string().required('Country is required'),
  arn: Yup.string().required('ARN is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  incomeRange: Yup.string().required('Income range is required'),
  education: Yup.string().required('Education is required'),
  occupation: Yup.string().required('Occupation is required'),
  addressLine1: Yup.string().max(300, 'Address line 1 cannot exceed 300 characters').required('Address line 1 is required'),
  addressLine2: Yup.string().max(300, 'Address line 2 cannot exceed 300 characters').required('Address line 2 is required'),
  addressLine3: Yup.string().max(300, 'Address line 3 cannot exceed 300 characters').required('Address line 3 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
});

const StepOneForm = ({ onNext }) => {
  return (
    <Formik
      initialValues={{
        fullName: 'Saffi',
        email: 'saffi@test.com',
        mobileNumber: '9876543210',
        panNumber: 'ASBV0897',
        pincode: '756110',
        country: 'India',
        arn: 'dafbldlbf',
        maritalStatus: 'Married',
        incomeRange: '0-10 Lacs',
        education: 'Graduation',
        occupation: 'Service',
        addressLine1: 'dkfd',
        addressLine2: 'dfas',
        addressLine3: 'dsaf',
        city: 'fdsf',
        state: 'Odisha',
      }}

      // initialValues={{
      //   fullName: '',
      //   email: '',
      //   mobileNumber: '',
      //   panNumber: '',
      //   pincode: '',
      //   country: '',
      //   arn: '',
      //   maritalStatus: '',
      //   incomeRange: '',
      //   education: '',
      //   occupation: '',
      //   addressLine1: '',
      //   addressLine2: '',
      //   addressLine3: '',
      //   city: '',
      //   state: '',
      // }}

      validationSchema={validationSchema}
      onSubmit={async (values) => {
        

        try {
          const response = await RemoteApi.post("/onboard/distributor", values);
          console.log(response);
          onNext();
        } catch (error) {
          console.error(error);
        }

        onNext();

      }}

      
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your full name as per PAN</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
              />
              {touched.fullName && errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter PAN</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('panNumber')}
                onBlur={handleBlur('panNumber')}
                value={values.panNumber}
              />
              {touched.panNumber && errors.panNumber && <Text style={styles.error}>{errors.panNumber}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your Mobile number</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('mobileNumber')}
                onBlur={handleBlur('mobileNumber')}
                value={values.mobileNumber}
                keyboardType="numeric"
              />
              {touched.mobileNumber && errors.mobileNumber && <Text style={styles.error}>{errors.mobileNumber}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter Pincode</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('pincode')}
                onBlur={handleBlur('pincode')}
                value={values.pincode}
                keyboardType="numeric"
              />
              {touched.pincode && errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your Country</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('country')}
                onBlur={handleBlur('country')}
                value={values.country}
              />
              {touched.country && errors.country && <Text style={styles.error}>{errors.country}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your ARN</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('arn')}
                onBlur={handleBlur('arn')}
                value={values.arn}
              />
              {touched.arn && errors.arn && <Text style={styles.error}>{errors.arn}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter Marital Status</Text>
              <Picker
                selectedValue={values.maritalStatus}
                style={styles.picker}
                onValueChange={handleChange('maritalStatus')}
              >
                <Picker.Item label="Married" value="Married" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
              {touched.maritalStatus && errors.maritalStatus && <Text style={styles.error}>{errors.maritalStatus}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Income Range</Text>
              <Picker
                selectedValue={values.incomeRange}
                style={styles.picker}
                onValueChange={handleChange('incomeRange')}
              >
                <Picker.Item label="0-10 Lacs" value="0-10 Lacs" />
                <Picker.Item label="10-15 Lacs" value="10-15 Lacs" />
                <Picker.Item label="15+ Lacs" value="15+ Lacs" />
              </Picker>
              {touched.incomeRange && errors.incomeRange && <Text style={styles.error}>{errors.incomeRange}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter Education</Text>
              <Picker
                selectedValue={values.education}
                style={styles.picker}
                onValueChange={handleChange('education')}
              >
                <Picker.Item label="10th" value="10th" />
                <Picker.Item label="Graduation" value="Graduation" />
                <Picker.Item label="Post Graduation" value="Post Graduation" />
              </Picker>
              {touched.education && errors.education && <Text style={styles.error}>{errors.education}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter Occupation</Text>
              <Picker
                selectedValue={values.occupation}
                style={styles.picker}
                onValueChange={handleChange('occupation')}
              >
                <Picker.Item label="Service" value="Service" />
                <Picker.Item label="Business" value="Business" />
              </Picker>
              {touched.occupation && errors.occupation && <Text style={styles.error}>{errors.occupation}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Address line 1</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('addressLine1')}
                onBlur={handleBlur('addressLine1')}
                value={values.addressLine1}
                maxLength={300}
              />
              {touched.addressLine1 && errors.addressLine1 && <Text style={styles.error}>{errors.addressLine1}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Address line 2</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('addressLine2')}
                onBlur={handleBlur('addressLine2')}
                value={values.addressLine2}
                maxLength={300}
              />
              {touched.addressLine2 && errors.addressLine2 && <Text style={styles.error}>{errors.addressLine2}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Address line 3</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('addressLine3')}
                onBlur={handleBlur('addressLine3')}
                value={values.addressLine3}
                maxLength={300}
              />
              {touched.addressLine3 && errors.addressLine3 && <Text style={styles.error}>{errors.addressLine3}</Text>}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                value={values.city}
              />
              {touched.city && errors.city && <Text style={styles.error}>{errors.city}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>State</Text>
              <Picker
                selectedValue={values.state}
                style={styles.picker}
                onValueChange={handleChange('state')}
              >
                <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
                <Picker.Item label="Assam" value="Assam" />
                <Picker.Item label="Bihar" value="Bihar" />
                <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
                <Picker.Item label="Goa" value="Goa" />
                <Picker.Item label="Gujarat" value="Gujarat" />
                <Picker.Item label="Haryana" value="Haryana" />
                <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
                <Picker.Item label="Jharkhand" value="Jharkhand" />
                <Picker.Item label="Karnataka" value="Karnataka" />
                <Picker.Item label="Kerala" value="Kerala" />
                <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
                <Picker.Item label="Maharashtra" value="Maharashtra" />
                <Picker.Item label="Manipur" value="Manipur" />
                <Picker.Item label="Meghalaya" value="Meghalaya" />
                <Picker.Item label="Mizoram" value="Mizoram" />
                <Picker.Item label="Nagaland" value="Nagaland" />
                <Picker.Item label="Odisha" value="Odisha" />
                <Picker.Item label="Punjab" value="Punjab" />
                <Picker.Item label="Rajasthan" value="Rajasthan" />
                <Picker.Item label="Sikkim" value="Sikkim" />
                <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                <Picker.Item label="Telangana" value="Telangana" />
                <Picker.Item label="Tripura" value="Tripura" />
                <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                <Picker.Item label="Uttarakhand" value="Uttarakhand" />
                <Picker.Item label="West Bengal" value="West Bengal" />
              </Picker>
              {touched.state && errors.state && <Text style={styles.error}>{errors.state}</Text>}
            </View>
          </View>

          <Button title="Generate Signed Document" onPress={handleSubmit} color="#0066cc" />
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066cc',
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  stepInactive: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepNumberInactive: {
    color: '#000',
    fontWeight: 'bold',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fieldContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});

export default StepOneForm;
