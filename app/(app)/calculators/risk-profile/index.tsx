import React, { useState } from "react";
import { router } from "expo-router";
import {
    Button,
    Divider,
    HStack,
    Pressable,
    Text,
    VStack,
    View,
} from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

import { SingleBarChart } from "../../../../src/components/Chart/SingleBarChart";
import { calculators } from "../../../../src/constants";
import CalculatorCard from "../../../../src/components/CalculatorCard";

const questions = [
    {
        question: "In how many years do you plan to retire?",
        options: [
            {
                label: "Already Retired",
                value: 1,
            },
            {
                label: "Less than 10",
                value: 2,
            },
            {
                label: "10 to 20",
                value: 3,
            },
            {
                label: "20 to 30",
                value: 4,
            },
            {
                label: "More than 30",
                value: 5,
            },
        ],
    },
    {
        question: "Your loan repayments account for",
        options: [
            {
                label: "Over 50% of income",
                value: 1,
            },
            {
                label: "30-50% of income",
                value: 2,
            },
            {
                label: "10-30% of income",
                value: 3,
            },
            {
                label: "Less than 10% of income",
                value: 4,
            },
            {
                label: "No loans",
                value: 5,
            },
        ],
    },
    {
        question: "Your dependents include",
        options: [
            {
                label: "Parents, siblings, spouse and children",
                value: 1,
            },
            {
                label: "Parents, spouse and children",
                value: 2,
            },
            {
                label: "Spouse and children",
                value: 3,
            },
            {
                label: "Either parents or spouse",
                value: 4,
            },
            {
                label: "No dependents",
                value: 5,
            },
        ],
    },
    {
        question: "How soon do you need the money?",
        options: [
            {
                label: "Within 6-12 months",
                value: 1,
            },
            {
                label: "1-3 years",
                value: 2,
            },
            {
                label: "3-6 years",
                value: 3,
            },
            {
                label: "6-10 years",
                value: 4,
            },
            {
                label: "More than 10 years",
                value: 5,
            },
        ],
    },
    {
        question:
            "How many times have you borrowed or rolled over credit card bills in the past 1-2 years?",
        options: [
            {
                label: "All the time",
                value: 1,
            },
            {
                label: "About 6-7 times",
                value: 2,
            },
            {
                label: "3-4 times",
                value: 3,
            },
            {
                label: "Once or twice",
                value: 4,
            },
            {
                label: "Never",
                value: 5,
            },
        ],
    },
    {
        question: "How stable is your job/business/profession",
        options: [
            {
                label: "Not sure if it will last",
                value: 1,
            },
            {
                label: "May need to change soon",
                value: 2,
            },
            {
                label: "Don't foresee any change",
                value: 3,
            },
            {
                label: "Doing well and expect to rise",
                value: 4,
            },
            {
                label: "Excellent chances of growth",
                value: 5,
            },
        ],
    },
    {
        question: "How much of your income are you able to save?",
        options: [
            {
                label: "Less than 5%",
                value: 1,
            },
            {
                label: "5-10% of income",
                value: 2,
            },
            {
                label: "10-20% of income",
                value: 3,
            },
            {
                label: "20-30% of income",
                value: 4,
            },
            {
                label: "Over 30% of income",
                value: 5,
            },
        ],
    },
    {
        question: "Which of these best describe your financial situation?",
        options: [
            {
                label: "Very unstable",
                value: 1,
            },
            {
                label: "Need improvement",
                value: 2,
            },
            {
                label: "Average",
                value: 3,
            },
            {
                label: "Reasonably sound",
                value: 4,
            },
            {
                label: "On a solid footing",
                value: 5,
            },
        ],
    },
    {
        question:
            "Given your current financial status, can you achieve your financial goals?",
        options: [
            {
                label: "Some goals may be missed",
                value: 1,
            },
            {
                label: "Will be a bit of struggle",
                value: 2,
            },
            {
                label: "On track to achieve all goals",
                value: 3,
            },
            {
                label: "Planning for goals already done",
                value: 4,
            },
            {
                label: "All goals achieved",
                value: 5,
            },
        ],
    },
    {
        question: "Your total income comes from",
        options: [
            {
                label: "Only business/salary",
                value: 1,
            },
            {
                label: "Business/Salary & Rent",
                value: 2,
            },
            {
                label: "Business/Salary, Rent & Interest",
                value: 3,
            },
            {
                label: "Business/Salary, Rent, Interest & Dividends",
                value: 4,
            },
            {
                label: "Business/Salary, Spouse, Rent, Interest & Dividends",
                value: 5,
            },
        ],
    },
];

const getRiskProfile = (number: number) => {
    if (number < 12) {
        return "Conservative";
    } else if (number < 20) {
        return "Moderately Conservative";
    } else if (number < 28) {
        return "Moderate";
    } else if (number < 36) {
        return "Moderately Aggressive";
    } else {
        return "Aggressive";
    }
};

const calculateAverage = (array) => {
    // Filter out null values and calculate the sum of remaining values
    const filteredArray = array.filter((value) => value !== null);
    const sum = filteredArray.reduce((acc, curr) => acc + curr, 0);

    // Calculate the average
    const average = sum / filteredArray.length;

    return average;
};

