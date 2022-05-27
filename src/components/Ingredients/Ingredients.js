import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    setUserIngredients((prevIngredients) => [
      ...prevIngredients,
      {
        id: Math.random().toString(),
        ...ingredient,
      },
    ]);
  };
  const removeIngredientHandler = (id) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((curr) => {
        return curr.id !== id;
      })
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          onRemoveIngredient={removeIngredientHandler}
          ingredients={userIngredients}
        />
      </section>
    </div>
  );
}

export default Ingredients;
