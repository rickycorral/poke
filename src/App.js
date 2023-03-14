import React, { useEffect } from "react";
import { List, Row, Col, Card, Skeleton } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";
import axios from "axios";

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    pokemons: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pokemons = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const fetchPokemons = createAsyncThunk("pokemon/fetchPokemons", async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
  return response.data.results;
});

const store = configureStore({
  reducer: {
    pokemon: pokemonSlice.reducer,
  },
});

function App() {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemon.pokemons);
  const status = useSelector((state) => state.pokemon.status);
  const error = useSelector((state) => state.pokemon.error);

  useEffect(() => {
    dispatch(fetchPokemons());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Skeleton active />
      </div>
    );
  } else if (status === "failed") {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "50px" }}>
      <Row gutter={[16, 16]}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={pokemons}
          renderItem={(pokemon) => (
            <List.Item>
              <Card hoverable cover={<img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split("/")[6]}.png`} />} bodyStyle={{ padding: "12px" }}>
                <Card.Meta title={<a href={`https://pokeapi.co/api/v2/pokemon/${pokemon.url.split("/")[6]}/`}>{pokemon.name}</a>} />
              </Card>
            </List.Item>
          )}
        />
      </Row>
    </div>
  );
}

export default App;