import React, { useEffect, useState } from "react";
import {
    View,
    Button,
    Text,
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

const GoogleContactInvite = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    //   const redirectUri = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
            const redirectUri = "https://vision.kcp.com.in/invite-contact"; // Replace with your redirect URI

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

    const getGoogleContacts = async (accessToken) => {
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
                        const phone = connection.phoneNumbers
                            ? connection.phoneNumbers[0].value
                            : "No Phone Number";
                        return { name, email, phone };
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

            setContacts(allContacts); // Update state with all contacts
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

    const sendInvite = () => {
        console.log(selectedContacts);
        showDialog();
        setUserInfo(null);
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    return (
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
                    <TableBreadCrumb name={"Send Invite to Google Contacts"} />
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
                                "mt-4 z-[-1] w-[90%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px]"
                            }
                        >
                            <View className="flex w-8/12">
                                <View className="flex flex-row justify-between py-1">
                                    <Text className="font-bold text-lg">
                                        Welcome, {userInfo.name}!
                                    </Text>
                                    <Button
                                        title="Sign Out"
                                        onPress={() => setUserInfo(null)}
                                    />
                                </View>

                                <Text className="font-bold text-md text-center py-2">
                                    Select Contacts
                                </Text>
                                <TextInput
                                    placeholder="Search name"
                                    value={searchQuery}
                                    onChangeText={(text) =>
                                        setSearchQuery(text)
                                    }
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        padding: 8,
                                        marginBottom: 10,
                                    }}
                                />
                                {filteredContacts.length > 0 ? (
                                    <View>
                                        <TouchableOpacity
                                            onPress={toggleSelectAll}
                                        >
                                            <Text className="font-semibold text-md border-solid border-b-2 border-gray-600 py-1">
                                                {selectAll
                                                    ? "☑️ Deselect All"
                                                    : "□ Select All"}
                                            </Text>
                                        </TouchableOpacity>
                                        <FlatList
                                            data={filteredContacts}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        toggleContactSelection(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 overflow-auto justify-between">
                                                        <View className="w-0.5/12">
                                                            <Text>
                                                                {isSelected(
                                                                    item
                                                                )
                                                                    ? "☑️ "
                                                                    : "□ "}
                                                            </Text>
                                                        </View>
                                                        <View className="w-3/12">
                                                            <Text>
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                        <View className="w-4/12">
                                                            <Text>
                                                                {item.email}
                                                            </Text>
                                                        </View>
                                                        <View className="w-4/12">
                                                            <Text>
                                                                {item.phone}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) =>
                                                index.toString()
                                            }
                                        />
                                    </View>
                                ) : (
                                    <Text className="font-bold text-md text-center py-2">
                                        No Contacts
                                    </Text>
                                )}

                                <View className="py-2">
                                    <Button
                                        title="Send Invite"
                                        onPress={sendInvite}
                                        disabled={selectedContacts.length === 0}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="w-full flex items-center">
                            <View className="flex flex-row justify-center items-center h-40 w-[90%]">
                                <Button
                                    title="Sign In Google"
                                    onPress={signInWithGoogle}
                                />
                            </View>
                            <ManualInvite />
                        </View>
                    )}
                </View>
            </View>
            {/* <Button title="Modal" onPress={sendInvite} /> */}

            <View className="">
                <Portal>
                    <Dialog
                        visible={modalVisible}
                        onDismiss={hideDialog}
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
                            <Text className="pl-4 text-lg font-bold"></Text>

                            <Pressable
                                onPress={hideDialog}
                                className={
                                    "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                                }
                                aria-describedby="addNewClient"
                            >
                                <Icon name="close" size={20} color="black" />
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
        </ScrollView>
    );
};

export default GoogleContactInvite;
