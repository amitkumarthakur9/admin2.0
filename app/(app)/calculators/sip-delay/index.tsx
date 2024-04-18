import React, { useCallback, useEffect, useState } from "react";
import { VStack, Text, Divider, View, Pressable, Button } from "native-base";
import { jsPDF } from "jspdf";
import Icon from "react-native-vector-icons/FontAwesome";
import ADIcon from "react-native-vector-icons/AntDesign";

import {
    RupeeSymbol,
    formatAmountInWords,
    rupeeCurrencyFormatter,
} from "../../../../src/helper/helper";
import SliderInput from "../../../../src/components/Slider";
import { router } from "expo-router";

const SIPDelay = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [annualReturnRate, setAnnualReturnRate] = useState(12);
    const [investmentPeriod, setInvestmentPeriod] = useState(36);
    const [delayMonths, setDelayMonths] = useState(6);
    const [maturityWithoutDelay, setMaturityWithoutDelay] = useState(0);
    const [maturityWithDelay, setMaturityWithDelay] = useState(0);
    const [lossDueToDelay, setLossDueToDelay] = useState(0);
    const [improvedSIP, setImprovedSIP] = useState(0);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("SIP Delay Calculator", 10, 10);
        doc.text("This is your detailed report.", 10, 20);
        doc.save("SIPDelayCalculator.pdf");
    };

    const downloadImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillText("SIP Delay Calculator", 10, 50);

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "SIPCalculatorImage.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateFutureValue = (startMonth: number) => {
        const monthlyRate = (1 + annualReturnRate / 100) ** (1 / 12) - 1;
        let futureValue = 0;

        for (let month = startMonth; month <= investmentPeriod; month++) {
            const monthsInvested = investmentPeriod - month;
            futureValue +=
                monthlyInvestment * Math.pow(1 + monthlyRate, monthsInvested);
        }

        return futureValue;
    };

    const calculateRequiredSIP = () => {
        const monthlyRate = (1 + annualReturnRate / 100) ** (1 / 12) - 1;

        let requiredInvestment = 0;
        let sum = 0;
        for (let month = 1; month <= investmentPeriod - delayMonths; month++) {
            sum += Math.pow(1 + monthlyRate, month);
        }
        requiredInvestment = maturityWithoutDelay / sum;

        return requiredInvestment;
    };

    const calculate = useCallback(() => {
        const maturityWithoutDelay = calculateFutureValue(0);
        const maturityWithDelay = calculateFutureValue(delayMonths);
        const lossDueToDelay = maturityWithoutDelay - maturityWithDelay;
        const newSIP = calculateRequiredSIP();

        setMaturityWithoutDelay(maturityWithoutDelay);
        setMaturityWithDelay(maturityWithDelay);
        setLossDueToDelay(lossDueToDelay);
        setImprovedSIP(newSIP);
    }, [monthlyInvestment, annualReturnRate, investmentPeriod, delayMonths]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    return (
        <View className="h-screen p-4">
            <VStack
                width="100%"
                space={8}
                alignItems="center"
                className="w-full bg-white rounded-xl p-6 shadow"
            >
                <View className="w-full flex flex-row items-center">
                    <Pressable
                        className="mr-3"
                        onPress={() => router.push("/calculators")}
                    >
                        <Icon name="angle-left" size={18} color={"black"} />
                    </Pressable>
                    <View className="w-full flex flex-row items-center justify-between">
                        <Text fontSize="xl" color="black.300" bold>
                            SIP Delay Calculator
                        </Text>
                        <View className="flex flex-row items-start gap-x-4 pr-4">
                            <Button bgColor="transparent" onPress={downloadPDF}>
                                <ADIcon
                                    name="pdffile1"
                                    size={32}
                                    color={"black"}
                                />
                            </Button>
                            <Button
                                bgColor="transparent"
                                onPress={downloadImage}
                            >
                                <ADIcon
                                    name="jpgfile1"
                                    size={32}
                                    color={"black"}
                                />
                            </Button>
                        </View>
                    </View>
                </View>
                <Text fontSize="md" color="black.200">
                    Delaying your investments might seem harmless now, but even
                    a few months can significantly affect your future wealth.
                    Unlock the full potential of your savings by starting your
                    SIP today — because when it comes to building wealth, every
                    moment counts, and small decisions make big differences.
                </Text>

                <Divider orientation="horizontal" className="my-4" />
                <View className="w-full flex flex-row">
                    <View className="w-1/2">
                        <SliderInput
                            label="Monthly Investment (₹)"
                            value={monthlyInvestment}
                            minValue={1000}
                            maxValue={100000}
                            step={100}
                            onChange={setMonthlyInvestment}
                            suffix="₹"
                        />
                        <SliderInput
                            label="Annual Return Rate (%)"
                            value={annualReturnRate}
                            minValue={1}
                            maxValue={30}
                            step={0.1}
                            onChange={setAnnualReturnRate}
                            prefix="%"
                        />
                        <SliderInput
                            label="Investment Period (months)"
                            value={investmentPeriod}
                            minValue={1}
                            maxValue={600}
                            step={1}
                            onChange={setInvestmentPeriod}
                            prefix="Months"
                        />
                        <SliderInput
                            label="Delay (months)"
                            value={delayMonths}
                            minValue={1}
                            maxValue={investmentPeriod}
                            step={1}
                            onChange={setDelayMonths}
                            prefix="Months"
                        />
                        <Divider orientation="horizontal" className="my-4" />
                        <VStack space={2} className="w-full">
                            <View className="w-full flex flex-row">
                                <View className="w-1/2 flex flex-col">
                                    <View className="w-full flex flex-col justify-start py-2">
                                        <Text color="black.300">
                                            Future Value Without Delay:
                                        </Text>
                                        <Text color="#715CFA" bold>
                                            {`₹ ${rupeeCurrencyFormatter(
                                                maturityWithoutDelay
                                            )} (${formatAmountInWords(
                                                maturityWithoutDelay
                                            )})`}
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-col justify-start py-2">
                                        <View className="w-1/2 flex flex-col justify-start">
                                            <Text color="black.300">
                                                Future Value With Delay:
                                            </Text>
                                            <Text color="#5db02a" bold>
                                                {`₹ ${rupeeCurrencyFormatter(
                                                    maturityWithDelay
                                                )} (${formatAmountInWords(
                                                    maturityWithDelay
                                                )})`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Divider
                                    my="2"
                                    color="black.700"
                                    orientation="vertical"
                                />
                                <View className="w-1/2 flex flex-col pl-4">
                                    <View className="w-full flex flex-col justify-start py-2">
                                        <Text color="black.300">
                                            New SIP Due to Delay ({RupeeSymbol}
                                            ):
                                        </Text>
                                        <Text color="red.400" bold>
                                            {`₹ ${rupeeCurrencyFormatter(
                                                improvedSIP
                                            )} (${formatAmountInWords(
                                                improvedSIP
                                            )})`}
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-col justify-start py-2">
                                        <Text color="black.300">
                                            New SIP Due to Delay (%):
                                        </Text>
                                        <Text color="red.400" bold>
                                            {`${(
                                                improvedSIP - monthlyInvestment
                                            ).toFixed(2)} (${(
                                                (improvedSIP /
                                                    monthlyInvestment -
                                                    1) *
                                                100
                                            ).toFixed(2)}%)`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </VStack>
                    </View>
                    <Divider orientation="vertical" className="mx-4" />
                    <View className="w-1/2 px-4">
                        <Text color="black.300">
                            Estimated Loss Due to Delay:
                        </Text>
                        <Text color="black.400" bold fontSize="2xl">
                            {`₹ ${rupeeCurrencyFormatter(
                                lossDueToDelay
                            )} (${formatAmountInWords(lossDueToDelay)})`}
                        </Text>
                        <View className="py-4">
                            <Text italic>todo: add line chart</Text>
                        </View>
                    </View>
                </View>
                <Divider my="2" color="black.700" orientation="horizontal" />

                <Text fontSize="xs" color="black.500" italic>
                    Market risks: SIP are subject to market risks. Fluctuations
                    in market conditions can affect the performance of the fund,
                    leading to variations in returns.
                </Text>
            </VStack>
        </View>
    );
};

export default SIPDelay;
