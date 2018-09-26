import React from 'react';
import FilmeGenero from './FilmeGenero';
import BotaoRemover from './BotaoRemover';
import BotaoAdicionar from './BotaoAdicionar';

export default class FilmesContainer extends React.Component {

    render() {
        const { filme } = this.props;
        const estilo = { border: "1px solid black",  "border-collapse": "collapse" };


        return (
            <div>
                <table style={estilo}>
                    <tbody>
                        <tr style={estilo}>
                            <th style={estilo}><input type="checkbox" /></th>
                            <th style={estilo}>Nome</th>
                            <th style={estilo}>Genero</th>
                            <th style={estilo}>DataCriacao</th>
                        </tr>
                        {filme.map((f => <FilmeGenero key={f.id} {...f} />))}
                    </tbody>
                </table>
                <div>
                    <BotaoRemover />
                </div>
                <div>
                    <BotaoAdicionar />
                </div>
            </div>
        );
    }
}