import React, { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { VStack, Text, Divider, View, Pressable, HStack } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import DonutPieChart from "../../../../src/components/Chart/DonutPieChart";
import {
    RupeeSymbol,
    formatAmountInWords,
    rupeeCurrencyFormatter,
} from "../../../../src/helper/helper";
import SliderInput from "../../../../src/components/Slider";
import CalculatorCard from "../../../../src/components/CalculatorCard";
import { calculators } from "../../../../src/constants";

const Sip = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [expectedReturnRate, setExpectedReturnRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(60);
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [futureValue, setFutureValue] = useState(0);

    const calculateSIP = useCallback(() => {
        const P = monthlyInvestment;
        const r = (1 + expectedReturnRate / 100) ** (1 / 12) - 1;
        const n = timePeriod;

        const futureVal = P * (((1 + r) ** n - 1) / r) * (1 + r);
        const totalInvested = P * n;
        const earnings = futureVal - totalInvested;

        setTotalDeposit(totalInvested);
        setTotalEarnings(earnings);
        setFutureValue(futureVal);
    }, [monthlyInvestment, expectedReturnRate, timePeriod]);

    useEffect(() => {
        calculateSIP();
    }, [calculateSIP]);

    return (
        <View className="h-screen p-4">
            <VStack
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
                    <View className="w-full flex">
                        <Text fontSize="xl" color="black.300" bold>
                            SIP Returns Calculator
                        </Text>
                    </View>
                </View>
                <Text fontSize="md" color="black.300">
                    Maximize your financial growth with our SIP Calculator.
                    Discover how regular, disciplined investments can
                    significantly amplify your savings over time. Start planning
                    today to turn your financial goals into reality
                    tomorrow—every small step in investing can lead to
                    substantial rewards.
                </Text>

                <Divider orientation="horizontal" className="my-4" />

                <View className="w-full flex flex-row">
                    <View className="w-1/2">
                        <SliderInput
                            label={`Monthly Investment (${RupeeSymbol})`}
                            value={monthlyInvestment}
                            minValue={500}
                            maxValue={100000}
                            step={100}
                            onChange={setMonthlyInvestment}
                            suffix="₹"
                        />

                        <SliderInput
                            label="Expected Annual Return Rate (%)"
                            value={expectedReturnRate}
                            minValue={1}
                            maxValue={30}
                            step={0.1}
                            onChange={setExpectedReturnRate}
                            prefix="%"
                        />

                        <SliderInput
                            label="Time Period (months)"
                            value={timePeriod}
                            minValue={1}
                            maxValue={420}
                            step={1}
                            onChange={setTimePeriod}
                            prefix="Months"
                        />

                        <Divider orientation="horizontal" className="my-4" />

                        <VStack space={2} className="w-full">
                            <Text color="black.300">
                                Total Amount Deposited:
                            </Text>
                            <Text color="#715CFA" bold>
                                {`₹ ${rupeeCurrencyFormatter(
                                    totalDeposit
                                )} (${formatAmountInWords(totalDeposit)})`}
                            </Text>

                            <Text color="black.300">Total Earnings:</Text>
                            <Text color="#5db02a" bold>
                                {`₹ ${rupeeCurrencyFormatter(
                                    totalEarnings
                                )} (${formatAmountInWords(totalEarnings)})`}
                            </Text>
                        </VStack>
                    </View>
                    <Divider orientation="vertical" className="mx-4" />
                    <View className="w-1/2 px-4">
                        <Text color="black.300">Your Future Value:</Text>
                        <Text
                            color="black"
                            bold
                            fontSize="2xl"
                        >{`₹ ${rupeeCurrencyFormatter(
                            futureValue
                        )} (${formatAmountInWords(futureValue)})`}</Text>
                        <DonutPieChart
                            totalValue={`₹ ${formatAmountInWords(futureValue)}`}
                            pieData={[
                                {
                                    x: "Total Deposits",
                                    y: (totalDeposit / futureValue) * 100,
                                },
                                {
                                    x: "Total Earnings",
                                    y: (totalEarnings / futureValue) * 100,
                                },
                            ]}
                        />
                    </View>
                </View>
                <Divider my="2" color="black.700" orientation="horizontal" />
                <Text fontSize="xs" color="black.500" italic>
                    Market risks: SIP are subject to market risks. Fluctuations
                    in market conditions can affect the performance of the fund,
                    leading to variations in returns.
                </Text>
            </VStack>

            <HStack className="w-[100%] mt-2">
                {calculators
                    .filter((el) => el.key !== "sip")
                    .map((calc) => {
                        return (
                            <View className="w-1/2">
                                <CalculatorCard
                                    title={calc.title}
                                    description={calc.description}
                                    onPress={() => router.push(calc.link)}
                                />
                            </View>
                        );
                    })}
            </HStack>
        </View>
    );
};

export default Sip;
