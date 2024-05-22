import { Image } from "native-base";
import React, { useState, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Pressable,
    TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";

// /**
//  * TableHeader Component
//  * @component
//  * @param {Object} props - The props object containing headers and cellSize.
//  * @param {Array.<string>} props.headers - Array of header labels.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {JSX.Element} - TableHeader component JSX
//  */
const TableHeader = ({ headers, cellSize }) => {
    return (
        <View
            className={
                `flex flex-row py-4 px-2  justify-between` +
                (Dimensions.get("screen").width < 770 ? "w-[1728px]" : "")
            }
        >
            {headers?.map((head, index) => {

                // Check if the variable is a string
                if (typeof cellSize[index] === "string") {
                    // console.log("header");
                    // console.log(
                    //     `w-${
                    //         typeof cellSize[index] === "string"
                    //             ? "[" + cellSize[index] + "]"
                    //             : cellSize[index] + "/12"
                    //     }`
                    // );
                } else {
                    // console.log("elseheader");
                    // console.log(
                    //     `w-${
                    //         typeof cellSize[index] === "string"
                    //             ? "[" + cellSize[index] + "]"
                    //             : cellSize[index] + "/12"
                    //     }`
                    // );
                }


                return (
                    <View
                        key={index + 1}
                        // className={`flex flex-row w-${cellSize[index]}/12 justify-start`}
                        className={`flex flex-row w-${
                            typeof cellSize[index] === "string"
                                ? "[" + cellSize[index] + "]"
                                : cellSize[index] + "/12"
                        } justify-start`}
                    >
                        <View
                            className={`flex flex-row items-center w-full justify-start`}
                        >
                            <Text selectable className="font-semibold">
                                {head}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// /**
//  * TableRows Component
//  * @component
//  * @param {Object} props - The props object containing rows and cellSize.
//  * @param {Array.<Array.<{ content: JSX.Element }>>} props.rows - Array of rows, each containing an array of row items with content.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {Array.<JSX.Element>} - Array of JSX elements representing table rows
//  */
const TableRows = ({ rows, cellSize, hasActions, options }) => {
    // console.log("cellsize" + cellSize);
    // console.log("dimension" + Dimensions.get("screen").width)
    return rows?.map((row, index) => {
        return (
            <View
                key={index}
                className={` ${
                    Dimensions.get("screen").width < 830
                        ? `w-[${Dimensions.get("screen").width - 20}]`
                        : ""
                }`}
            >
                <View
                    className={
                        `flex flex-row py-4 px-2 justify-between` +
                        (Dimensions.get("screen").width < 770
                            ? "w-[1728px]"
                            : "")
                    }
                >
                    {row?.map((rowItem, itemIndex) => {
                        return (
                            <React.Fragment key={rowItem.key || itemIndex}>
                                {/* <Text>{cellSize[itemIndex]}</Text> */}
                                <RowItem
                                    key={rowItem.key || itemIndex}
                                    width={cellSize[itemIndex]}
                                    content={rowItem.content}
                                    isLast={row.length - 1 === itemIndex}
                                    options={options}
                                    hasActions={hasActions}
                                    data={row[0]?.data}
                                />
                            </React.Fragment>
                        );
                    })}
                </View>
                {index < rows.length && (
                    <View
                        className="my-2 -z-50"
                        style={{
                            borderColor: "#e4e4e4",
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                )}
            </View>
        );
    });
};

const RowItem = ({ width, content, isLast, hasActions, options, data }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const closeDropdown = () => setShowDropdown(false);

    // Check if the variable is a string
    // if (typeof width === "string") {
    //     console.log(
    //         `w-${typeof width === "string" ? `[${width}]` : `${width}/12`}`
    //     );
    // } else {
    //     console.log(
    //         `w-${typeof width === "string" ? `[${width}]` : `${width}/12`}`
    //     );
    // }

    // console.log(width);

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <View
                className={`flex flex-row relative items-center w-${
                    typeof width === "string" ? `[${width}]` : `${width}/12`
                }`}
            >
                <View
                    className={`flex flex-row items-center -z-9999 ${
                        hasActions && isLast ? "w-fit" : "w-full"
                    } justify-start`}
                >
                    {content}
                </View>
                <View className="md:pl-4">
                {hasActions && isLast && (
                    <Pressable
                        className={`pl-6 md:pl-0md:absolute md:right-8 `}
                        onPress={toggleDropdown}
                    >
                        <Icon name="dots-three-vertical" size={16} />
                    </Pressable>
                )}
                </View>
                
                {showDropdown && (
                    <View className="absolute top-0 right-14 bg-white border-gray-300 border rounded shadow z-9999 cursor-pointer">
                        {options?.map((option) => {
                            return (
                                <Pressable
                                    key={option.key}
                                    className="p-2"
                                    onPress={option.onClick(data)}
                                >
                                    <Text selectable>{option.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}
                
            </View>
            
        </TouchableWithoutFeedback>
    );
};

// /**
//  * DataTable Component
//  * @component
//  * @param {Object} props - The props object containing headers, rows, and cellSize.
//  * @param {Array.<string>} props.headers - Array of header labels.
//  * @param {Array.<Array.<{ content: JSX.Element }>>} props.rows - Array of rows, each containing an array of row items with content.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {JSX.Element} - DataTable component JSX
//  */

interface IDataTable {
    headers: any;
    rows: any;
    cellSize: any;
    mobileCellSize: any;
    className?: any;
    hasActions?: boolean;
    options?: {
        key: string;
        name: string;
        onClick: (data: any) => void;
    }[];
    noDataText?: string;
}

const DataTable = ({
    headers,
    rows,
    cellSize,
    className,
    hasActions,
    options,
    noDataText,
    mobileCellSize=cellSize,
}: IDataTable) => {
    // console.log("rows")
    // console.log(rows)
    // console.log(rows?.length)
    // console.log(!!rows?.length)
    return (
        <View className={className}>
            <TableHeader headers={headers} cellSize={cellSize} />
            <View
                className="mb-2"
                style={{
                    borderColor: "#e4e4e4",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            {!!rows?.length ? (
                <TableRows
                    rows={rows}
                    cellSize={cellSize}
                    options={options}
                    hasActions={hasActions}
                />
            ) : (
                <View className="flex flex-col items-center gap-8 p-16">
                    <Image
                        source={require("../../../assets/images/noDataAvailable.png")}
                    />
                    <Text className="text-black font-bold">
                        {noDataText ? noDataText : "No Data Available"}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default DataTable;
