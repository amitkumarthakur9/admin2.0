import React, { useEffect, useState } from "react";
import {
    View,
    Button,
    Text,
    Linking,
    FlatList,
    TouchableOpacity,
    Platform,
    Modal,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MailComposer from "expo-mail-composer";
import { TableBreadCrumb } from "../../src/components/BreadCrumbs/TableBreadCrumb";

const GoogleSignInComponent = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const [selectAll, setSelectAll] = useState(false);

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
                        await AsyncStorage.setItem("Google_access_token", code);
                        console.log("Code saved to AsyncStorage");
                    }

                    // getGoogleContacts(code);
                    exchangeCodeForToken(code);
                }
            } catch (error) {
                console.error("Error getting current URL:", error);
            }
        };

        getCurrentUrl();

        // let handleRedirect = async (event) => {
        //     if (Platform.OS === "web") {
        //         return;
        //     }

        //     const url = event.url;
        //     if (url.includes("http://localhost:8081/invite-contact")) {
        //         const params = new URLSearchParams(url.split("?")[1]);
        //         const code = params.get("code");
        //         console.log(code);
        //         AsyncStorage.setItem(
        //             "Google_access_token",
        //             JSON.stringify(code)
        //         );

        //         const getCurrentUrl = async () => {
        //             try {
        //                 const url = await Linking.getInitialURL();
        //                 console.log(url);
        //             } catch (error) {
        //                 console.error("Error getting current URL:", error);
        //             }
        //         };

        //         getCurrentUrl();

        //         if (code) {
        //             await exchangeCodeForToken(code);
        //         }
        //     }
        // };

        // Linking.addEventListener("url", handleRedirect);

        // return () => {
        //     if (Platform.OS === "web") {
        //         return;
        //     }

        //     Linking.removeEventListener("url", handleRedirect);
        // };
    }, [nowCurrentUrl]);

    const exchangeCodeForToken = async (code) => {
        try {
            const clientId =
                "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
            const clientSecret = "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"; // Replace with your Google OAuth client secret
            const redirectUri = "http://localhost:8081/invite-contact"; // Replace with your redirect URI

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

                // Save user info to local storage
                await AsyncStorage.setItem(
                    "Google_access_token",
                    JSON.stringify(access_token)
                );

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

                    // Save user info to local storage
                    await AsyncStorage.setItem(
                        "userInfo",
                        JSON.stringify(userInfo)
                    );
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
            const response = await fetch(
                // "https://people.googleapis.com/v1/people/me/connections?personFields=names",
                "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const contactNames = data.connections.map((connection) => {
                    const name = connection.names
                        ? connection.names[0].displayName
                        : "No Name";
                    const email = connection.emailAddresses
                        ? connection.emailAddresses[0].value
                        : "No Email";
                    // const phone = connection.phoneNumbers ? connection.phoneNumbers[0].value : "No Phone Number";
                    // Add any other contact details you want to extract here
                    return { name, email };
                });

                setContacts(contactNames);

                // Save contacts data to local storage
                await AsyncStorage.setItem(
                    "contacts",
                    JSON.stringify(contactNames)
                );

                await AsyncStorage.setItem(
                    "contacts Data",
                    JSON.stringify(data)
                );
            } else {
                console.error("Failed to fetch contacts:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const redirectUrl = "http://localhost:8081/invite-contact";
            const clientId =
                "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
            const scope =
                "profile email https://www.googleapis.com/auth/contacts.readonly";

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${encodeURIComponent(
                scope
            )}`;

            Linking.openURL(authUrl);
            setShowModal(true);
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    const sendInvite = () => {
        // Prepare email content
        const emailSubject = "Invitation to download our app";
        const emailBody =
            "Hi,\n\nI would like to invite you to download our app. You can download it from the following link:\n\n[Download Link]\n\nBest regards,\n[Your Name]";

        // Extract email addresses of selected contacts
        const selectedEmails = selectedContacts.map((contact) => contact.email);

        // Replace [Download Link] with your app's download link
        const downloadLink = "https://example.com/download";

        // Construct the deep link to open Gmail compose screen
        // const gmailLink = `googlegmail://co?to=&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody.replace("[Download Link]", downloadLink))}`;

        // Open Gmail app with pre-filled content
        // Linking.openURL(gmailLink)
        //     .catch(() => {
        //         // If Gmail app is not installed, fallback to opening Gmail in browser
        //         const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody.replace("[Download Link]", downloadLink))}`;
        //         Linking.openURL(gmailWebLink);
        //     });

        // Generate mailto link with pre-filled email content
        // const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody.replace("[Download Link]", downloadLink))}`;

        // Open default email client with pre-filled content
        // Linking.openURL(mailtoLink);

        // Construct email options
        const mailOptions = {
            subject: emailSubject,
            body: emailBody.replace("[Download Link]", downloadLink),
            recipients: selectedEmails,
        };

        // Send the invitation email
        MailComposer.composeAsync(mailOptions)
            .then((result) => {
                if (result.status === "sent") {
                    console.log("Invitations sent successfully");
                }
            })
            .catch((error) => {
                console.error("Error sending invitations:", error);
            });
    };

    const saveLocal = async () => {
        console.log("saveLocal");

        await AsyncStorage.setItem(
            "contacts",
            JSON.stringify("contactlocalsave")
        );

        const userInfoString = await AsyncStorage.getItem("contacts");
        console.log(JSON.stringify(userInfoString));
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
                    <TableBreadCrumb name={"Invite Google Contacts"} />
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {userInfo ? (
                        <View>
                            <Text>Welcome, {userInfo.name}!</Text>
                            <Button
                                title="Sign Out"
                                onPress={() => setUserInfo(null)}
                            />
                            <Text>Contacts:</Text>
                            {contacts.length > 0 ? (
                                <View>
                                    <TouchableOpacity onPress={toggleSelectAll}>
                                        <Text>
                                            {selectAll
                                                ? "Deselect All"
                                                : "Select All"}
                                        </Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={contacts}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    toggleContactSelection(item)
                                                }
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text>
                                                        {isSelected(item)
                                                            ? "☑️ "
                                                            : "□ "}
                                                    </Text>
                                                    <Text>
                                                        {item.name} -{" "}
                                                        {item.email}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) =>
                                            index.toString()
                                        }
                                    />
                                </View>
                            ) : (
                                <Text>No Contacts</Text>
                            )}
                            <Button
                                title="Send Invite"
                                onPress={sendInvite}
                                disabled={selectedContacts.length === 0}
                            />
                        </View>
                    ) : (
                        <Button
                            title="Sign In with Google"
                            onPress={signInWithGoogle}
                        />
                    )}

                    {/* <Button title="Save in Local" onPress={saveLocal} /> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showModal}
                        onRequestClose={() => {
                            setShowModal(false);
                        }}
                    >
                        <View>
                            <Text>Signing in with Google...</Text>
                        </View>
                    </Modal>
                </View>
            </View>
            
        </ScrollView>
    );
};

export default GoogleSignInComponent;


