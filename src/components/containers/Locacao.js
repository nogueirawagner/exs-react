import React from 'react';
import Axios from 'axios';

import BotaoBase from '../BotaoBase';

import ComponentBase from '../ComponentBase';

/**
 * Componente de locação que realiza a adição de locações na lista, remoção e edição
 */
export default class Locacao extends ComponentBase {
    constructor() {
        super();

        this.state = {
            movies: [],
            locacoes: [],
            locacaoAtual: null,
            locacoesAhRemover: [],

            //Listeners que são repassados aos subcomponentes
            handlers: {
                onDismiss: this.onDismiss.bind(this),
                onHireClick: this.onHireClick.bind(this),
                onConcluirClick: this.onConcluirClick.bind(this),
                onSelectedLocToChange: this.onSelectedLocToChange.bind(this)
            }
        }
    }

    /**
     * Preparação das propriedades recebidas pelo componente pai
     * 
     * @param {Object} props Parâmetros de inicialização
     */
    componentWillReceiveProps(props) {
        const { hires, movies } = props;
        let found = hires.filter(loc => loc.cpf === this.userCpf);

        this.setState({
            locacoes: found,
            filmes: movies
        });
    }

    /**
     * Evento disparado pelo componente {@see ListaLocacoes} ao selecionar
     * uma locação através do click sobre um element input[checkbox]
     * 
     * @param {Array} ids Identificadores de locações que serão removidos 
     */
    onHireClick(ids) {
        this.setState({
            locacoesAhRemover: ids
        })
    }

    /**
     * Evento disparado pelo componente {@see ModalMovies} quando a modal
     * deixa de ser visível na tela
     */
    onDismiss() {
        this.setState({
            locacaoAtual: null
        })
    }

    /**
     * Evento disparado ao realizar ao clicar sobre o botão 'Alterar' disponível na linha
     * de cada uma das locações (lista de locações)
     * 
     * @param {number} locaId Identificador único de uma determinada locação selecionada
     * no componente {@see ListaLocacoes} 
     */
    onSelectedLocToChange(locaId) {
        const { locacoes } = this.state;
        let found = locacoes.find(loc => loc.id === locaId);
        found.posicao = locacoes.findIndex(loc => loc.id === locaId + 1);

        this.setState({
            locacaoAtual: found
        })
    }

