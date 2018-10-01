import React from 'react';

import BotaoBase from './BotaoBase';
import ComponentBase from './ComponentBase';

/**
 * Representação de uma linha da lista de filmes do componente `contaiers\Filmes`
 */
export default class FilmeGenero extends ComponentBase {

    /**
     * Renderização da linha correspondente a um filme por gênero
     */
    render() {
        const {
            nome,
            generoId,
            containerId,
            id,
            generos,
            onCheckChange,
            onClickAlterar
        } = this.props;

        return (
            <tr>
                <td>
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            data-id={id}
                            onChange={() => { 
                                onCheckChange(this.checkeds({ containerId }).length != 0) 
                            }} 
                            className="custom-control-input" 
                            id={id} 
                        />
                        <label
                            className="custom-control-label"
                            htmlFor={id}
                        />
                    </div>
                </td>
                <td>
                    <label htmlFor={id}>{nome}</label>
                </td>
                <td>
                    <label htmlFor={id}>
                        {((generos || []).find(gen => gen.id === generoId) || {}).nome}
                    </label>
                </td>
                <td>
                    <BotaoBase valor="Alterar" enabled={true} action={(e) => {
                            e.preventDefault();
                            
                            this.checkeds({
                                containerId
                            }).forEach((check) => check.checked = false);
                            onClickAlterar(id)
                        }} 
                    />
                </td>
            </tr>
        );
    }
}