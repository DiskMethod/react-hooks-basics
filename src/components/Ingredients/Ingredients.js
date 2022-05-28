import axios from "axios";
import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  // Updates DOM depending on search value
  // We need the useCallback hook so that this handler survives
  // the lifecycle when it gets re-rendered
  //
  // This also runs on the initial render where data is fetched in
  // the Search and that data is shared here in Ingredients
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  // Sends a post request to firebase and updates state
  const addIngredientHandler = async (ingredient) => {
    try {
      const response = await axios.post("/ingredients.json", ingredient);
      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        {
          id: response.data.name,
          ...ingredient,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  // Sends a delete request to firebase and updates state
  const removeIngredientHandler = async (id) => {
    try {
      await axios.delete(`/ingredients/${id}.json`);
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((curr) => {
          return curr.id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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
