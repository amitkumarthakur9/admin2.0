class ApiRequest {
    private static baseURL: string = process.env.API_ENDPOINT;

    static async handleResponse(response: Response) {
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Something went wrong");
        }
        return response.json();
    }

    static async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(this.baseURL + endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // You can add any custom headers here, like authorization headers
            },
        });
        return this.handleResponse(response);
    }

    static async post<T>(endpoint: string, data: any): Promise<T> {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
            "Cookie",
            "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIyIiwiY29tcGFueUlkIjoiMSIsImlhdCI6MTY5ODIyODA0MiwiZXhwIjoxNjk4NDAwODQyfQ.E53OlDO_fy57yPD4y8-f-QddK5Z9aT6DGeUmBUW2dWc"
        );
        const response = await fetch(this.baseURL + endpoint, {
            method: "POST",
            // headers: myHeaders,
            headers: {
                // Cookie: `token=${localStorage.getItem("token")}`,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // "Set-Cookie": document.cookie
            },
            body: JSON.stringify(data),
            credentials: "include",
        });
        console.log(response);
        // console.log({
        //     method: 'POST',
        //     // headers: myHeaders,
        //     headers: {
        //         Cookie: `token=${localStorage.getItem("token")}`,
        //         Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     },
        //     body: JSON.stringify(data),
        //     credentials: "include"
        // });

        return this.handleResponse(response);
    }

    static async put<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(this.baseURL + endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // You can add any custom headers here, like authorization headers
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    // You can add more methods like delete, patch, etc. if needed

    // Export other helper functions as needed
}

export default ApiRequest;
