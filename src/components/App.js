import React from 'react';

import Contador from './Contador';
import Filme from './Filme';
import PlacarContainer from './PlacarContainer';
import FilmesContainer from './FilmesContainer';


const dados = {
    partida: {
        estadio: "Maracana",
        data: "20/03/2018",
        horario: "19h"
    },
    casa: {
        nome: "Brasil"
    },
    visitante: {
        nome: "Argentina"
    },
    clima: 'Chuva',
    tempo: '92',
    filme: [
        { id: '4958BE55-8B79-41A8-9EE1-B7E496E02989', nome: 'Rambo', genero: 'Ação'}
    ]
};

export default class App extends React.Component {

    // Utilizando spread operator para passagem dos parametros.
    render() {
        return <FilmesContainer {...dados} />
    }
}