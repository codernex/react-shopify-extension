import { CityData, CountryState } from "@/types";
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_PROXY_URL}/endereco`;

// function generateRequestParameter(method: string, params: string) {
//   return {
//     jsonrpc: '2.0',
//     id: 1,
//     method: method,
//     params: params
//   };
// }

export const getZipCodeAutoComplete = async (requestData: {
  zipCode: string;
  country: string;
  language: string;
}) => {
  const response = await axios.post(baseUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "postCodeAutocomplete",
    params: {
      postCode: requestData.zipCode,
      country: requestData.country,
      language: requestData.language,
    },
  });
  return response.data.result;
};

export const getCityNameAutoComplete = async (requestData: {
  cityName: string;
  country: string;
  language: string;
}) => {
  const response = await axios.post(baseUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "cityNameAutocomplete",
    params: {
      cityName: requestData.cityName,
      country: requestData.country,
      language: requestData.language,
    },
  });

  return response.data.result as { predictions: CityData[] };
};

export const getStreetNames = async (requestData: {
  cityName: string;
  country: string;
  houseNumber: string;
  language: string;
  postCode: string;
  street: string;
}) => {
  const response = await axios.post(baseUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "streetAutocomplete",
    params: {
      cityName: requestData.cityName,
      country: requestData.country,
      houseNumber: requestData.houseNumber,
      language: requestData.language,
      postCode: requestData.postCode,
      street: requestData.street,
    },
  });

  return response.data.result;
};

// export const UseEmailCheck = async requestData => {
//   const response = await axios.post(
//     'http://localhost:3001/endereco',
//     generateRequestParameter('emailCheck', requestData)
//   );

//   return response.data.result;
// };

export const getNameCheck = async ({
  lastName,
  firstName,
  salutation,
}: {
  firstName: string;
  lastName: string;
  salutation: string;
}) => {
  const response = await axios.post(baseUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "nameCheck",
    params: {
      salutation: salutation,
      firstName: firstName,
      lastName: lastName,
    },
  });
  return response.data.result;
};

export const loadCountryStates = async (countryId: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_PROXY_URL}/countryData`,
      {
        countryId,
      }
    );
    return response.data.states as CountryState[];
  } catch (err) {
    console.log(err);
  }
};

export const addressCheck = async (requestData: {
  cityName: string;
  country: string;
  houseNumber: string;
  language: string;
  postCode: string;
  street: string;
}) => {
  const response = await axios.post(baseUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "addressCheck",
    params: {
      cityName: requestData.cityName,
      country: requestData.country,
      houseNumber: requestData.houseNumber,
      language: requestData.language,
      postCode: requestData.postCode,
      street: requestData.street,
    },
  });

  return response.data.result;
};

export const emailCheck = async (email: string) => {
  const response = await axios.post(baseUrl, {
    id: 1,
    jsonrpc: "2.0",
    method: "emailCheck",
    params: { email },
  });

  return response.data.result as { status: string[] };
};
