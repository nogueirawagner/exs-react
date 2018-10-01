import React from 'react';

/**
 * Componente responsável por criar uma dropdown *<select>* com todos os gêneros
 * de filmes atualmente disponíveis no servidor
 */
export default class GeneroDropdown extends React.Component {

    /**
     * Renderiza o componente de dropdown de gêneros.
     */
    render() {
        const {
            generos,
            selected,
            onChange } = this.props;

        let itens = []

        if (generos.length === 0) {
            itens.push(<option data-id="-1" key="-1">Sem gêneros</option>);
        } else {
            generos.forEach(gen => {
                if (gen.ativo)
                    itens.push(<option data-id={gen.id} value={gen.id} key={gen.id}>{gen.nome}</option>);
            })
        }

        return (
            <select 
                id="genero"
                className="form-control"
                value={selected}
                onChange={onChange} 
            >{itens}</select>
        )
    }
}