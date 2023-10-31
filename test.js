let filters = [
    {
        "title": "Fund Category",
        "key": "fundcategory_id",
        "valueConfig": {
            "valueType": "select",
            "valueKey": [
                "value"
            ],
            "callApi": true,
            "apiConfig": {
                "apiUrl": "/fundCategories",
                "method": "GET",
                "requestData": {
                },
                "defaultData": null,
                "valueField": "id",
                "displayFields": [
                    "category_name"
                ],
            },
        },
        "operator": [
            {
                "name": "Is",
                "subKey": "=="
            },
            {
                "name": "Is Not",
                "subKey": "!="
            }
        ]
    },
    {
        "title": "Invester Type",
        "key": "invester_type",
        "valueConfig": {
            "valueType": "select",
            "valueKey": [
                "value"
            ],
            "callApi": true,
            "apiConfig": {
                "apiUrl": "",
                "defaultData": null,
                "method": "GET",
                "requestData": {
                },
                "valueField": "id",
                "displayFields": [
                    "category_name"
                ],
            },

        },
        "operator": [
            {
                "name": "Is",
                "subKey": "=="
            },
            {
                "name": "Is Not",
                "subKey": "!="
            }
        ]
    },
    {
        "title": "Start Date",
        "key": "startDate",
        "valueConfig": {
            "valueType": "daterange", // ['input', 'select', 'checkbox', 'date', 'daterange', 'number', 'radio']
            "valueKey": [
                'startFrom',
                'startTo',
            ]
        },
        "operator": [
            {
                "name": "Between",
                "subKey": "between"
            }
        ],
    },
    {
        "title": "End Date",
        "key": "endDate",
        "valueConfig": {
            "valueType": "daterange", // ['input', 'select', 'checkbox']
            "valueKey": [
                'startFrom',
                'startTo',
            ]
        },
        "operator": [
            {
                "name": "After",
                "subKey": "gt"
            },
            {
                "name": "Greater then equals",
                "subKey": "gte"
            },
            {
                "name": "Equals",
                "subKey": "eq"
            },
            {
                "name": "Not Equals",
                "subKey": "lte"
            }
        ],
    }
]

let z = { start: 0, length: 10, search: "", orders: "desc", columns: "clientName", filterData: { fundcategory_id: { operator: "==", value: 1528 }, invester_type: { operator: ">", value: 3 } } }
















const schema = {
    filters: [{}],
    sort: [],
    component: "OrderRows",
    response: {
        params: [
            {
                id: "client",
                type: "object",
                label: "Client",
                component: "ClientBox",
                params: [
                    {
                        id: "id",
                        type: "number",
                        label: "Client ID",
                        isRequired: true,
                        default: 0,
                    },
                    {
                        id: "name",
                        type: "string",
                        label: "Name",
                        isRequired: true,
                        default: "",
                    },
                    {
                        id: "code",
                        type: "string",
                        label: "Client Code",
                        isRequired: true,
                        default: "",
                    },
                ],
                actions: [
                    {
                        reference: "id",
                        name: "basicDetails",
                        endpoint: "/client/:code",
                        format: "query", // data, query, params, {}
                        request_data: { //name and value ("id" value will take from client object) to be sent in request
                            "client_id": "code"
                        },
                        method: "GET",
                        type: "xhr",
                        event: "hover",
                    },
                    {
                        reference: "name",
                        name: "redirect",
                        endpoint: "/client/",
                        format: "path",
                        request_data: { //name and value ("id" value will take from client object) to be sent in request
                            "client_id": "id"
                        },
                        method: "GET",
                        type: "redirect",
                        event: "click",
                    },
                ],
            },
            {},
        ],
        actions: [
            {
                id: "id",
                label: "View Detail",
                entity: "order",
                name: "basicDetails",
                endpoint: "/client/:id",
                format: "query",
                request_data: { //name and value ("id" value will take from client object) to be sent in request
                    "client_id": "id"
                },
                method: "GET",
                type: "redirect",
                event: "click",
            },
        ],
    },
};