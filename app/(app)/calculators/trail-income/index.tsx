import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LineChart from "src/components/Chart/LineChart";
import SliderInput from "src/components/Slider";

const TrailIncomeCalculator = () => {
    const [lumpsum, setLumpsum] = useState(500000);
    const [sip, setSip] = useState(50000);
    const [expectedReturns, setExpectedReturns] = useState(11.0);
    const [years, setYears] = useState(10);
    const [periodsperyear, setPeriodsperyear] = useState(12);
    const [trailCommission, setTrailCommission] = useState(0.6); // Minimum 0.1%

    // Calculate Nominal Rate from Effective Returns
    function calculateNominalRate(expectedReturns, periodsperyear) {
        const expectedReturnsNumber = expectedReturns / 100;
        return (
            periodsperyear *
            (Math.pow(1 + expectedReturnsNumber, 1 / periodsperyear) - 1)
        );
    }

    const nominalPercent = (
        calculateNominalRate(expectedReturns, periodsperyear) * 100
    ).toFixed(2);

    const calculateLumpsumGrowth = (newLumpsum) =>
        (Number(newLumpsum) * (Number(nominalPercent) / 100)) / 12;

    const calculateSipGrowth = (newSIP) =>
        (Number(newSIP) * (Number(nominalPercent) / 100)) / 12;

    // Calculate Final AUM per month and Trail per month and store in arrays
    const calculateYearlyData = () => {
        let existingLumpsum = 0;
        let existingSIP = 0;
        let totalTrailIncome = 0;
        const monthlyTrailIncomes = [];
        const monthlyTrailCommision = [];
        const yearlyData = [{ year: 0, income: 0 }];

        // Loop through each year and calculate monthly trail incomes
        for (let year = 1; year <= years; year++) {
            let yearlyTrailIncome = 0;
            let yearlyTrailCommision = 0;

            for (let month = (year - 1) * 12 + 1; month <= year * 12; month++) {
                const newLumpsum = lumpsum;
                const newSIP = sip;
                const lumpsumGrowth = calculateLumpsumGrowth(
                    newLumpsum + existingLumpsum
                );
                const sipGrowth = calculateSipGrowth(newSIP + existingSIP);

                // Calculate Final AUM per month
                const finalAUM =
                    existingLumpsum +
                    newLumpsum +
                    lumpsumGrowth +
                    existingSIP +
                    newSIP +
                    sipGrowth;

                // Calculate Trail per month
                const trailPerMonth = (finalAUM * (trailCommission / 12)) / 100;

                // Store Trail per month in the array for this specific month
                monthlyTrailCommision.push(trailPerMonth);
                console.log("existingLumpsum", existingLumpsum);
                console.log("newLumpsum", newLumpsum);
                console.log("lumpsumGrowth", lumpsumGrowth);
                console.log("existingSIP", existingSIP);
                console.log("newSIP", newSIP);
                console.log("sipGrowth", sipGrowth);
                console.log("finalAUM", finalAUM);
                console.log("trailPerMonth", trailPerMonth);
                console.log("monthlyTrailCommision", monthlyTrailCommision);

                // Add Trail per month to the yearly total
                yearlyTrailIncome += trailPerMonth;
                yearlyTrailCommision += trailPerMonth;

                // Update existing Lumpsum and SIP for the next month
                existingLumpsum += newLumpsum + lumpsumGrowth;
                existingSIP += newSIP + sipGrowth;
            }

            // Store yearly trail income in the data array for the year
            yearlyData.push({ year, income: yearlyTrailCommision });
            console.log("year",year);

            // Add to total trail income
            totalTrailIncome += yearlyTrailIncome;
        }

        return { yearlyData, totalTrailIncome };
    };

    // Calculate yearly data based on user input
    const { yearlyData, totalTrailIncome } = calculateYearlyData();

    return (
        <ScrollView className="flex-1 bg-white p-4 ">
            <Pressable
                className="mr-3 flex flex-row justify-start items-center gap-2"
                onPress={() => router.push("/calculators")}
            >
                <Icon name="angle-left" size={24} color={"black"} />
                <Text className="text-xl font-bold text-center">
                    Trail Income Calculator
                </Text>
            </Pressable>

            <View className="flex flex-row justify-center items-center">
                <View className="flex flex-col w-1/2 p-4">
                    {/* Slider for Lumpsum */}
                    <SliderInput
                        label="Lumpsum per month (₹)"
                        value={lumpsum}
                        minValue={10000}
                        maxValue={100000000}
                        step={1000}
                        onChange={setLumpsum}
                        suffix="₹"
                    />

                    {/* Slider for SIP */}
                    <SliderInput
                        label="SIP per month (₹)"
                        value={sip}
                        minValue={1000}
                        maxValue={500000}
                        step={100}
                        onChange={setSip}
                        suffix="₹"
                    />

                    {/* Slider for Expected Returns */}
                    <SliderInput
                        label="Expected Returns (%)"
                        value={expectedReturns}
                        minValue={1}
                        maxValue={50}
                        step={0.1}
                        onChange={setExpectedReturns}
                        suffix="%"
                    />

                    {/* Slider for Number of Years */}
                    <SliderInput
                        label="Number of Years"
                        value={years}
                        minValue={1}
                        maxValue={30}
                        step={1}
                        onChange={setYears}
                    />

                    {/* Slider for Trail Commission */}
                    <SliderInput
                        label="Trail Commission (%)"
                        value={trailCommission}
                        minValue={0.1} // Minimum 0.1%
                        maxValue={2.0} // Maximum 2%
                        step={0.1} // Increments of 0.1
                        onChange={setTrailCommission}
                        suffix="%"
                    />
                </View>
                <View className="flex-1 p-4">
                    <LineChart
                        data={yearlyData}
                        width={500} // Custom width
                        height={400} // Custom height
                        showTooltipAlways={false} // Tooltip always visible
                        xLabel="Years"
                        yLabel="Trail Income (₹)"
                    />
                    <Text className="text-lg font-semibold text-center mb-2">
                        Yearly Trail Income Projection
                    </Text>
                    <Text className="text-center mt-4">
                        Total Trail Income: ₹{totalTrailIncome.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Line Chart with Always-Visible Tooltips */}
        </ScrollView>
    );
};

export default TrailIncomeCalculator;
