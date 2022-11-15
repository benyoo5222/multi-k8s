import { useState, useEffect } from "react";
import axios from "axios";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  // When the component mounts
  useEffect(() => {
    fetchValues();
    fetchIndex();
  }, []);

  async function fetchValues() {
    const values = await axios.get("/api/values/current");
    setValues(values.data);
  }

  async function fetchIndex() {
    const indexes = await axios.get("/api/values/all");
    setSeenIndexes(indexes.data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await axios.post("/api/values", {
      index,
    });

    setIndex("");
  }

  function renderSeenIndexes() {
    return seenIndexes
      .map(({ number }) => {
        return number;
      })
      .join(", ");
  }

  function renderValues() {
    const objectKeys = Object.keys(values);
    return objectKeys.map((key) => {
      return (
        <div key={key}>
          For index {key} I caculated {values[key]}
        </div>
      );
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        ></input>
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
