import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  // Fetches data and runs everytime enteredFilter changes
  useEffect(() => {
    async function fetchData() {
      // Checks to see if enteredFilter has changed in the past 500ms
      // This works since enteredFilter is saved via closure at the time
      // that fetchData function is created. We then need the useRef hook
      // to grab the current value from input element in the DOM.
      if (enteredFilter === inputRef.current.value) {
        try {
          // We add an extra function here since the useEffect callback
          // needs to be synchronous to avoid race condition
          const response = await axios.get("/ingredients.json");
          const ingredients = [];
          for (const key in response.data) {
            ingredients.push({
              id: key,
              amount: response.data[key].amount,
              title: response.data[key].title,
            });
          }
          onLoadIngredients(
            ingredients.filter((curr) => {
              return curr.title.toLowerCase().indexOf(enteredFilter) !== -1;
            })
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
    // Setting a 500ms to reduce GET requests
    // Now we should only request data whenever the user stops typing
    const timer = setTimeout(fetchData, 500);

    // React automatically cleans up effects from previous renders and
    // since on each effect we're calling setTimeout we want to remove
    // old setTimout(s) from the callback queue.
    //
    // i.e. this cleanup function runs whenever one of our dependencies
    // changes. If we had no dependencies then cleanup will run after
    // Search gets removed/unmounted from the DOM
    return function cleanup() {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);
  // We send a request whenever the search input changes

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(e) => {
              setEnteredFilter(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
