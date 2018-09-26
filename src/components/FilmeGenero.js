import React from 'react';

export default class FilmeGenero extends React.Component {

    render() {
        const estilo = { border: "1px solid black" };
        return (
                <tr >
                    <td style={estilo}><input type="checkbox"  /></td>
                    <td style={estilo}>{this.props.nome}</td>
                    <td style={estilo}>{this.props.genero}</td>
                    <td style={estilo}>{this.props.data}</td>
                </tr>
        );
    }
}