    /**
     * Realiza a remoção de uma locação ou várias locações previamente selecionadas
     */
    onRemoveLocClick() {
        const { locacoes, locacoesAhRemover } = this.state;

        if (locacoesAhRemover.length != 0) {
            Axios.delete(this.getUrl('/locacao/apagar'), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                },
                data: JSON.stringify(locacoesAhRemover)
            }).then(({ status }) => {
                if (status === 200) {
                    //Ao realizar a remoção junto ao serividor atualiza o estado do componente
                    this.setState({
                        locacoes: locacoes.filter(loc =>
                            locacoesAhRemover.indexOf(loc.id.toString()) < 0
                        ),
                        locacoesAhRemover: [],
                        locacaoAtual: null
                    })
                }
            }).catch(err => console.error(err));
        }
    }

    /**
     * Devido a possibilidade única de ter apenas um botão de conclusão dentro da modal de filmes
     * este método e o método `onAddLocRequest` compõem a parte de alteração e adição de locações
     * dentro deste componete.
     * 
     * @param {*} locid Identificador da locação a ser alterada
     * @param {*} filmesId Identificadores dos filmes que serão alterados dentro da locação selecionada
     * @returns {Promise} Axios PUT promise para ser utilizado dentro do componente {@see ModalMovies} 
     */
    onChangeLocRequest(locid, filmesId) {
        let data = {
            id: locid,
            "filmesId": filmesId
        }

        return Axios.put(this.getUrl('/locacao/alterar'), JSON.stringify(data), {
            headers: {
                'Authorization': this.token,
                'Content-type': 'application/json'
            }
        })
            .then(({ status, data }) => {
                if (status === 200) {
                    const { locacoes } = this.state;

                    locacoes[locacoes.findIndex(loc => loc.id === locid)] = data.data;
                    this.setState({
                        locacoes
                    })
                }
            }).catch(err => console.log(err))
    }

    /**
     * Devido a possibilidade única de ter apenas um botão de conclusão dentro da modal de filmes
     * este método e o método `onChangeLocRequest` compõem a parte de alteração e adição de locações
     * dentro deste componete.
     * 
     * @param {Array} filmesId Identificadores dos filmes que serão adicionados a uma nova locação
     * @returns {Promise} Axios POST promise para ser utilizada dentro do componete {@see ModalMovies} 
     */
    onAddLocRequest(filmesId) {
        return new Promise((resolve, reject) => {
            let data = {
                cpf: this.userCpf,
                filmesId: filmesId
            }

            Axios.post(this.getUrl('/locacao/adicionar'), JSON.stringify(data), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            }).then(({ status, data }) => {
                if (status === 200) {
                    let { locacoes } = this.state;

                    locacoes.push(data.data);
                    this.setState({
                        locacoes,
                        locacaoAtual: null
                    })

                    resolve();
                }
            }).catch(err =>
                reject(err)
            );
        }).catch(err => console.error(err));
    }

    /**
     * Ao efetuar o click sobre o botão concluir da modal de filmes {@see ModalMovies} é necessário
     * realizar o desvio condicional de fluxo para poder realizar as operações de adição/alteração
     * portando este método verifica se uma locação já foi selecionada, neste caso trata-se de uma
     * alteração caso contrário uma adição será inicada 
     * 
     * @param {Array} filmesId Identificadores únicos dos filmes que serão manipulados
     * seja na adição de uma nova locação ou na alteração
     */
    onConcluirClick({ filmesId }) {
        const { locacaoAtual } = this.state;
        if (locacaoAtual != null) {
            return this.onChangeLocRequest(locacaoAtual.id, filmesId);
        } else {
            return this.onAddLocRequest(filmesId)
        }
    }

    /**
     * Renderização do componetne de locação
     */
    render() {
        const { handlers, filmes, locacoes, locacoesAhRemover } = this.state;

        return (
            <div className="locacao">
                <h3>Locações</h3>
                <div className="container">
                    <div className="row">
                        <div className="form-group col-6" style={{ paddingLeft: "0" }}>
                            <button
                                className="btn btn-small btn-primary btn-block form-control"
                                type="button"
                                data-toggle="modal"
                                data-target="#modal-movies">
                                Adicionar
                            </button>
                        </div>
                        <div className="form-group col-6" style={{ paddingRight: "0" }}>
                            <BotaoBase
                                valor={"Remover"}
                                enabled={locacoesAhRemover.length !== 0}
                                action={(e) => {
                                    e.preventDefault();
                                    this.onRemoveLocClick()
                                }}
                            />
                        </div>
                    </div>
                </div>
                <ModalMovies
                    movies={filmes}
                    onConcluirClick={handlers.onConcluirClick}
                    currentHire={this.state.locacaoAtual}
                    onDismiss={handlers.onDismiss}
                    title={`Locação ${locacoes.length + 1}`}
                />
                <ListaLocacoes
                    locacoes={locacoes}
                    movies={filmes}
                    currentHire={this.state.locacaoAtual}
                    onCheckBoxChange={handlers.onCheckBoxChange}
                    onHireClick={handlers.onHireClick}
                    onSelectedLocToChange={handlers.onSelectedLocToChange}
                />
            </div>
        )
    }
}

/**
 * Lista com todas as locações armazenadas no servidor
 * 
 * @param {Object} props Propriedades do react passadas ao componente 
 */
const ListaLocacoes = (props) => (
    <div style={{ maxHeight: "470px", overflow: "auto" }}>
        <table className="table table-hover table-sm" id="tabelaLocacoes">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descrição</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.locacoes.map((hire, idx) => (
                        <tr key={hire.id}>
                            <td style={{ verticalAlign: "inherit" }}>
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={hire.id}
                                        data-id={hire.id}
                                        onChange={() => {
                                            let checks = document.querySelectorAll("#tabelaLocacoes input:checked");
                                            props.onHireClick(Array.from(checks).map(check => check.getAttribute('data-id')))
                                        }} />
                                    <label className="custom-control-label" htmlFor={hire.id} />
                                </div>
                            </td>
                            <td style={{ cursor: "pointer", verticalAlign: "inherit" }}>
                                <label htmlFor={hire.id}>
                                    {`Locação ${idx + 1} `}
                                </label>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#modal-movies"
                                    className="btn btn-small btn-primary btn-block form-control"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.onSelectedLocToChange(hire.id)
                                    }}
                                >
                                    Alterar
                            </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
)

