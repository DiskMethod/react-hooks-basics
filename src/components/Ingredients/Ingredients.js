import axios from "axios";
import React, { useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((curr) => curr.id !== action.id);
    default:
      throw new Error("Should not be here!");
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "RESET":
      return { ...httpState, error: null };
    case "ERROR":
      return { loading: false, error: action.error };
    default:
      throw new Error("Should not be here!");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  const { loading, error } = httpState;
  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  // Updates DOM depending on search value
  // We need the useCallback hook so that this handler survives
  // the lifecycle when it gets re-rendered
  //
  // This also runs on the initial render where data is fetched in
  // the Search and that data is shared here in Ingredients
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  // Sends a post request to firebase and updates state
  const addIngredientHandler = async (ingredient) => {
    try {
      dispatchHttp({ type: "SEND" });
      const response = await axios.post("/ingredients.json", ingredient);
      dispatchHttp({ type: "RESPONSE" });
      dispatch({
        type: "ADD",
        ingredient: {
          id: response.data.name,
          ...ingredient,
        },
      });
    } catch (error) {
      dispatchHttp({
        type: "ERROR",
        error: error.message,
      });
    }
  };

  // Sends a delete request to firebase and updates state
  const removeIngredientHandler = async (id) => {
    try {
      dispatchHttp({ type: "SEND" });
      await axios.delete(`/ingredients/${id}.json`);
      dispatchHttp({ type: "RESPONSE" });
      dispatch({
        type: "DELETE",
        id,
      });
    } catch (error) {
      dispatchHttp({
        type: "ERROR",
        error: error.message,
      });
    }
  };

  const clearError = () => {
    dispatchHttp({ type: "RESET" });
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          onRemoveIngredient={removeIngredientHandler}
          ingredients={userIngredients}
        />
      </section>
    </div>
  );
}

export default Ingredients;
