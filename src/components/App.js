import React from 'react';

import Contador from './Contador';
import Filme from './Filme';
import PlacarContainer from './PlacarContainer';


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
    tempo: '92'
};

export default class App extends React.Component {

    // Utilizando spread operator para passagem dos parametros.
    render() {
        return <PlacarContainer {...dados} />
    }
}