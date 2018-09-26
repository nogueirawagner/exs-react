import React from 'react';
import FilmeGenero from './FilmeGenero';
import BotaoRemover from './BotaoRemover';

export default class FilmesContainer extends React.Component {

    render() {
        const { filme } = this.props;
        const estilo = { float: "left", "marginRight": "20px" };

        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Selecionar</th>
                            <th>Nome</th>
                            <th>Gênero</th>
                        </tr>
                        {filme.map((f => <FilmeGenero key={f.id} {...f} />))}
                    </tbody>
                </table>
                <div style={estilo}>
                    <BotaoRemover />
                </div>
            </div>
        );
    }
}