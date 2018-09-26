import React from 'react';

export default class FilmeGenero extends React.Component {

    render() {
        console.log(this.props.nome);
        return (
                <tr>
                    <th><input type="checkbox"  /></th>
                    <td>{this.props.nome}</td>
                    <td>{this.props.genero}</td>
                </tr>
        );
    }
}