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
} from "native-base";
import Modal from "../Modal/Modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";


export default function AddIFAUser() {
    const options = [
        { label: "RM 1", value: "ux" },
        { label: "RM 2", value: "web" },
        { label: "RM 3", value: "cross" },
        { label: "RM 4", value: "ui" },
        { label: "RM 5", value: "backend" },
    ];
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Select RM");
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState();
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        phone: null,
        arn: null,
        euin: null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: null,
        email: null,
        phone: null,
        arn: null,
        euin: null,
        rm: selectedValue,
    });

    const newErrors = {
        name: null,
        email: null,
        phone: null,
        arn: null,
        euin: null,
    }; // Initialize empty error object

    const [searchValue, setSearchValue] = useState("");
    const isSelectionValid = selectedValue !== undefined && selectedValue !== "";
    

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const validate = () => {
        // Name validation
        // if (!formData.name || formData.name.length < 3) {
        //     newErrors.name = !formData.name
        //         ? "Name is required"
        //         : "Name should contain at least 3 characters";
        // } else {
        //     newErrors.name = null; // Clear error message if validation passes
        // }

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = !formData.phone
                ? "Phone number is required"
                : "Please enter a valid 10-digit phone number";
        } else {
            newErrors.phone = null; // Clear error message if validation passes
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

    const handleOptionSelect = (option, optionValue) => {
        setSelectedOption(option);
        setValue(optionValue);
        setIsOpen(false);
    };

    const handleSelectChange = (value: string | undefined) => {
        setSelectedValue(value);
        setFormData(prevData => ({
            ...prevData,
            rm: value,
        }));
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSubmit = () => {
        // Set the form as submitted
        setIsSubmitted(true);

        // Perform validation
        const isValid = validate();

        if (isValid) {
            console.log("Submitted successfully");
            console.log(formData);
            // Reset submitted state and clear form data
            setIsSubmitted(false);
            setFormData({
                name: null,
                email: null,
                phone: null,
                arn: null,
                euin: null,
                rm: null,
            });
        } else {
            console.log("Validation failed");
        }
    };
    return (
        <>
            {/* <View className="flex flex-row lg:mt-0">
                <Pressable
                    onPress={showDialog}
                    className={
                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                    }
                    aria-require="addNewClient"
                >
                    <Icon name="plus" size={14} color="#484848" />

                    {<Text className="mx-2">Add IFA</Text>}
                </Pressable>
                <Portal>
                    <Dialog
                        visible={modalVisible}
                        onDismiss={hideDialog}
                        dismissable
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignSelf: "center",
                            width: 600,
                            height: "80%",
                            overflow: "scroll",
                            backgroundColor: "white",
                        }}
                    >
                        <View className="p-4">
                            <View className="flex flex-row justify-between">
                                <Text className="pl-4 text-lg font-bold">
                                    Add IFA
                                </Text>

                                <Pressable
                                    onPress={hideDialog}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                                    }
                                    aria-describedby="addNewClient"
                                >
                                    <Icon
                                        name="close"
                                        size={14}
                                        color="#484848"
                                    />
                                </Pressable>
                            </View>
                            <View className="flex flex-col items-center">
                                <View className="gap-4">
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.name !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Name
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Name as on PAN"
                                            value={formData.name}
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
                                                Name should contain at least 3
                                                characters.
                                            </FormControl.HelperText>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.email !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Email Address
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Email Address"
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
                                        isInvalid={errors.phone !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Mobile Number
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Mobile Number"
                                            value={formData.phone}
                                            onChangeText={(value) =>
                                                handleChange("phone", value)
                                            }
                                        />
                                        {errors.phone ? (
                                            <FormControl.ErrorMessage>
                                                {errors.phone}
                                            </FormControl.ErrorMessage>
                                        ) : (
                                            <FormControl.HelperText>
                                                Enter 10 digit phone Number.
                                            </FormControl.HelperText>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.phone !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            ARN Number
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="ARN Number"
                                            value={formData.arn}
                                            onChangeText={(value) =>
                                                handleChange("arn", value)
                                            }
                                        />
                                        {errors.arn ? (
                                            <FormControl.ErrorMessage>
                                                {errors.arn}
                                            </FormControl.ErrorMessage>
                                        ) : (
                                            <FormControl.HelperText></FormControl.HelperText>
                                        )}
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
                    </Dialog>
                </Portal>
            </View> */}

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
                            isInvalid={errors.email !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Email Address</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Email Address"
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
                            isInvalid={errors.phone !== null}
                            w="100%"
                            maxW="300px"
                        >
                            <FormControl.Label>Mobile Number</FormControl.Label>
                            <Input
                                size="lg"
                                variant="outline"
                                placeholder="Mobile Number"
                                value={formData.phone}
                                onChangeText={(value) =>
                                    handleChange("phone", value)
                                }
                            />
                            {errors.phone ? (
                                <FormControl.ErrorMessage>
                                    {errors.phone}
                                </FormControl.ErrorMessage>
                            ) : (
                                <FormControl.HelperText>
                                    Enter 10 digit phone Number.
                                </FormControl.HelperText>
                            )}
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={errors.phone !== null}
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
                            isInvalid={errors.phone !== null}
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
                            <View>
                                {/* <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChangeText={handleSearchChange}
                    mt={1}
                /> */}
                            </View>
                            <Select
                                minWidth={200}
                                accessibilityLabel="Relationship Manager"
                                placeholder="Relationship Manager"
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size={5} />,
                                }}
                                mt={1}
                                onValueChange={handleSelectChange}
                                
                            >
                                {filteredOptions.map((option) => (
                                    <Select.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                    />
                                ))}
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
