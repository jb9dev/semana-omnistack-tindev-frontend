import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import api from "../services/api";

import "./Main.css";
import logo from "../assets/logo.svg";
import dislike from "../assets/dislike.svg";
import like from "../assets/like.svg";

export default function Main({ match }) {
  const [devsList, setDevsList] = useState([]);
  const [matchDev, setMatchDev] = useState(true); //TODO: deixar null por padrão, true será apenas para estilizar. Seria interessante se isso fosse um array de objetos, pois se tivessem vários matches, daria para controlar isso melhor

  useEffect(() => {
    // TODO: Seria interessante que a lista de devs fosse atualizada toda vez que um novo usuário se cadastra
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

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });

    // TODO: Testar acessando com dois usuários e dando match de um para o outro
    socket.on("match", dev => {
      console.log(dev);
      setMatchDev(dev);
    });
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
      // TODO: Verificar se deu match para renderizar lightbox com as
      informações do dev que deu o match. Será possível fechar a lightbox
      setando matchDev como null
    </div>
  );
}
