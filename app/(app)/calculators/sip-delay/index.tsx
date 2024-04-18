import React, { useCallback, useEffect, useState } from "react";
import { VStack, Text, Divider, View, Pressable } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import {
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

    function calculateFutureValue(principal, rate, totalMonths, startMonth) {
        const monthlyRate = rate / 100 / 12;
        let futureValue = 0;

        for (let month = startMonth; month <= totalMonths; month++) {
            const monthsInvested = totalMonths - month;
            futureValue +=
                principal * Math.pow(1 + monthlyRate, monthsInvested);
        }

        return futureValue;
    }

    useEffect(() => {
        const maturityWithoutDelay = calculateFutureValue(
            monthlyInvestment,
            annualReturnRate,
            investmentPeriod,
            0
        );
        const maturityWithDelay = calculateFutureValue(
            monthlyInvestment,
            annualReturnRate,
            investmentPeriod,
            delayMonths
        );
        const lossDueToDelay = maturityWithoutDelay - maturityWithDelay;

        setMaturityWithoutDelay(maturityWithoutDelay);
        setMaturityWithDelay(maturityWithDelay);
        setLossDueToDelay(lossDueToDelay);
    }, [monthlyInvestment, annualReturnRate, investmentPeriod, delayMonths]);

    return (
        <View className="h-screen p-4">
            <VStack
                width="100%"
                space={8}
                alignItems="center"
                className="w-full bg-white rounded-xl p-6 shadow"
            >
                <View className="w-full flex flex-row items-center justify-between">
                    <Pressable
                        className="mr-3"
                        onPress={() => router.push("/calculators")}
                    >
                        <Icon name="angle-left" size={18} color={"black"} />
                    </Pressable>
                    <View className="w-full flex items-center">
                        <Text fontSize="xl" color="black.300" bold>
                            SIP Delay Calculator
                        </Text>
                    </View>
                </View>

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
                            <Text color="black.300">
                                Future Value With Delay:
                            </Text>
                            <Text color="#5db02a" bold>
                                {`₹ ${rupeeCurrencyFormatter(
                                    maturityWithDelay
                                )} (${formatAmountInWords(maturityWithDelay)})`}
                            </Text>
                            <Divider my="2" color="black.700" />
                            <Text color="black.300">
                                Estimated Loss Due to Delay:
                            </Text>
                            <Text color="black.400" bold>
                                {`₹ ${rupeeCurrencyFormatter(
                                    lossDueToDelay
                                )} (${formatAmountInWords(lossDueToDelay)})`}
                            </Text>
                        </VStack>
                    </View>
                    <Divider orientation="vertical" className="mx-4" />
                    <View className="w-1/2 px-4">
                        <Text>Add line chart</Text>
                    </View>
                </View>

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
