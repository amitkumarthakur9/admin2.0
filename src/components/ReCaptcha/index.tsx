import React, { useState, FC, useCallback, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const GoogleRecaptchaV3 = ({ updateToken }: any) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [noOfVerifications, setNoOfVerifications] = useState(0);
    const [dynamicAction, setDynamicAction] = useState("homepage");
    const [actionToChange, setActionToChange] = useState("");

    const clickHandler = useCallback(async () => {
        if (!executeRecaptcha) {
            return;
        }

        const result = await executeRecaptcha("dynamicAction");

        updateToken(result);
        setNoOfVerifications((noOfVerifications) => noOfVerifications + 1);
    }, [dynamicAction, executeRecaptcha]);

    const handleTextChange = useCallback((event) => {
        setActionToChange(event.target.value);
    }, []);

    const handleCommitAction = useCallback(() => {
        setDynamicAction(actionToChange);
    }, [actionToChange]);

    useEffect(() => {
        if (!executeRecaptcha || !dynamicAction) {
            return;
        }

        const handleReCaptchaVerify = async () => {
            const token = await executeRecaptcha(dynamicAction);
            updateToken(token);
            setNoOfVerifications((noOfVerifications) => noOfVerifications + 1);
        };

        handleReCaptchaVerify();
    }, [executeRecaptcha, dynamicAction]);

    return <div></div>;
};

export default GoogleRecaptchaV3;
