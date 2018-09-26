import React from 'react';

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
        { id: '00000001-0000-0000-0000-000000000000', nome: 'Rambo', genero: 'Ação', data: '21/08/2018'},
        { id: '00000002-0000-0000-0000-000000000000', nome: 'Spice', genero: 'Ação', data: '21/08/2018'},
        { id: '00000003-0000-0000-0000-000000000000', nome: 'Tropa de Elite', genero: 'Ação', data: '21/08/2018'},
        { id: '00000004-0000-0000-0000-000000000000', nome: 'Fuga das Galinhas', genero: 'Comédia', data: '21/08/2018'},
    ]
};


export default class App extends React.Component {
    render() {
        return <FilmesContainer {...dados} />
    }
}