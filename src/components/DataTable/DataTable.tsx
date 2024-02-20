import { Dimensions, StyleSheet, Text, View } from "react-native";

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
                `flex flex-row py-4 px-2 justify-between ` +
                (Dimensions.get("screen").width < 770 ? "w-[1728px]" : "")
            }
        >
            {headers?.map((head, index) => {
                return (
                    <View
                        key={index}
                        className={`flex flex-row w-${cellSize[index]}/12 justify-start`}
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
const TableRows = ({ rows, cellSize }) => {
    return rows.map((row, index) => {
        return (
            <View key={index}>
                <View
                    className={
                        `flex flex-row py-4 px-2 justify-between ` +
                        (Dimensions.get("screen").width < 770
                            ? "w-[1728px]"
                            : "")
                    }
                >
                    {row?.map((rowItem, itemIndex) => {
                        return (
                            <View
                                key={itemIndex}
                                className={`flex flex-row w-${cellSize[itemIndex]}/12`}
                            >
                                <View
                                    className={`flex flex-row items-center w-full justify-start`}
                                >
                                    {rowItem.content}
                                </View>
                            </View>
                        );
                    })}
                </View>
                {index < rows.length && (
                    <View
                        className="my-2"
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
    className?: any;
}

const DataTable = ({ headers, rows, cellSize, className }: IDataTable) => {
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
            <TableRows rows={rows} cellSize={cellSize} />
        </View>
    );
};

export default DataTable;
