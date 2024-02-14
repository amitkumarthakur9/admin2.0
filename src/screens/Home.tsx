import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import DataTableExample from "../components/Others/DataTableExample";
// import api from '../services/api';

const Home = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // api.get("books")
        //     .then((res) => {
        //         setBooks(res.data.data);
        //     });
    }, []);

    return (
        <View className="flex h-screen">
            <DataTableExample
                data={[
                    {
                        name: "John Doe",
                        mobile: "123-456-7890",
                        email: "john@example.com",
                        pan: "ABCDE1234F",
                        tax_status: "Taxable",
                    },
                ]}
            />
        </View>
    );
};

export default Home;
