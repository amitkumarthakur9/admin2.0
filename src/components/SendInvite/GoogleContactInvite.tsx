import React, { useEffect, useState } from "react";
import {
    View,
    Button,
    Linking,
    FlatList,
    TouchableOpacity,
    Platform,
    ScrollView,
    TextInput,
    Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import ManualInvite from "./ManualInvite";
import { Dialog, Portal } from "react-native-paper";
import RemoteApi from "../../../src/services/RemoteApi";
import {
    Center,
    HStack,
    Spinner,
    Heading,
    VStack,
    Checkbox,
    Text,
    Select,
    CheckIcon,
} from "native-base";
import ContactDataTable from "./ContactDataTable";

const GoogleContactInvite = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [inviteModalVisible, setModalVisible] = useState(false);

    const [GooglemodalVisible, setGooglemodalVisible] = useState(false);
    const [filteredContacts, setFilteredContacts] = useState(contacts);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("All");

    const showDialog = (key: string) => {
        if (key === "invite") {
            setModalVisible(true);
        } else {
            setGooglemodalVisible(true);
        }
    };

    const hideDialog = (key: string) => {
        if (key === "invite") {
            setModalVisible(false);
        } else {
            setUserInfo(null);
            setGooglemodalVisible(false);
        }
    };

    // const hideDialog = () => setModalVisible(false);

    const redirectUri = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
    // const redirectUri = "https://vision.kcp.com.in/invite-contact"; // Replace with your redirect URI

    useEffect(() => {
        const getCurrentUrl = async () => {
            try {
                const currentUrl = await Linking.getInitialURL();
                console.log("Current URL:", currentUrl);

                setNowCurrentUrl(currentUrl);

                if (currentUrl) {
                    const params = new URLSearchParams(
                        currentUrl.split("?")[1]
                    );
                    const code = params.get("code");
                    console.log("Code:", code);

                    if (code) {
                        // Save the code parameter to AsyncStorage
                        // await AsyncStorage.setItem("Google_access_token", code);
                        // console.log("Code saved to AsyncStorage");
                    }

                    // getGoogleContacts(code);
                    exchangeCodeForToken(code);
                }
            } catch (error) {
                console.error("Error getting current URL:", error);
            }
        };

        getCurrentUrl();
    }, [nowCurrentUrl]);

    useEffect(() => {}, []);

    const exchangeCodeForToken = async (code) => {
        try {
            const clientId =
                "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
            const clientSecret = "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"; // Replace with your Google OAuth client secret
            // const redirectUri = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
            // const redirectUri = "https://vision.kcp.com.in/invite-contact"; // Replace with your redirect URI

            const response = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        code: code,
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirectUri,
                        grant_type: "authorization_code",
                    }),
                }
            );

            if (response.ok) {
                const { access_token } = await response.json();

                // Pass the access token to getGoogleContacts to fetch contacts
                await getGoogleContacts(access_token);

                // Fetch user info
                const userInfoResponse = await fetch(
                    "https://www.googleapis.com/oauth2/v1/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();

                    setUserInfo(userInfo);
                } else {
                    console.error(
                        "Failed to fetch user info:",
                        userInfoResponse.statusText
                    );
                }
            } else {
                console.error(
                    "Failed to exchange code for token:",
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error exchanging code for token:", error);
        }
    };

    const submitContactsDB = async (allContacts) => {
        // setIsLoading(true);
        try {
            console.log("trydata");
            console.log(allContacts);

            const data = {
                contacts: allContacts,
            };

            const response: any = await RemoteApi.post(
                "onboard/client/save",
                data
            );

            if (response?.message == "Success") {
                const data = response.data;
                if (data.contacts) {
                    const updatedContacts = data.contacts.map((contact) => {
                        return {
                            ...contact, // Spread the existing contact properties
                            isCompleted: false, // Add the new key-value pair
                        };
                    });
                    setContacts(updatedContacts); // Update the contacts state with the updated array
                    // showDialog("google");
                    setFilteredContacts(updatedContacts);
                } // Update state with all contacts
            } else {
            }
        } catch (error) {
            console.error("Error exchanging code for token:", error);
            alert("An internal server error occurred. Please try again later.");
        }
        // setIsLoading(false);
    };

    // const getContactsDB = async () => {
    //     setIsLoading(true);

    //     try {
    //         const response: any = await RemoteApi.get("/onboard/distributor");

    //         if (response?.message == "Success") {
    //             console.log(response?.data);

    //             setContacts(response?.data);
    //         } else {
    //             console.log(response?.errors);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     setIsLoading(false);
    // };

    const getGoogleContacts = async (accessToken) => {
        // setIsLoading(true);
        try {
            const maxResults = 100; // Set the maximum number of results per page
            let nextPageToken = ""; // Initialize nextPageToken

            let allContacts = []; // Initialize an array to store all contacts

            // Fetch contacts until there are no more nextPageToken
            do {
                const response = await fetch(
                    `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=${maxResults}&pageToken=${nextPageToken}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const contacts = data.connections.map((connection) => {
                        const name = connection.names
                            ? connection.names[0].displayName
                            : "No Name";
                        const email = connection.emailAddresses
                            ? connection.emailAddresses[0].value
                            : "No Email";
                        const mobileNumber = connection.phoneNumbers
                            ? connection.phoneNumbers[0].value
                            : "No Phone Number";
                        const sourceId = 2;
                        return { name, email, mobileNumber, sourceId };
                    });

                    allContacts = allContacts.concat(contacts);

                    nextPageToken = data.nextPageToken; // Update nextPageToken
                } else {
                    console.error(
                        "Failed to fetch contacts:",
                        response.statusText
                    );
                    break; // Exit loop on error
                }
            } while (nextPageToken);

            // setContacts(allContacts); // Update state with all contacts
            // setIsLoading(false);
            submitContactsDB(allContacts);
            // try {
            //     console.log("trydata");
            //     console.log(allContacts);

            //     const data = {
            //         contacts: allContacts,
            //     };

            //     const response: any = await RemoteApi.post(
            //         "onboard/client/save",
            //         data
            //     );

            //     if (response?.message == "Success") {
            //         console.log(data);

            //         setContacts(response?.data?.contacts); // Update state with all contacts
            //     } else {
            //     }
            // } catch (error) {}
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            // const redirectUrl = "http://localhost:8081/invite-contact";
            const redirectUrl = redirectUri;
            const clientId =
                "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
            const scope =
                "profile email https://www.googleapis.com/auth/contacts.readonly";

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${encodeURIComponent(
                scope
            )}`;

            // Linking.openURL(authUrl);
            window.location.href = authUrl; // Redirect to Google sign-in URL
            // window.open(authUrl, "GoogleSignIn", "toolbar=no, menubar=no, width=600, height=700, top=100, left=100").focus();
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    const sendInvite = async () => {
        console.log(selectedContacts);
        try {
            console.log("selectedContacts");
            console.log(selectedContacts);

            const contactID = {
                contacts: selectedContacts.map((obj) => obj.id),
            };

            const response: any = await RemoteApi.patch(
                "onboard/client/invite",
                contactID
            );

            if (response?.message == "Success") {
                showDialog("invite");
                setUserInfo(null);
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);

        const searchContacts = contacts.filter((contact) =>
            contact.name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredContacts(searchContacts);
    };

    const toggleContactSelection = (contact) => {
        const isSelected = selectedContacts.some((c) => c === contact);
        if (isSelected) {
            setSelectedContacts(selectedContacts.filter((c) => c !== contact));
        } else {
            setSelectedContacts([...selectedContacts, contact]);
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(contacts);
        }
        setSelectAll(!selectAll);
    };

    const isSelected = (contact) => selectedContacts.includes(contact);

    const handleFilterChange = (value) => {
        setFilter(value);
        if (value === "all") {
            // Show all contacts
            setFilteredContacts(contacts);
        } else if (value === "invited") {
            // Show only invited contacts
            const invitedContacts = contacts.filter(
                (c) => c.status.name === "Invited"
            );
            setFilteredContacts(invitedContacts);
        } else {
            // Show only not invited contacts
            const notInvitedContacts = contacts.filter(
                (c) => c.status.name !== "Invited"
            );
            setFilteredContacts(notInvitedContacts);
        }
    };

    return (
        <>
            {/* {isLoading ? (
                <Center>
                    <HStack
                        space={2}
                        marginTop={20}
                        marginBottom={20}
                        justifyContent="center"
                    >
                        <Spinner
                            color={"black"}
                            accessibilityLabel="Loading order"
                        />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            ) : ( */}
            <ScrollView
                className=""
                style={{
                    backgroundColor: "white",
                    height: "100%",
                    overflow: "scroll",
                }}
            >
                <View className="bg-white">
                    <View className="">
                        <TableBreadCrumb
                            name={"Send Invite"}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            // alignItems: "center",
                            // justifyContent: "center",
                        }}
                    >
                        {userInfo ? (
                            <ContactDataTable />
                        ) : (
                            // <View
                            //     className={
                            //         "mt-4 z-[-1] w-[50%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px]"
                            //     }
                            // >
                            //     <View className="flex w-8/12">
                            //         <View className="flex flex-row justify-between py-1">
                            //             <Text className="font-bold text-lg">
                            //                 Welcome, {userInfo.name}!
                            //             </Text>
                            //             <Button
                            //                 title="Sign Out"
                            //                 onPress={() => {
                            //                     setGooglemodalVisible(false);
                            //                     console.log(GooglemodalVisible)
                            //                     setUserInfo(null);

                            //                 }}
                            //             />
                            //         </View>

                            //         <Text className="font-bold text-md text-center py-2">
                            //             Select Clients to send Invite
                            //         </Text>
                            //         <View className="flex flex-row justify-center">
                            //             <View className="w-8/12 ">
                            //                 <TextInput
                            //                     placeholder="Search name"
                            //                     value={searchQuery}
                            //                     onChangeText={(text) =>
                            //                         setSearchQuery(text)
                            //                     }
                            //                     style={{
                            //                         borderWidth: 1,
                            //                         borderColor: "#ccc",
                            //                         padding: 8,
                            //                         marginBottom: 10,
                            //                     }}
                            //                 />

                            //                 <View>
                            //                     {filteredContacts.length > 0 ? (
                            //                         <View>
                            //                             <TouchableOpacity
                            //                                 onPress={
                            //                                     toggleSelectAll
                            //                                 }
                            //                             >
                            //                                 <Text className="font-semibold text-md border-solid border-b-2 border-gray-200 py-1">
                            //                                     {selectAll ? (
                            //                                         <>
                            //                                         <View className="">
                            //                                         <View
                            //                                                 style={{
                            //                                                     backgroundColor:
                            //                                                         "#114EA8",
                            //                                                     // padding: 7,
                            //                                                     borderRadius: 5,
                            //                                                 //    width:20,
                            //                                                 //    height:20,
                            //                                                    paddingTop: 0,
                            //                                                    paddingLeft: 7,
                            //                                                    paddingRight: 7,
                            //                                                    paddingBottom: 0,

                            //                                                 }}
                            //                                             >
                            //                                                 <Icon
                            //                                                     name="check"
                            //                                                     size={
                            //                                                         6
                            //                                                     }
                            //                                                     color="white"
                            //                                                 />
                            //                                             </View>

                            //                                         </View>

                            //                                             <View className="pl-4">
                            //                                                 <Text className="text-base">
                            //                                                     Deselect
                            //                                                     All
                            //                                                 </Text>
                            //                                             </View>
                            //                                         </>
                            //                                     ) : (
                            //                                         <>
                            //                                             <View className="flex flex-row items-center">
                            //                                                 <View
                            //                                                     style={{
                            //                                                         backgroundColor:
                            //                                                             "transparent",
                            //                                                         padding: 8,
                            //                                                         borderRadius: 4,
                            //                                                         borderWidth: 2,
                            //                                                         borderColor:
                            //                                                             "#CCCCCC",
                            //                                                     }}
                            //                                                 ></View>
                            //                                                 <View className="pl-4">
                            //                                                     <Text className="text-base">
                            //                                                         Select
                            //                                                         All
                            //                                                     </Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                         </>
                            //                                     )}
                            //                                 </Text>
                            //                             </TouchableOpacity>

                            //                             <View className="h-96 overflow-scroll">
                            //                                 <FlatList
                            //                                     data={
                            //                                         filteredContacts
                            //                                     }
                            //                                     renderItem={({
                            //                                         item,
                            //                                     }) => (
                            //                                         <TouchableOpacity
                            //                                             onPress={() =>
                            //                                                 toggleContactSelection(
                            //                                                     item
                            //                                                 )
                            //                                             }
                            //                                         >
                            //                                             <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 overflow-auto justify-start">
                            //                                                 <View className="w-0.5/12">
                            //                                                     <View>
                            //                                                         {isSelected(
                            //                                                             item
                            //                                                         ) ? (
                            //                                                             <View
                            //                                                                 style={{
                            //                                                                     backgroundColor:
                            //                                                                         "#114EA8",
                            //                                                                     padding: 7,
                            //                                                                     borderRadius: 5,
                            //                                                                 }}
                            //                                                             >
                            //                                                                 <Icon
                            //                                                                     name="check"
                            //                                                                     size={
                            //                                                                         6
                            //                                                                     }
                            //                                                                     color="white"
                            //                                                                 />
                            //                                                             </View>
                            //                                                         ) : (
                            //                                                             <View
                            //                                                                 style={{
                            //                                                                     backgroundColor:
                            //                                                                         "transparent",
                            //                                                                     padding: 8,
                            //                                                                     borderRadius: 4,
                            //                                                                     borderWidth: 2,
                            //                                                                     borderColor:
                            //                                                                         "#CCCCCC",
                            //                                                                 }}
                            //                                                             ></View>
                            //                                                         )}
                            //                                                     </View>
                            //                                                 </View>
                            //                                                 <View className=" flex flex-col items-start pl-4 pb-2">
                            //                                                     <Text
                            //                                                         className="text-base"
                            //                                                         onPress={() =>
                            //                                                             toggleContactSelection(
                            //                                                                 item
                            //                                                             )
                            //                                                         }
                            //                                                     >
                            //                                                         {
                            //                                                             item.name
                            //                                                         }
                            //                                                     </Text>
                            //                                                     <Text className="text-slate-400 text-xs">
                            //                                                         {
                            //                                                             item.mobileNumber
                            //                                                         }
                            //                                                     </Text>
                            //                                                     <Text className="text-slate-400 text-xs">
                            //                                                         {
                            //                                                             item.email
                            //                                                         }
                            //                                                     </Text>
                            //                                                 </View>
                            //                                                 {/* <View className="w-3/12">
                            //                                             <Text>
                            //                                                 {
                            //                                                     item.name
                            //                                                 }
                            //                                             </Text>
                            //                                         </View>
                            //                                         <View className="w-4/12">
                            //                                             <Text>
                            //                                                 {
                            //                                                     item.email
                            //                                                 }
                            //                                             </Text>
                            //                                         </View>
                            //                                         <View className="w-4/12">
                            //                                             <Text>
                            //                                                 {
                            //                                                     item.mobileNumber
                            //                                                 }
                            //                                             </Text>
                            //                                         </View> */}
                            //                                             </View>
                            //                                         </TouchableOpacity>
                            //                                     )}
                            //                                     keyExtractor={(
                            //                                         item,
                            //                                         index
                            //                                     ) =>
                            //                                         index.toString()
                            //                                     }
                            //                                 />
                            //                             </View>
                            //                         </View>
                            //                     ) : (
                            //                         <Text className="font-bold text-md text-center py-2">
                            //                             No Contacts
                            //                         </Text>
                            //                     )}
                            //                 </View>

                            //                 <View className="py-2">
                            //                     <Button
                            //                         title="Send Invite"
                            //                         onPress={sendInvite}
                            //                         disabled={
                            //                             selectedContacts.length ===
                            //                             0
                            //                         }
                            //                     />
                            //                 </View>
                            //             </View>
                            //         </View>
                            //     </View>
                            // </View>
                            <>
                                

                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#fff",
                                        padding: 16,
                                    }}
                                >
                                    <View style={{ alignItems: "center" }}>
                                        <Icon
                                            name="address-book-o"
                                            size={100}
                                            color="#ccc"
                                        />
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                color: "#888",
                                                marginTop: 20,
                                            }}
                                        >
                                            No contacts
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex flex-row justify-center items-center  p-4 h-[42px">
                                    <Button
                                        title="Import Contacts from Google"
                                        onPress={signInWithGoogle}
                                        style={{ width: "100%" }}
                                    />
                                </View>

                                <View className="flex flex-row justify-center items-center  p-4 h-[42px">
                                <ManualInvite/>
                                </View>
                                

                                {/* <ContactDataTable /> */}
                            </>
                        )}
                    </View>
                </View>
                {/* <Button title="Modal" onPress={sendInvite} /> */}

                <View className="">
                    <Portal>
                        <Dialog
                            visible={inviteModalVisible}
                            onDismiss={() => hideDialog("invite")}
                            dismissable
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignSelf: "center",
                                width: 400,
                                height: "50%",
                                overflow: "scroll",
                                backgroundColor: "white",
                            }}
                        >
                            <View className="flex flex-row justify-between p-4">
                                <Pressable
                                    onPress={() => hideDialog("invite")}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                                    }
                                    aria-describedby="InviteClient"
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="black"
                                    />
                                </Pressable>
                            </View>
                            <View className="flex flex-row justify-center">
                                <View className="flex flex-col w-1/2 justify-center items-center">
                                    <View
                                        style={{
                                            backgroundColor: "#114EA8",
                                            padding: 10,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Icon
                                            name="check"
                                            size={100}
                                            color="white"
                                        />
                                    </View>
                                    <Text className="pt-8 text-lg font-bold color-[#114EA8]">
                                        Invite succesfully sent
                                    </Text>
                                </View>
                            </View>
                        </Dialog>
                    </Portal>
                </View>

                <View className="">
                    <Portal>
                        <Dialog
                            visible={GooglemodalVisible}
                            onDismiss={() => hideDialog("google")}
                            dismissable
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignSelf: "center",
                                width: 500,
                                height: "90%",
                                overflow: "scroll",
                                backgroundColor: "white",
                            }}
                        >
                            <View className="flex flex-row justify-between p-4">
                                <Text className="pl-4 text-lg font-bold"></Text>

                                <Pressable
                                    onPress={() => hideDialog("google")}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded p-4 h-4 border-slate-200"
                                    }
                                    aria-describedby="addNewClient"
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="black"
                                    />
                                </Pressable>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {userInfo ? (
                                    <View
                                        className={
                                            "mt-4 z-[-1] w-[99%] flex items-center  "
                                        }
                                    >
                                        <View className="flex w-11/12">
                                            <View className="flex flex-row justify-between py-1">
                                                <Text className="font-bold text-lg">
                                                    Welcome, {userInfo.name}!
                                                </Text>
                                                <Button
                                                    title="Sign Out"
                                                    onPress={() => {
                                                        setGooglemodalVisible(
                                                            false
                                                        );
                                                        console.log(
                                                            GooglemodalVisible
                                                        );
                                                        setUserInfo(null);
                                                    }}
                                                />
                                            </View>

                                            <Text className="font-bold text-md text-center py-2">
                                                Select Clients to send Invite
                                            </Text>
                                            <View className="flex flex-row justify-center">
                                                <View className="w-8/12 ">
                                                    <TextInput
                                                        placeholder="Search name"
                                                        value={searchQuery}
                                                        onChangeText={(text) =>
                                                            handleSearchChange(
                                                                text
                                                            )
                                                        }
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: "#ccc",
                                                            padding: 8,
                                                            marginBottom: 10,
                                                        }}
                                                    />
                                                    <Select
                                                        selectedValue={filter}
                                                        minWidth="200"
                                                        accessibilityLabel="Filter"
                                                        placeholder="Filter"
                                                        _selectedItem={{
                                                            bg: "teal.600",
                                                            endIcon: (
                                                                <CheckIcon size="5" />
                                                            ),
                                                        }}
                                                        mt={1}
                                                        onValueChange={
                                                            handleFilterChange
                                                        }
                                                    >
                                                        <Select.Item
                                                            label="All"
                                                            value="all"
                                                        />
                                                        <Select.Item
                                                            label="Invited"
                                                            value="invited"
                                                        />
                                                        <Select.Item
                                                            label="Not Invited"
                                                            value="notInvited"
                                                        />
                                                    </Select>

                                                    <View>
                                                        {filteredContacts.length >
                                                        0 ? (
                                                            <View>
                                                                <TouchableOpacity
                                                                    onPress={
                                                                        toggleSelectAll
                                                                    }
                                                                >
                                                                    <Text className="font-semibold text-md border-solid border-b-2 border-gray-200 py-1">
                                                                        {selectAll ? (
                                                                            <>
                                                                                <View className="flex flex-row justify-between pr-2 py-4">
                                                                                    <View className="pl-4">
                                                                                        <Text className="text-base">
                                                                                            Deselect
                                                                                            All
                                                                                        </Text>
                                                                                    </View>
                                                                                    <View className="">
                                                                                        <View
                                                                                            style={{
                                                                                                backgroundColor:
                                                                                                    "#114EA8",
                                                                                                // padding: 7,
                                                                                                borderRadius: 5,
                                                                                                //    width:20,
                                                                                                //    height:20,
                                                                                                paddingTop: 0,
                                                                                                paddingLeft: 7,
                                                                                                paddingRight: 7,
                                                                                                paddingBottom: 0,
                                                                                            }}
                                                                                        >
                                                                                            <Icon
                                                                                                name="check"
                                                                                                size={
                                                                                                    6
                                                                                                }
                                                                                                color="white"
                                                                                            />
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <View className="flex flex-row justify-between pr-2 py-4">
                                                                                    <View className="">
                                                                                        <Text className="text-base">
                                                                                            Select
                                                                                            All
                                                                                        </Text>
                                                                                    </View>
                                                                                    <View
                                                                                        style={{
                                                                                            backgroundColor:
                                                                                                "transparent",
                                                                                            padding: 8,
                                                                                            borderRadius: 4,
                                                                                            borderWidth: 2,
                                                                                            borderColor:
                                                                                                "#CCCCCC",
                                                                                            height: 2,
                                                                                        }}
                                                                                    ></View>
                                                                                </View>
                                                                            </>
                                                                        )}
                                                                    </Text>
                                                                </TouchableOpacity>

                                                                <View className="h-96 overflow-scroll">
                                                                    <FlatList
                                                                        data={
                                                                            filteredContacts
                                                                        }
                                                                        renderItem={({
                                                                            item,
                                                                        }) => (
                                                                            <TouchableOpacity
                                                                                onPress={() =>
                                                                                    toggleContactSelection(
                                                                                        item
                                                                                    )
                                                                                }
                                                                            >
                                                                                <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 overflow-auto justify-between px-2">
                                                                                    <View className=" flex flex-col items-start pb-2">
                                                                                        <Text
                                                                                            className="text-base"
                                                                                            onPress={() =>
                                                                                                toggleContactSelection(
                                                                                                    item
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </Text>
                                                                                        <Text className="text-slate-500 text-xs">
                                                                                            {
                                                                                                item.mobileNumber
                                                                                            }
                                                                                        </Text>
                                                                                        <Text className="text-slate-500 text-xs">
                                                                                            {
                                                                                                item.email
                                                                                            }
                                                                                        </Text>
                                                                                    </View>
                                                                                    <View className="w-0.5/12">
                                                                                        {item
                                                                                            .status
                                                                                            .name ==
                                                                                        "google" ? (
                                                                                            <View>
                                                                                                <Text className="text-slate-500">
                                                                                                    Invite
                                                                                                    Sent
                                                                                                </Text>
                                                                                            </View>
                                                                                        ) : (
                                                                                            <View>
                                                                                                {isSelected(
                                                                                                    item
                                                                                                ) ? (
                                                                                                    <View
                                                                                                        style={{
                                                                                                            backgroundColor:
                                                                                                                "#114EA8",
                                                                                                            padding: 7,
                                                                                                            borderRadius: 5,
                                                                                                        }}
                                                                                                    >
                                                                                                        <Icon
                                                                                                            name="check"
                                                                                                            size={
                                                                                                                6
                                                                                                            }
                                                                                                            color="white"
                                                                                                        />
                                                                                                    </View>
                                                                                                ) : (
                                                                                                    <View
                                                                                                        style={{
                                                                                                            backgroundColor:
                                                                                                                "transparent",
                                                                                                            padding: 8,
                                                                                                            borderRadius: 4,
                                                                                                            borderWidth: 2,
                                                                                                            borderColor:
                                                                                                                "#CCCCCC",
                                                                                                        }}
                                                                                                    ></View>
                                                                                                )}
                                                                                            </View>
                                                                                        )}
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        )}
                                                                        keyExtractor={(
                                                                            item,
                                                                            index
                                                                        ) =>
                                                                            index.toString()
                                                                        }
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <Text className="font-bold text-md text-center py-2">
                                                                No Contacts
                                                            </Text>
                                                        )}
                                                    </View>

                                                    <View className="py-2">
                                                        <Button
                                                            title="Send Invite"
                                                            onPress={sendInvite}
                                                            disabled={
                                                                selectedContacts.length ===
                                                                0
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View className="w-full flex items-center">
                                        <View className="flex flex-row justify-center items-center h-40">
                                            <Button
                                                title="Sign In Google"
                                                onPress={signInWithGoogle}
                                                style={{ width: "100%" }}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </Dialog>
                    </Portal>
                </View>
            </ScrollView>
            {/* )} */}
        </>
    );
};

export default GoogleContactInvite;
