import React from "react";
import { ScrollView, VStack, View } from "native-base";
import { router } from "expo-router";

import CalculatorCard from "../../../src/components/CalculatorCard"; // Import the updated CalculatorCard component
import { TableBreadCrumb } from "../../../src/components/BreadCrumbs/TableBreadCrumb";
import { calculators } from "../../../src/constants";

const Calculator = () => {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <View className="">
                <TableBreadCrumb name={"Calculators"} />
            </View>
            <VStack space={4}>
                {calculators.map((calculator) => (
                    <CalculatorCard
                        key={calculator.key}
                        title={calculator.title}
                        description={calculator.description}
                        onPress={() => router.push(calculator.link)}
                    />
                ))}
            </VStack>
        </ScrollView>
    );
};

export default Calculator;
