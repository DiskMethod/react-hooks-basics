import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

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

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [sendRequest, loading, error, data, extra] = useHttp();

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
  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest("/ingredients.json", "post", ingredient);
    },
    [sendRequest]
  );

  // Sends a delete request to firebase and updates state
  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(`/ingredients/${id}.json`, "delete", null, id);
    },
    [sendRequest]
  );

  useEffect(() => {
    if (extra) {
      dispatch({
        type: "DELETE",
        id: extra,
      });
    } else if (data) {
      dispatch({
        type: "ADD",
        ingredient: {
          id: data.name,
          amount: data.amount,
          title: data.title,
        },
      });
    }
  }, [data, extra]);

  const clearError = useCallback(() => {
    error.clear({ type: "RESET" });
  }, [error]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        onRemoveIngredient={removeIngredientHandler}
        ingredients={userIngredients}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error.message}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