/**
 * Bootstrap modal - `https://getbootstrap.com/docs/4.0/components/modal/` para exibir os filmes disponíveis
 * para serem adicionados a uma locação e também para exibir os filmes previamente inseridos em uma locação (
 * obs: Quando tratar-se de uma alteração de locação)
 */
class ModalMovies extends React.Component {

    constructor() {
        super();

        this.state = {
            modalTitle: "",
            movies: [],
            checkedStatus: []
        }
    }

    /**
     * React lifecycle - Realiza o tratamento correto dos parâmetros repassados
     * via properties para o componente de modal
     * 
     * @param {Object} props Propriedades do react repassadas ao componente 
     */
    componentWillReceiveProps(props) {
        const { movies, currentHire } = props;
        let { title } = props;
        let states = {}

        //Se não houver uma locação prevaimente selecionada
        if (currentHire != null) {
            //Trata-se de uma alteração de uma locação existente
            let hiredMovies = currentHire.locacoes.map(loc =>
                loc.filmeId
            );

            /* Será necessário guardar os estados dos checkboxes, checando-os para os filmes já 
               selecionados em uma locação que será editada 
            */
            movies.map(mov => mov.id)
                .forEach(id => states[id] = hiredMovies.indexOf(id) != -1)

            title = `Locação ${currentHire.posicao}`;
        } else {
            //Então deverá tratar-se de uma adição
            movies.map(mov => mov.id).forEach(id => states[id] = false);
        }

        this.setState({
            movies: movies,
            modalTitle: title,
            checkedStatus: states
        })
    }

    /**
     * Prepara o conteúdo que será exibido no corpo do modal de filmes
     * 
     * @param {Array} movies Lista de filmes para serem renderizados no corpo da modal 
     * @returns {Array} Lista de nós react a serem exibidos no corpo da modal
     */
    getModalBody(movies) {
        return (movies || []).map(mov => (
            <a key={mov.id} href="#" className="list-group-item list-group-item-action">
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.checkedStatus[mov.id]}
                        onChange={(e) => {
                            let { checkedStatus } = this.state;

                            checkedStatus[mov.id] = e.target.checked;
                            this.setState({ checkedStatus })
                        }}
                        data-id={mov.id}
                        id={`loc_${mov.id}`} />
                    <label className="custom-control-label" htmlFor={`loc_${mov.id}`}>{mov.nome}</label>
                </div>
            </a>
        ))
    }

    /**
     * Exibe a modal utilizando o plugin bootstrap
     */
    showModal() {
        $('.modal').modal('show');
    }

    /**
     * Oculta a modal de filmes utilizando o plugin bootstrap
     */
    hideModal() {
        this.clearModal();
        $('.modal').modal('hide');
    }

    /**
     * Redefine ao estado inicial os controles que estão presentes dentro
     * do copor da modal.
     */
    clearModal() {
        $('.custom-control-input').prop('checked', false);
        this.props.onDismiss()
    }

    /**
     * Renderia o componente modal de filmes 
     */
    render() {
        const { modalTitle, movies } = this.state;
        const { onConcluirClick } = this.props;

        return (
            <div id="modal-movies" data-backdrop="static" data-keyboard="true" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="modal-movies" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modal-movies">{modalTitle}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.clearModal() }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{
                            maxHeight: `${440}px`,
                            overflow: "auto",
                            paddingTop: "0"
                        }}>
                            <div className="list-group-flush">
                                {this.getModalBody(movies)}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.clearModal() }}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                onConcluirClick({
                                    filmesId: Array.from(
                                        $('.modal-body .custom-control-input:checked').map((idx, input) =>
                                            parseInt(input.getAttribute('data-id'))
                                        )
                                    )
                                }).then(() => {
                                    this.hideModal();
                                })
                            }}>Concluir</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}