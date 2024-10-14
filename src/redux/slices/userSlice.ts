import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RemoteApi from "../../services/RemoteApi";
import { UserMeData } from "src/interfaces/DsaFormApproveInterface";
import { checkARNExpiry } from "src/helper/helper";

// Async thunk to fetch user details
export const fetchUserDetail = createAsyncThunk(
    "user/fetchUserDetail",
    async () => {
        try {
            const response: UserMeData = await RemoteApi.get('user/me');

            // const response = {
            //     code: 200,
            //     message: "Success",
            //     data: {
            //         name: "",
            //         email: "",
            //         mobileNumber: "",
            //         maritalStatus: {
            //             id: 2,
            //             name: "null",
            //         },
            //         panNumber: "",
            //         arn: "",
            //         euin: "",
            //         dsaCode: "",
            //         remark: {
            //             id: 2,
            //             remark: "remark",
            //         },
            //         incomeSlab: {
            //             id: 2,
            //             name: null,
            //         },
            //         isOnBoarded: true,
            //         isEsigned: true,
            //         areDocumentsUploaded: false,
            //         educationalQualification: {
            //             id: 2,
            //             name: null,
            //         },
            //         bankAccount: [
            //             {
            //                 id: "42",
            //                 accountNumber: "45499388",
            //                 bankAccountType: {
            //                     id: 1,
            //                     name: "Savings Account",
            //                 },
            //                 bankBranch: {
            //                     ifscCode: "KKBK0008066",
            //                 },
            //                 bank: {
            //                     id: "107",
            //                     name: "KOTAK MAHINDRA BANK LIMITED",
            //                 },
            //             },
            //         ],
            //         address: [
            //             {
            //                 line1: "",
            //                 line2: "",
            //                 line3: null,
            //                 pincode: "",
            //                 district: {
            //                     id: "224",
            //                     name: "BENGALURU",
            //                 },
            //                 state: {
            //                     id: 15,
            //                     name: "KARNATAKA",
            //                 },
            //             },
            //         ],
            //         nameError: false,
            //         emailError: false,
            //         mobileNumberError: false,
            //         arnNumberError: false,
            //         euinNumberError: false,
            //         addressLineError: false,
            //         countryError: false,
            //         stateError: false,
            //         cityError: false,
            //         pinCodeError: false,
            //         panError: false,
            //         esignedDocumentError: false,
            //         aadharFrontDocumentError: true,
            //         aadharBackDocumentError: false,
            //         panCardDocumentError: false,
            //         cancelledChequeError: false,
            //     },
            //     errors: [],
            // };

            if (response.code === 200) {
                
                // const arnExpire = checkARNExpiry("2025-01-08 17:16:15");
                const arnExpire = checkARNExpiry(response.data.arnValidTill);
                console.log("arnExpire", arnExpire);
                return { userDetails: response.data, arnExpire: arnExpire };
            } else {
                throw new Error("Failed to fetch user details");
            }
        } catch (error) {
            throw new Error("An error occurred while fetching user details");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        userDetails: null,
        loading: false,
        error: null,
        arnExpire: null,
    },
    reducers: {
        resetUser: (state) => {
            state.userDetails = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetail.fulfilled, (state, action) => {
                state.userDetails = action.payload.userDetails;
                state.arnExpire = action.payload.arnExpire;
                state.loading = false;
            })
            .addCase(fetchUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
