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
    const totalValue = breakDown.reduce(
        (total, category) => total + category.currentValue,
        0
    );

    // Step 2: Calculate the percentage of each category
    const categoryPercentages = breakDown.map((category) => {
        const percentage = totalValue !== 0 ? (category.currentValue / totalValue) * 100 : 0;
        return {
            x: category.category,
            y: isNaN(percentage) ? 0 : percentage, // Ensure 0 when percentage is NaN
        };
    });

    console.log(
        "categoryPercentages: ",
        JSON.stringify(categoryPercentages)
    );

    return categoryPercentages;
};


export const sipChartPercentage = (breakDown) => {
    // Step 1: Calculate the total value of all categories
    const totalValue = breakDown.reduce(
        (total, category) => total + category.count,
        0
    );

    // Step 2: Calculate the percentage of each category
    const categoryPercentages = breakDown.map((category) => {
        const percentage = totalValue !== 0 ? (category.count / totalValue) * 100 : 0;
        return {
            x: category.category,
            y: isNaN(percentage) ? 0 : percentage, // Ensure 0 when percentage is NaN
        };
    });

    return categoryPercentages;
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





    
    

    