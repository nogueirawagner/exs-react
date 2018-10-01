import React from 'react';
import Axios from 'axios';

import BotaoBase from '../BotaoBase';

import ComponentBase from '../ComponentBase';

/**
 * Componente que cria uma lista simples que permite adicionar novos gêneros de filmes
 * remover 1 ou vários gênerios previamente cadastrados permitindo ainda alterar `on the fly´
 * a descrição de um gênero, não é necessário clicar uma vez e depois clicar em outro local
 * para realizar a alteração, basta clicar sobre a descrição e alterar da forma que deseja
 * assim que o usuário realiza a digitação da nova descrição, esta por sua vez e automaticamente
 * salva no servidor e é atualizada na tela (junto de outros componente).
 */
export default class Generos extends ComponentBase {

    constructor() {
        super();

        this.state = {
            generos: [],

            //Informa se o botão de remover deve ser habilitado ou não
            habilitarBotaoRemover: false
        }
    }
    
    /**
     * Preparação para carregar os parâmetros rebidos do componente pai
     * 
     * @param {Object} props Propriedades/Parâmetros de inicialização 
     * recebidos do componente pai
     */
    componentWillReceiveProps(props) {
        const { genres } = props;
        this.setState({ generos: genres });
    }

    /**
     * Sempre que um novo caractere for inserido ou removido da descrição do gênero
     * este evento será disparado para efetivar a alteração junto ao servidor
     * 
     * @param {ReactNode} target Nó html referenciado pelo React no evento 
     * change do input de nome do gênero
     */
    onChangeGenName({ target }) {
        let { generos } = this.state;

        //Encontra a posição do gênero alterado dentro da lista de gêneros
        let index = generos.findIndex(gen =>
            gen.id === parseInt(target.getAttribute('data-id'))
        );

        //Obtém a referência para o gênero a ser salvo
        let picked = generos[index];

        Object.assign(picked, {
            id: parseInt(target.getAttribute('data-id')),
            nome: target.value
        })

        if (index != -1) {
            //Efetiva a lteração do gênero junto ao servidor
            Axios.put(this.getUrl('/genero/alterar'), JSON.stringify(picked), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            }).then(({ status }) => {
                if (status === 200) {
                    generos[index] = picked;

                    this.setState({
                        generos: generos
                    })

                    this.props.onGenresChanged(generos);
                }
            }).catch(err => console.error(err));
        }
    }

    /**
     * Sempre que um checkbox de gênero for selecionado este evento irá ser disparado
     * para obter o total de checkboxes já selecionados, se houver algum checkbox selecionado
     * haverá uma alteração na propriedade *habilitarBotaoRemover* dentro do estado deste 
     * componente, que por sua vez irá habilitar ou desabilitar o botão remover conforme a quantidade
     * de checkboxes checados.
     */
    onCheckBoxChange() {
        let anyChecked = this.checkeds({containerId: "#tableGeneros"}).length != 0;

        this.setState({
            habilitarBotaoRemover: anyChecked
        })
    }

    /**
     * Realiza a efetivação da alteração da descrição de um gênero junto ao servidor
     */
    addGen() {
        let newGen = {
            nome: this.refs.nome.value
        }

        Axios.post(this.getUrl('/genero/adicionar'), JSON.stringify(newGen), {
            headers: {
                'Authorization': this.token,
                'Content-type': 'application/json'
            }
        }).then(({ status, data }) => {
            if (status === 200) {
                let { generos } = this.state;

                newGen.id = data.data.id;
                generos.push(newGen);
                this.setState({
                    generos: generos
                })

                this.refs.nome.value = ""
            }
        }).catch(err => console.error(err));
    }

    /**
     * Remove o(s) genêro(s) selecionado(s)
     */
    removeGen() {
        let ids = this.checkeds({containerId: "#tableGeneros"}).map(check => check.getAttribute('data-genId'));

        if(ids.length === 0)
            return

        Axios.delete(this.getUrl('/genero/apagar'), {
            headers: {
                'Authorization': this.token,
                'Content-type': 'application/json'
            },
            data: JSON.stringify(ids)
        })
            .then(({ status }) => {
                if(status === 200) {
                    const { generos } = this.state;
                    
                    this.setState({
                        //Obtém todos os gêneros EXCETO aqueles que estão na lista de ids que foram removidos
                        generos: generos.filter(gen => ids.indexOf(`${gen.id}`) === -1)
                    })
                }
            }).catch(err => console.error(err));
    }

    /**
     * Renderização do componente de generos
     */
    render() {
        return (
            <div className="generos">
                <h3>Gêneros</h3>
                <form>
                    <div className="container">
                        <div className="row">
                            <div className="form-grop col-7">
                                <div className="row">
                                    <div className="form-group col-12">
                                        <input
                                            className="form-control"
                                            id="nome"
                                            ref="nome"
                                            name="nome"
                                            placeholder="Descrição do gênero"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <BotoesCrud
                                    enable={{
                                        remove: this.state.habilitarBotaoRemover
                                    }}

                                    visible={{
                                        add: true,
                                        remove: true,
                                        change: false
                                    }}

                                    actions={{
                                        add: (e) => { 
                                            this.addGen.bind(this).call(e)
                                        },
                                        remove: (e) => { 
                                            this.removeGen.bind(this).call(e) 
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-5 table-container">
                                <table className="table table-hover table-sm" id="tableGeneros">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.generos.map(gen =>
                                                <tr key={gen.id}>
                                                    <td style={{ verticalAlign: "inherit" }}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                data-genId={gen.id}
                                                                id={`gen_${gen.id}`}
                                                                onChange={(e) => { 
                                                                    this.onCheckBoxChange(e) 
                                                                }}
                                                            />
                                                            <label
                                                                className="custom-control-label"
                                                                htmlFor={`gen_${gen.id}`}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            data-id={gen.id}
                                                            type="text"
                                                            defaultValue={gen.nome}
                                                            onChange={(e) => { 
                                                                this.onChangeGenName(e) 
                                                            }}
                                                            style={{
                                                                transition: "ease all 0.5px",
                                                                borderRadius: "3px",
                                                                border: "thin solid transparent",
                                                                padding: `${3}px`,
                                                                outline: "none !important"
                                                            }}
                                                            onMouseDown={(e) => {
                                                                e.target.style.border = "thin solid #ccc"
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.border = "thin solid #999"
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.border = "thin solid transparent"
                                                            }} />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

/**
 * Simplificação do uso do componente {@see BotaoBase} para permitir utilizar 
 * vários botões com ações e visibilidades condicionais
 */
class BotoesCrud extends React.Component {

    render() {
        const { actions, enable, visible } = this.props;

        let buttons = [];
        if (visible.add) {
            buttons.push(
                <div key={1} className="form-group col">
                    <BotaoBase
                        valor="Adicionar"
                        enabled={enable.add}
                        action={(e) => { 
                            e.preventDefault();
                            actions.add(e) 
                        }} />
                </div>
            )
        }

        if (visible.remove) {
            buttons.push(
                <div key={2} className="form-group col">
                    <BotaoBase
                        valor="Remover"
                        enabled={enable.remove}
                        action={(e) => { 
                            e.preventDefault();
                            actions.remove(e);
                        }} />
                </div>
            )
        }

        if (visible.change) {
            buttons.push(
                <div key={3} className="form-group col">
                    <BotaoBase
                        valor="Concluir alteração"
                        enabled={enable.change}
                        action={(e) => {
                            e.preventDefault();
                            actions.change(e)
                        }} />
                </div>
            )
        }

        return (
            <div className="row">
                {buttons}
            </div>
        )
    }
}