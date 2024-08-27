import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import RemoteApi from "../../../src/services/RemoteApi";
import { Dialog, Portal } from "react-native-paper";

const GoogleSignInButton = () => {
    const [nowCurrentUrl, setNowCurrentUrl] = useState("");
    const clientIdCode =
        "930595944152-4i6mdnppmjbljmn9spgqn2fp29spegp1.apps.googleusercontent.com";
    const scopeURL =
        "profile email https://www.googleapis.com/auth/contacts.readonly";
    // const redirectUri = "https://vision.kcp.com.in/invite-contact";
    // const redirectUri = "https://vision.kcp.com.in/invite-contact";
    // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
    //     scopeURL
    // )}`;
    // const redirectUrilink = "http://localhost:8081/invite-contact"; // Replace with your redirect URI
    const redirectUrilink = "https://qvision-kcp.kotaksecurities.online/invite-contact"; // Replace with your redirect URI
    
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
                    console.log("useEffect")

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

            console.log("exchangeCodeForToken")

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
                "invite/client/save",
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

    return 
    <>
    <Button title="Sign In with Google" onPress={signInWithGoogle} />;

    {/* <View className="">
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
                                                                                        "Invited" ? (
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
                                                            <View>
                                                                <Text className="font-bold text-md text-center py-2">
                                                                    No Contacts
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className="">
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
                </View> */}
    </>
    
};

export default GoogleSignInButton;
