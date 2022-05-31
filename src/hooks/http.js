import { useReducer, useCallback } from "react";
import axios from "axios";

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "RESET":
      return {
        ...httpState,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.error,
      };
    default:
      throw new Error("Should not be here!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
  });
  const { loading, error, data, extra } = httpState;

  const sendRequest = useCallback(async (url, method, data, extra) => {
    try {
      dispatchHttp({
        type: "SEND",
      });
      const response = await axios({ url, method, data });
      if (response.data) {
        dispatchHttp({
          type: "RESPONSE",
          responseData: {
            name: response.data.name,
            title: data.title,
            amount: data.amount,
          },
          extra,
        });
      } else {
        dispatchHttp({
          type: "RESPONSE",
          responseData: null,
          extra,
        });
      }
    } catch (error) {
      dispatchHttp({
        type: "ERROR",
        error: {
          message: error.message,
          clear: dispatchHttp,
        },
      });
    }
  }, []);

  return [sendRequest, loading, error, data, extra];
};

export default useHttp;
