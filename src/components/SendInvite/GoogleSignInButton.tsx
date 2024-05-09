import React, { useEffect, useState } from "react";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import RemoteApi from "../../../src/services/RemoteApi";

const GoogleSignInButton = () => {
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const clientIdCode =
        "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
    const scopeURL =
        "profile email https://www.googleapis.com/auth/contacts.readonly";
    // const redirectUri = "https://vision.kcp.com.in/invite-contact";
    // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
    //     scopeURL
    // )}`;
    const redirectUrilink = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
    const clientSecretCode = "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";
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

    const signInWithGoogle = async () => {
        try {
            // const redirectUrl = "http://localhost:8081/invite-contact";
            const redirectUrl = redirectUrilink;
            const clientId = clientIdCode;
            const scope = scopeURL;

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

    const exchangeCodeForToken = async (code) => {
        const clientId = clientIdCode;
        const clientSecret = clientSecretCode;
        const redirectUri = redirectUrilink;

        try {
            const tokenResponse = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        code,
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirectUri,
                        grant_type: "authorization_code",
                    }),
                }
            );

            if (tokenResponse.ok) {
                const { access_token } = await tokenResponse.json();
                getGoogleContacts(access_token);
                console.log("getGoogleContacts")
            }

            if (tokenResponse.ok) {
                const { access_token } = await tokenResponse.json();

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

                    console.log(userInfo);
                } else {
                    console.error(
                        "Failed to fetch user info:",
                        userInfoResponse.statusText
                    );
                }
            } else {
                console.error(
                    "Failed to exchange code for token:",
                    tokenResponse.statusText
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
                    // setContacts(updatedContacts); // Update the contacts state with the updated array
                    // showDialog("google");
                    // setFilteredContacts(updatedContacts);
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
            console.log("submit contact");
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

    return <Button title="Sign In with Google" onPress={signInWithGoogle} />;
};

export default GoogleSignInButton;
