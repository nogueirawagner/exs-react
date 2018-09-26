import React from 'react';

export default class FilmesContainer extends React.Component {
    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Gênero</th>
                        </tr>
                        <tr>
                            <td>Jill</td>
                            <td>Smith</td>
                        </tr>
                        <tr>
                            <td>Eve</td>
                            <td>Jackson</td>
                        </tr>
                        <tr>
                            <td>John</td>
                            <td>Doe</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        );
    }
}