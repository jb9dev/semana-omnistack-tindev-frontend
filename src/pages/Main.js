import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import "./Main.css";
import logo from "../SVGs/logo.svg";
import dislike from "../SVGs/dislike.svg";
import like from "../SVGs/like.svg";

export default function Main({ match }) {
  const [devsList, setDevsList] = useState([]);

  useEffect(() => {
    const getDevsList = async () => {
      const response = await api.get("/devs?filtered=true", {
        headers: {
          user: match.params.id
        }
      });

      setDevsList(response.data);
    };

    getDevsList();
  }, [match.params.id]);

  const handleDislike = async id => {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setDevsList(devsList.filter(dev => dev._id !== id));
  };

  const handleLike = async id => {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setDevsList(devsList.filter(dev => dev._id !== id));
  };

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Logo Tindev" title="Logo Tindev" />
      </Link>
      {devsList.length ? (
        <ul>
          {devsList.map(dev => (
            <li className="fadeIn" key={dev._id}>
              <img
                src={dev.avatar}
                alt={`Avatar GitHub ${dev.name}`}
                title={`Avatar GitHub ${dev.name}`}
              />
              <footer>
                <strong>{dev.name}</strong>
                <p>{dev.bio ? dev.bio : "Biografia ainda não preenchida"}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDislike(dev._id)}>
                  <img
                    src={dislike}
                    alt="ícone dislike"
                    title="ícone dislike"
                  />
                </button>
                <button type="button" onClick={() => handleLike(dev._id)}>
                  <img src={like} alt="ícone like" title="ícone like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty fadeIn">
          <p>
            Não há mais usuários cadastrados que você ainda não tenha interagido
          </p>
        </div>
      )}
    </div>
  );
}