const Question = ({
    index,
    question,
    options,
    selectedOption,
    setSelectedOption,
}) => {
    return (
        <View>
            <Text fontSize="md" color="black.300">
                {index}. {question}
            </Text>
            <View className="w-full px-6 py-2">
                <Text>Choose an option from below:</Text>
                {options?.map((el, idx) => {
                    return selectedOption === idx + 1 ? (
                        <Button minW="48" bgColor={"#013974"} className="my-2">
                            {el.label}
                        </Button>
                    ) : (
                        <Button
                            borderColor={"#013974"}
                            bgColor={"#fff"}
                            _text={{ color: "#013974" }}
                            variant="outline"
                            minW="48"
                            className="my-2"
                            onPress={() =>
                                setSelectedOption(index - 1, el.value)
                            }
                        >
                            {el.label}
                        </Button>
                    );
                })}
            </View>
        </View>
    );
};

const RiskProfile = () => {
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [answerPoints, setAnswerPoints] = useState(Array(10).fill(null));
    const [showResults, setShowResults] = useState(false);

    const setSelectedAnswer = (index: number, optionSelected: number) => {
        setAnswerPoints((prevValues) => {
            const updatedValues = [...prevValues];
            updatedValues[index] = optionSelected;
            return updatedValues;
        });
        setTimeout(() => {
            nextQuestionNumber();
        }, 200);
    };

    const nextQuestionNumber = () => {
        setCurrentQuestionNumber((prev) => {
            if (prev > 8) {
                setShowResults(true);
                return 0;
            } else {
                return prev + 1;
            }
        });
    };

    const prevQuestionNumber = () => {
        setCurrentQuestionNumber((prev) => {
            if (prev < 0) {
                return 0;
            } else {
                return prev - 1;
            }
        });
    };

    const restartQuestions = () => {
        setCurrentQuestionNumber(0);
        setAnswerPoints(Array(10).fill(null));
        setShowResults(false);
    };

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
                            Risk Profile Evaluation
                        </Text>
                    </View>
                </View>
                <Text fontSize="md" color="black.200">
                    Identifying your investment risk tolerance is essential to
                    developing a tailored investment plan that aligns with your
                    financial goals and comfort level. This detailed assessment
                    will guide you in making informed decisions to optimize your
                    portfolio’s performance. Risk Meter will move up and down as
                    we progress through the assessment to show real time
                    changes.
                </Text>

                <Divider orientation="horizontal" className="my-4" />
                <View className="w-full flex flex-row">
                    <View className="w-1/2">
                        <View className="h-96">
                            {showResults ? (
                                <View className="w-full h-full flex flex-col items-center justify-center">
                                    <Text className="font-bold text-lg">
                                        {getRiskProfile(
                                            answerPoints.reduce(
                                                (partialSum, a) =>
                                                    partialSum + a,
                                                0
                                            )
                                        )}
                                    </Text>
                                    <Divider
                                        orientation="horizontal"
                                        className="my-2"
                                    />
                                    <Text className="font-semibold text-md">
                                        Congratulations! You have found your
                                        risk profile.
                                    </Text>
                                </View>
                            ) : (
                                <Question
                                    index={currentQuestionNumber + 1}
                                    question={
                                        questions[currentQuestionNumber]
                                            ?.question
                                    }
                                    options={
                                        questions[currentQuestionNumber]
                                            ?.options
                                    }
                                    selectedOption={
                                        answerPoints[currentQuestionNumber]
                                    }
                                    setSelectedOption={setSelectedAnswer}
                                />
                            )}
                        </View>
                        <Divider orientation="horizontal" className="my-4" />
                        <View className="flex flex-row items-center justify-between gap-x-4 px-6">
                            <Button
                                borderColor={"#013974"}
                                bgColor={"#fff"}
                                _text={{ color: "#013974" }}
                                variant="outline"
                                width="48"
                                className="my-2"
                                isDisabled={!showResults}
                                onPress={restartQuestions}
                            >
                                Restart
                            </Button>
                            <View className="flex flex-row items-center gap-x-4">
                                <Button
                                    borderColor={"#013974"}
                                    bgColor={"#fff"}
                                    _text={{ color: "#013974" }}
                                    variant="outline"
                                    width="48"
                                    isDisabled={currentQuestionNumber === 0}
                                    className="my-2"
                                    onPress={prevQuestionNumber}
                                >
                                    Prev
                                </Button>
                                <Button
                                    borderColor={"#013974"}
                                    bgColor={"#fff"}
                                    _text={{ color: "#013974" }}
                                    variant="outline"
                                    width="48"
                                    className="my-2"
                                    isDisabled={
                                        showResults ||
                                        answerPoints[currentQuestionNumber] ===
                                            null
                                    }
                                    onPress={nextQuestionNumber}
                                >
                                    Next
                                </Button>
                            </View>
                        </View>
                    </View>
                    <Divider orientation="vertical" className="mx-4" />
                    <View className="w-1/2 h-96 px-4 flex items-center gap-y-4">
                        <View className="w-2/5">
                            <SingleBarChart
                                title="Risk Meter"
                                labels={[
                                    "Aggressive",
                                    "Moderately Aggressive",
                                    "Moderate",
                                    "Moderate Conservative",
                                    "Conservative",
                                ]}
                                data={[
                                    {
                                        label: "Risk Meter",
                                        value:
                                            calculateAverage(answerPoints) * 2,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </View>
                <Divider my="2" color="black.700" orientation="horizontal" />
            </VStack>

            <HStack className="w-[100%] mt-2">
                {calculators
                    .filter((el) => el.key !== "risk-profile")
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

export default RiskProfile;
