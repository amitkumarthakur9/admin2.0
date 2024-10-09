import { jwtDecode } from "jwt-decode";
import { useStorageState } from "../../src/services/useStorageState";

export const getInitials = (name: string) => {
    if(!name) return "-"
    const words = name.split(" ");
    if (words.length >= 2) {
        const firstWord = words[0];
        const secondWord = words[1];
        return `${firstWord[0]}${secondWord[0]}`;
    } else if (words?.length === 1) {
        return words[0][0];
    } else {
        return "";
    }
};

export const RupeeSymbol = "₹";

export const maskLetters = (str: string) => {
    if (str.length <= 4) {
        return str;
    }

    const maskedStr = str.slice(0, -4).replace(/[a-zA-Z0-9]/g, 'x') + str.slice(-4);

    return maskedStr;
}


export const aumChartPercentage = (breakDown) => {
    // Step 1: Calculate the total value of all categories
    if (breakDown) {
        const totalValue = breakDown.reduce(
            (total, category) => total + category.currentValue,
            0
        );

        // Step 2: Calculate the percentage of each category
        const categoryPercentages = breakDown.map((category) => {
            const percentage =
                totalValue !== 0
                    ? (category.currentValue / totalValue) * 100
                    : 0;
            return {
                x: category.category,
                y: isNaN(percentage) ? 0 : percentage, // Ensure 0 when percentage is NaN
            };
        });

        return categoryPercentages;
    }
};


export const sipChartPercentage = (breakDown) => {
    // Step 1: Calculate the total value of all categories
    if (breakDown) {
        const totalValue = breakDown.reduce(
            (total, category) => total + category.count,
            0
        );

        // Step 2: Calculate the percentage of each category
        const categoryPercentages = breakDown.map((category) => {
            const percentage =
                totalValue !== 0 ? (category.count / totalValue) * 100 : 0;
            return {
                x: category.category,
                y: isNaN(percentage) ? 0 : percentage, // Ensure 0 when percentage is NaN
            };
        });

        return categoryPercentages;
    }
};


export const roldID = () => {
    const [[isLoading, token], setToken] = useStorageState("token");
    // const [roleId, setroleID] = useState(null);
    // useEffect(() => {
        
    if (token) {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        // setroleID(decoded.roleId);
        console.log(decoded.roleId);
        return decoded.roleId;
    }

    
};

export const RMid = () => {
    const [[isLoading, token], setToken] = useStorageState("token");
    // const [roleId, setroleID] = useState(null);
    // useEffect(() => {
        
    if (token) {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        // setroleID(decoded.roleId);
        console.log(decoded.roleId);
        return {roldeID: decoded.roleId, rmID: decoded._id,};
    }

    
};


export const rupeeCurrencyFormatter = (num: number) => {
    var result = num.toString().split(".");
    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != "" && otherNumbers != "-") lastThree = "," + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    if (result.length > 1) {
        output += "." + result[1].slice(0, 2);
    }
    return output;
};

export const formatAmountInWords = (amount) => {
    let absAmount = Math.abs(amount);

    if (absAmount < 1000) return `${amount.toFixed(2)}`;

    const units = ["Crore", "Lakh", "K"];
    const steps = [10000000, 100000, 1000];

    let unitIndex = -1;
    for (let i = 0; i < steps.length; i++) {
        if (absAmount >= steps[i]) {
            unitIndex = i;
            break;
        }
    }

    if (unitIndex === -1) return `${amount}`;

    const formattedAmount = (absAmount / steps[unitIndex]).toFixed(2);
    const amountInWords = `${parseFloat(formattedAmount)} ${units[unitIndex]}`;
    return amount < 0 ? `-${amountInWords}` : amountInWords;
};


export const getResponse = (code) =>  {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (code === 200) {
                resolve({
                    code: 200,
                    message: "Success",
                    data: {
                        identifier: "partner@fundexpert.in",
                        gwtToken: "GWT240626164926515MJ11CEIMQQ5UDU",
                        documentId: "DID240626164926347AW99Q8FAMHVIMN"
                    },
                    error: []
                });
            } else if (code === 500) {
                resolve({
                    code: 500,
                    message: "Internal Server Error",
                    data: null,
                    error: ["An error occurred."]
                });
            } else if (code > 200 && code < 500) {
                resolve({
                    code: code,
                    message: "Success",
                    data: "Data not found",
                    error: []
                });
            } else {
                resolve({
                    code: 400,
                    message: "Bad Request",
                    data: null,
                    error: ["Invalid input."]
                });
            }
        }, 2000);
    });
}

export const getResponselate = (code) =>  {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (code === 200) {
                resolve({
                    code: 200,
                    message: "Success",
                    data: {
                        identifier: "partner@fundexpert.in",
                        gwtToken: "GWT240626164926515MJ11CEIMQQ5UDU",
                        documentId: "DID240626164926347AW99Q8FAMHVIMN"
                    },
                    error: []
                });
            } else if (code === 500) {
                resolve({
                    code: 500,
                    message: "Internal Server Error",
                    data: null,
                    error: ["An error occurred."]
                });
            } else if (code > 200 && code < 500) {
                resolve({
                    code: code,
                    message: "Success",
                    data: "Data not found",
                    error: []
                });
            } else {
                resolve({
                    code: 400,
                    message: "Bad Request",
                    data: null,
                    error: ["Invalid input."]
                });
            }
        }, 2000);
    });
}

export const isIndividualPAN = (pan: string): boolean => {
    const panType = pan.charAt(3).toUpperCase();
    // Return true if the 4th character is 'P' for individual
    return panType === 'P';
};


    
    

    