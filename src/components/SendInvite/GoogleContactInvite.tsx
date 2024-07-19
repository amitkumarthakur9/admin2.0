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
import IonIcon from "react-native-vector-icons/Ionicons";

const GoogleContactInvite = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const [inviteModalVisible, setModalVisible] = useState(false);
    const [dbContact, setDbContacts] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // const hideDialog = () => setModalVisible(false);

    // const redirectUri = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
    // const redirectUri = "https://vision.kcp.com.in/invite-contact"; // Replace with your redirect URI
    const redirectUri = "https://qvision-kcp.kotaksecurities.online/invite-contact"; // Replace with your redirect URI


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
                        // exchangeCodeForToken(code);
                    }

                    // getGoogleContacts(code);
                }
            } catch (error) {
                console.error("Error getting current URL:", error);
            }
        };

        getCurrentUrl();
    }, [nowCurrentUrl]);

    // useEffect(() => {

    //     async function getContactList(
    //         updatedFilterValues = [],
    //         applyDirectly = false
    //     ) {
    //         setIsLoading(true);
    //         let data: any = {
    //             page: 1,
    //             limit: 10,
    //             filters: false,
    //         };

    //         const response: ContactResponse = await RemoteApi.post(
    //             "onboard/client/list",
    //             data
    //         );

    //         if (response.code == 200) {
    //             if (response.data.data.length > 0) {
    //                 setDbContacts(true)
    //             }

    //             console.log(
    //                 "response.data.data.length" + response.data.data.length
    //             );
    //         } else {
    //         }
    //     }

    //     getContactList();
    // }, []);

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
                    console.log(JSON.stringify(userInfo) + "userInfo");
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
                } // Update state with all contacts
            } else {
            }
        } catch (error) {
            console.error("Error exchanging code for token:", error);
            alert("An internal server error occurred. Please try again later.");
        }
        // setIsLoading(false);
    };

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

    return (
        <>
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
                        <TableBreadCrumb name={"Invite Client"} />
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        {/* {(userInfo || dbContact) && ( */}
                        <>
                            <ContactDataTable
                                children={
                                    <>
                                        <Button
                                            title="Sign In Google"
                                            onPress={signInWithGoogle}
                                            style={{ width: "100%" }}
                                        />
                                    </>
                                }
                            />
                        </>
                        {/* )} */}

                        {/* {      !dbContact         &&     (
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
                                    <ManualInvite />
                                </View>                              
                            </>
                        )} */}
                    </View>
                </View>
            </ScrollView>
            {/* )} */}
        </>
    );
};

export default GoogleContactInvite;
