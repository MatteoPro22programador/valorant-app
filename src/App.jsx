import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);
  const [currentList, setCurrentList] = useState("");
  const [search, setSearch] = useState("");
  const [titulo, setTitulo] = useState("");

  const endpoints = {
    agents: "https://valorant-api.com/v1/agents?isPlayableCharacter=true",
    weapons: "https://valorant-api.com/v1/weapons",
    maps: "https://valorant-api.com/v1/maps",
    skins: "https://valorant-api.com/v1/weapons/skins",
  };


  async function cargarDatos() {
    const temp = {};

    for (const key in endpoints) {
      const res = await fetch(endpoints[key]);
      const json = await res.json();
      temp[key] = json.data;
    }

    setData(temp);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

 
  function mostrar(tipo) {
    if (!data) return;
    setTitulo(tipo.toUpperCase());
    setCurrentList(tipo);
    setSearch("");
  }

  function filtrar(lista, busqueda, campo = "displayName") {
    if (!busqueda.trim()) return lista;
    return lista.filter((item) =>
      item[campo]?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  if (!data) return <h2 className="loading">Cargando datos de Valorant…</h2>;

  const listaActual =
    currentList === "skins"
      ? filtrar(data.skins || [], search)
      : currentList === "agents"
      ? filtrar(data.agents || [], search)
      : currentList === "weapons"
      ? filtrar(data.weapons || [], search)
      : currentList === "maps"
      ? filtrar(data.maps || [], search)
      : [];

  return (
    <div className="container">
      <h1 className="title">Valorant API</h1>

      <div className="buttons">
        <button onClick={() => mostrar("agents")}>Agents</button>
        <button onClick={() => mostrar("weapons")}>Weapons</button>
        <button onClick={() => mostrar("maps")}>Maps</button>
        <button onClick={() => mostrar("skins")}>Skins</button>
      </div>

      {currentList && (
        <>
          <h2 className="subtitle">{titulo}</h2>

        
          <input
            className="searchBox"
            type="text"
            placeholder={`Buscar ${currentList}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </>
      )}

      <div className="grid">
        {listaActual.map((item, i) => (
          <Card key={i} type={titulo} item={item} />
        ))}
      </div>
    </div>
  );
}


function Card({ type, item }) {
  if (type === "AGENTS") {
    return (
      <div className="card">
        <img className="img" src={item.fullPortrait} alt="" />
        <h3>{item.displayName}</h3>
        <p>{item.description}</p>
        <strong>Rol: {item.role?.displayName}</strong>

        <div className="skills">
          {item.abilities.map((ab, i) =>
            ab.displayIcon ? (
              <img key={i} src={ab.displayIcon} title={ab.displayName} />
            ) : null
          )}
        </div>
      </div>
    );
  }

  if (type === "WEAPONS") {
    return (
      <div className="card">
        <img className="img" src={item.displayIcon} alt="" />
        <h3>{item.displayName}</h3>
        <p>Categoría: {item.shopData?.category}</p>
        <p>Precio: {item.shopData?.cost}</p>
      </div>
    );
  }

  if (type === "MAPS") {
    return (
      <div className="card">
        <img className="img" src={item.splash} alt="" />
        <h3>{item.displayName}</h3>
        <p>{item.coordinates}</p>
      </div>
    );
  }

  if (type === "SKINS") {
    return (
      <div className="card">
        <img className="img" src={item.displayIcon} alt="" />
        <h3>{item.displayName}</h3>
      </div>
    );
  }

  return null;
}
