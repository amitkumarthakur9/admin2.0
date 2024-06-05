import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import RemoteApi from "../../services/RemoteApi";
import { router } from "expo-router";


interface BannerTokenResponse {
    message: string;
    token: string;
}

const MarketingRedirect = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
        
        setIsLoading(true);
        
        async function getBannerToken() {
            try {
                const response: BannerTokenResponse = await RemoteApi.get(
                    `banner/?role=`
                );

                if (response.message === "Success") {
                    console.log("BannerToken" + response.token);
                    setToken(response.token);
                   
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch banner token:", error);
                setIsLoading(false);
            }
        }

        getBannerToken();
    }, []);

    useEffect(() => {
        if (token) {
            const url = `http://marketing-module.fundexpert.in/?token=${token}&roleId=2`;
            window.open(url, '_blank');
            router.push('dashboard')
        }
        
        
    }, [token]);

    const handleButtonClick = () => {
        if (token) {
            // const url = `http://marketing-module.fundexpert.in`;
            const url = `http://marketing-module.fundexpert.in/?token=${token}&roleId=2`;
            window.open(url, '_blank');
        }

       
    };

    return (
        // <View style={styles.container}>
        //     <Button title="Visit Marketing Module" onPress={handleButtonClick} color="#114EA8" />
        //     {isLoading && <Text>Loading...</Text>}
        // </View>
        <View>Redirecting to Marketing</View>
       
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MarketingRedirect;
