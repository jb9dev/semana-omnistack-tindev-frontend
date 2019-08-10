import React, { useState } from "react";
import api from "../services/api";

import "./Login.css";
import logo from "../SVGs/logo.svg";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await api.post("/devs", { username });

    const { _id } = response.data;

    history.push(`/devs/${_id}`);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo Tindev" title="Logo Tindev" />
        <input
          type="text"
          autoFocus
          placeholder="Digite seu usuário no GitHub"
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
