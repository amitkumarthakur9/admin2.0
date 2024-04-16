import React, { useEffect, useState } from "react";
import { Alert, TextInput, View } from "react-native";
import {
    Box,
    Button,
    Center,
    CheckCircleIcon,
    FormControl,
    HStack,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    Menu,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    WarningIcon,
    WarningOutlineIcon,
    Select,
    CheckIcon,
    useToast,
    Radio,
} from "native-base";
import Modal from "../Modal/Modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import RemoteApi from "../../services/RemoteApi";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";
import CalendarPicker from "../CustomDatePicker/CalendarPicker";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import { RMid } from "../../helper/helper";
// import DatePicker from "react-native-datepicker";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

export default function AddIFAUser() {
    const options = [
        { label: "Relationship Manager", value: "238" },
        // { label: "RM 2", value: "230" },
        // { label: "RM 3", value: "249" },
        // { label: "RM 4", value: "259" },
        // { label: "RM 5", value: "245" },
    ];
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState();
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        mobileNumber: null,
        arn: null,
        euin: null,
        rm: null,
        sexId: null,
        dateOfBirth: null,
        panNumber: null,
        password: null,
        confirmPassword: null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
//    const [role, setRole] = useState("");
   const role = RMid();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        arn: "",
        euin: "",
        rm: selectedValue,
        sexId: "",
        dateOfBirth: "",
        panNumber: "",
        password: "",
        confirmPassword: "",
    });
    // const [formData, setFormData] = useState({
    //     name: "Saffi",
    //     email: "Saffi@gmail.com",
    //     mobileNumber: "1234567898",
    //     arn: "ADFG1234",
    //     euin: "123456",
    //     rm: selectedValue,
    //     sexId: "0",
    //     dateOfBirth: "1990-03-23",
    //     panNumber: "CVBHG1234T",
    //     password: "fkdbfk",
    //     confirmPassword: "fkdbfk",
    // });

    const toast = useToast();
    const [toasts, setToasts] = useState([]);
    const newErrors = {
        name: null,
        email: null,
        mobileNumber: null,
        arn: null,
        euin: null,
        rm: null,
        sexId: null,
        dateOfBirth: null,
        panNumber: null,
        password: null,
        confirmPassword: null,
    }; // Initialize empty error object

    const [searchValue, setSearchValue] = useState("");
    const isSelectionValid =
        selectedValue !== undefined && selectedValue !== "";

        // useEffect(() => {

            

        //     setSelectedValue(role.rmID);
        //     // setFormData((prevData) => ({
        //     //     ...prevData,
        //     //     [rm]: role.rmID,
        //     // }));

        // }, []);


    useEffect(() => {
        // Clear existing toasts
        toast.closeAll();

        // Show the latest toast
        if (toasts.length > 0) {
            const latestToast = toasts[toasts.length - 1];
            toast.show({
                render: () => (
                    <ToastAlert
                        id={latestToast.id}
                        variant={latestToast.variant}
                        title={latestToast.title}
                        description=""
                        isClosable={false}
                        toast={toast}
                        status={latestToast.status}
                        onClose={() => removeToast(latestToast.id)} // Remove the toast from the 'toasts' array when closed
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dateOfBirth: date, // Update the date of birth in the form data
        });
    };

    const validate = () => {
        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required";
        } else {
            newErrors.name = null; // Clear error message if validation passes
        }

        if (!formData.arn) {
            newErrors.arn = "ARN is required";
        } else {
            newErrors.arn = null; // Clear error message if validation passes
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

        if (!panRegex.test(formData.panNumber)) {
            newErrors.panNumber = !formData.panNumber
                ? "PAN number is required"
                : "Please enter a valid PAN number. Ex: AAAPZ1234C";
        } else {
            newErrors.panNumber = null; // Clear error message if validation passes
        }

        const dobRegex =
            /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

        if (!dobRegex.test(formData.dateOfBirth)) {
            newErrors.dateOfBirth = !formData.dateOfBirth
                ? "Date of birth is required"
                : "Please enter a valid format YYYY-MM-DD";
        } else {
            const minDate = new Date("1900-01-01");
            const inputDate = new Date(formData.dateOfBirth);
            if (inputDate < minDate) {
                newErrors.dateOfBirth =
                    "Date of birth must be after 1990-01-01";
            } else {
                newErrors.dateOfBirth = null; // Clear error message if validation passes
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else {
            newErrors.password = null; // Clear error message if validation passes
        }

        if (
            !formData.confirmPassword ||
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = !formData.confirmPassword
                ? "Confirm the Password"
                : "Password is mismatched";
        } else {
            newErrors.confirmPassword = null; // Clear error message if validation passes
        }

        // mobileNumber number validation
        const mobileNumberRegex = /^\d{10}$/;
        if (!mobileNumberRegex.test(formData.mobileNumber)) {
            newErrors.mobileNumber = !formData.mobileNumber
                ? "mobileNumber number is required"
                : "Please enter a valid 10-digit mobileNumber number";
        } else {
            newErrors.mobileNumber = null; // Clear error message if validation passes
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = !formData.email
                ? "Email is required"
                : "Please enter a valid email address";
        } else {
            newErrors.email = null; // Clear error message if validation passes
        }

        const euinRegex = /^\d{6}$/;
        if (!euinRegex.test(formData.euin)) {
            newErrors.euin = !formData.euin
                ? "EUIN number is required"
                : "Please enter a valid 6-digit EUIN number";
        } else {
            newErrors.euin = null; // Clear error message if validation passes
        }

        // const arnRegex = /^[A-Z]{4}\d{5}[A-Z]{1}$/; // Example ARN format: ABCD12345E
        // if (!arnRegex.test(formData.arn)) {
        //     newErrors.arn = !formData.arn
        //         ? "ARN number is required"
        //         : "Please enter a valid ARN (AMFI Registration Number)";
        // } else {
        //     newErrors.arn = null; // Clear error message if validation passes
        // }

        // Update the error state
        setErrors(newErrors);

        // Return validation result
        return Object.values(newErrors).every((error) => error === null); // Return true if there are no errors
    };

    const handleChange = (key, value) => {
        if (isSubmitted) {
            // If the form has been submitted, clear validation errors on change
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: null,
            }));
        }

        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));

        setIsSubmitted(false);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSelectChange = (value: string | undefined) => {
        console.log("rm" + value);
        setSelectedValue(value);
        setFormData((prevData) => ({
            ...prevData,
            rm: value,
        }));
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSubmit = async () => {
        // Set the form as submitted
        setIsSubmitted(true);

        // Perform validation
        const isValid = validate();

        if (isValid) {
            // const data = {
            //     userInfo: {
            //         name: formData.name,
            //         panNumber: formData.panNumber,
            //         dateOfBirth: formData.dateOfBirth,
            //         sexId: formData.sexId,
            //     },
            //     credentials: {
            //         email: formData.email,
            //         mobileNumber: formData.mobileNumber,
            //         password: formData.name,
            //     },
            //     distributorInfo: {
            //         arn: formData.arn,
            //         euin: formData.euin,
            //     },
            // };

            const data = {
                name: formData.name,
                panNumber: formData.panNumber,
                dateOfBirth: formData.dateOfBirth,
                sexId: parseInt(formData.sexId),
                email: formData.email,
                password: formData.password,
                mobileNumber: formData.mobileNumber,
                arn: "arn-" + formData.arn,
                euin: formData.euin,
                assignedTo: parseInt(formData.rm),
            };

            try {
                console.log("SubmitFormdata");
                console.log(data);

                const response: any = await RemoteApi.post(
                    "/onboard/distributor",
                    data
                );

                // const response = {
                //     message: "Error in Adding User.",
                //     code: 425,
                //     errors: [{ message: "dfdemail" }],
                // };

                // const response = {
                //     message: "Success",
                //     code: 200,
                //     errors: [{ message: "dfdemail" }],
                // };

                if (response?.message == "Success") {
                    const uniqueId = uuidv4();
                    // alert("IFA added succesfully");
                    // Add the success toast to the toasts array in the component's state
                    setToasts([
                        ...toasts,
                        {
                            id: uniqueId,
                            variant: "solid",
                            title: `IFA addedd successfully`,
                            status: "success",
                        },
                    ]);
                } else if (
                    response?.message == "Error in Adding User." ||
                    response?.code == 425
                ) {
                    const uniqueId = uuidv4();

                    const errorMessage = response?.errors[0]?.message;

                    const fieldsToCheck = [
                        "email",
                        "mobileNumber",
                        "arn",
                        "euin",
                        "panNumber",
                    ];

                    let message;

                    if (errorMessage) {
                        // Check if any of the fields are mentioned in the error message
                        const mentionedField = fieldsToCheck.find((field) =>
                            errorMessage.includes(field)
                        );

                        // If a mentioned field is found, assign it to the message variable
                        if (mentionedField) {
                            message = mentionedField;
                        } else {
                            // Handle the case where none of the fields are mentioned in the error message
                            message = "Unknown error"; // Or whatever you want to assign in this case
                        }
                    } else {
                        // Handle the case where there is no error message
                        message = "No error message";
                    }

                    // Now you can use the `message` variable as needed
                    console.log(message);
                    // alert("IFA added Succesfully");

                    setToasts([
                        ...toasts,
                        {
                            id: uniqueId,
                            variant: "solid",
                            title: `${message} alreay in Database`,
                            status: "error",
                        },
                    ]);
                }
            } catch (error) {
                // const uniqueId = uuidv4();
                // setToasts([
                //     ...toasts,
                //     {
                //         id: uniqueId,
                //         variant: "solid",
                //         title: "error",
                //         status: "error",
                //     },
                // ]);
            }

            // console.log("Submitted successfully");
            // console.log(formData);
            // Reset submitted state and clear form data
            setIsSubmitted(false);
            setFormData({
                name: "",
                email: "",
                mobileNumber: "",
                arn: "",
                euin: "",
                rm: "0",
                sexId: "1",
                dateOfBirth: "",
                panNumber: "",
                password: "",
                confirmPassword: "",
            });

           
        } else {
            console.log("Validation failed");
        }
    };
    return (
        <>
            
            <View
                className={
                    "mt-4 z-[-1] w-[90%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px]"
                }
            >
                <View className="flex flex-col items-center p-4">
                    <View className="gap-4">
                        <FormControl
                            isRequired
                            isInvalid={errors.name !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Name</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Name as on PAN"
                                value={formData.name}
                                aria-label="Name"
                                aria-labelledby="NameLabel"
                                onChangeText={(value) =>
                                    handleChange("name", value)
                                }
                            />
                            {errors.name ? (
                                <FormControl.ErrorMessage>
                                    {errors.name}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    Name as on PAN Card
                                </FormControl.HelperText>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.panNumber !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>PAN Number</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="PAN Number"
                                value={formData.panNumber}
                                aria-label="Pan Number"
                                onChangeText={(value) =>
                                    handleChange("panNumber", value)
                                }
                            />
                            {"panNumber" in errors && (
                                <FormControl.ErrorMessage>
                                    {errors.panNumber}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.sexId !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Gender</FormControl.Label>
                            <HStack space={4}>
                                <Radio.Group
                                    name="gender"
                                    value={formData.sexId}
                                    aria-label="Gender"
                                    onChange={(value) =>
                                        handleChange("sexId", value)
                                    }
                                >
                                    <HStack space={4}>
                                        <Radio value="1">Male</Radio>
                                        <Radio value="2">Female</Radio>
                                    </HStack>
                                </Radio.Group>
                            </HStack>
                            {"sexId" in errors && (
                                <FormControl.ErrorMessage>
                                    {errors.sexId}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.dateOfBirth !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Date of Birth</FormControl.Label>
                            
                            <CalendarSinglePicker
                                value={formData.dateOfBirth}
                                handleFilterChange={(value) =>
                                    handleChange("dateOfBirth", value)
                                }
                               
                            />
                            {errors.dateOfBirth ? (
                                <FormControl.ErrorMessage>
                                    {errors.dateOfBirth}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    
                                </FormControl.HelperText>
                            )}
                            
                        </FormControl>

                        <FormControl
                            isRequired
                            isInvalid={errors.email !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Email Address</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Email Address"
                                aria-label="Email Address"
                                value={formData.email}
                                onChangeText={(value) =>
                                    handleChange("email", value)
                                }
                            />
                            {"email" in errors && (
                                <FormControl.ErrorMessage>
                                    {errors.email}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.password !== null}
                            w="100%"
                            maxW="300px"
                            style={{ marginTop: 10 }}
                        >
                            <FormControl.Label>Password</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Password"
                                value={formData.password}
                                aria-label="Password"
                                onChangeText={(value) =>
                                    handleChange("password", value)
                                }
                                secureTextEntry={!passwordVisible}
                                InputRightElement={
                                    <Pressable
                                        onPress={togglePasswordVisibility}
                                        style={{ paddingRight: 4 }}
                                    >
                                        <Icon
                                            name={
                                                passwordVisible
                                                    ? "eye"
                                                    : "eye-slash"
                                            }
                                            size={20}
                                            color="#484848"
                                        />
                                    </Pressable>
                                }
                            />
                            {"password" in errors && (
                                <FormControl.ErrorMessage>
                                    {errors.password}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.confirmPassword !== null}
                            w="100%"
                            maxW="300px"
                            style={{ marginTop: 10 }}
                        >
                            <FormControl.Label>
                                Confirm Password
                            </FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                aria-label="Confirm Password"
                                onChangeText={(value) =>
                                    handleChange("confirmPassword", value)
                                }
                                secureTextEntry={!passwordVisible}
                            />
                            {"confirmPassword" in errors && (
                                <FormControl.ErrorMessage>
                                    {errors.confirmPassword}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.mobileNumber !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Mobile Number</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Mobile Number"
                                aria-label="Mobile Numbe"
                                value={formData.mobileNumber}
                                onChangeText={(value) =>
                                    handleChange("mobileNumber", value)
                                }
                            />
                            {errors.mobileNumber ? (
                                <FormControl.ErrorMessage>
                                    {errors.mobileNumber}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    Enter 10 digit mobileNumber Number.
                                </FormControl.HelperText>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.arn !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>ARN</FormControl.Label>
                            <InputGroup
                                w={{
                                    base: "70%",
                                    md: "287",
                                }}
                                justifyContent=""
                            >
                                <InputLeftAddon children={"ARN -"} />
                                <Input
                                    size="lg"
                                    variant="outline"
                                    placeholder="ARN Number"
                                    value={formData.arn}
                                    aria-label="ARN number"
                                    onChangeText={(value) =>
                                        handleChange("arn", value)
                                    }
                                />
                            </InputGroup>

                            {errors.arn ? (
                                <FormControl.ErrorMessage>
                                    {errors.arn}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    Enter your ARN (AMFI Registration Number)
                                </FormControl.HelperText>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.euin !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>EUIN Number</FormControl.Label>
                            <InputGroup
                                w={{
                                    base: "70%",
                                    md: "287",
                                }}
                                justifyContent=""
                            >
                                <InputLeftAddon children={"E"} />
                                <Input
                                    size="lg"
                                    variant="outline"
                                    placeholder="EUIN Number"
                                    aria-label="EUIN Number"
                                    value={formData.euin}
                                    onChangeText={(value) =>
                                        handleChange("euin", value)
                                    }
                                />
                            </InputGroup>

                            {errors.euin ? (
                                <FormControl.ErrorMessage>
                                    {errors.euin}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    Enter 6 digit Employee Unique Identification
                                    Number.
                                </FormControl.HelperText>
                            )}
                        </FormControl>
                        <FormControl
                            w="3/4"
                            maxW="300"
                            isRequired
                            isInvalid={isSubmitted == true}
                        >
                            <FormControl.Label>
                                Choose Relationship Manager
                            </FormControl.Label>
                            <View></View>
                            <Select
                                minWidth={200}
                                accessibilityLabel="Relationship Manager"
                                placeholder="Relationship Manager"
                                aria-label="Relationship Manager"
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size={5} />,
                                }}
                                mt={1}
                                onValueChange={handleSelectChange}
                            >
                                {role?.roldeID == 3
                                    ?
                                    <Select.Item
                                        key={role?.roldeID}
                                        label="Self"
                                        value={role?.rmID}
                                    />
                                    
                                    : 

                                    filteredOptions.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            label={option.label}
                                            value={option.value}
                                        />
                                    ))
                                }
                                
                            </Select>
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                "Please make a selection!"
                            </FormControl.ErrorMessage>
                            <FormControl.HelperText>
                                {filteredOptions.length === 0 &&
                                    "No options found"}
                            </FormControl.HelperText>
                        </FormControl>
                        <Button
                            width="100%"
                            bgColor={"#013974"}
                            onPress={handleSubmit}
                        >
                            Submit
                        </Button>
                    </View>
                </View>
            </View>
        </>
    );
}
