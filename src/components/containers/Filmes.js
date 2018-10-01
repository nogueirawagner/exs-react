import React from 'react';
import Axios from 'axios';

import FilmeGenero from '../FilmeGenero';
import BotaoBase from '../BotaoBase';
import GeneroDropdown from '../GeneroDropdown';
import ComponentBase from '../ComponentBase';

/**
 * Componente responsável pela renderização da aba de filmes, neste componente
 */
export default class Filmes extends ComponentBase {

    constructor() {
        super();

        this.state = {
            filmes: [],
            generos: [],
            ultimoId: 0,

            handlers: {
                handleChange: this.handleChange.bind(this),
                onCheckChange: this.onCheckChange.bind(this),
                onClickAlterar: this.onClickAlterar.bind(this),
            },

            generoSelecionado: {},
            filmeSelecionado: null,
            habilitarBotaoRemover: false,
            habilitarBotaoAdicicionar: true,
            habilitarBotaoAlterar: false
        }
    }

    componentWillReceiveProps(props) {
        const { movies, genres } = props;

        this.setState({
            generos: genres,
            filmes: movies,
            ultimoId:
                movies.length != 0 ?
                    Math.max.apply(Math, (movies).map(f => f.id)) : 0
        });
    }

    setGender(value) {
        this.setState({
            generoSelecionado: parseInt(value)
        })
    }

    handleChange(event) {
        //Called on update or created element
        this.setGender(event.target.value)
    }

    onCheckChange(anyFilmSelected) {
        this.setState({
            habilitarBotaoAdicicionar: !anyFilmSelected,
            habilitarBotaoAlterar: false,
            habilitarBotaoRemover: anyFilmSelected
        })

        this.refs.filmeForm.reset();
    }

    onClickAlterar(id) {
        let filme = this.state.filmes.find(gen => gen.id === id);

        this.refs.nome.value = filme.nome;
        this.setGender(filme.generoId);
        this.setState({
            habilitarBotaoAdicicionar: true,
            habilitarBotaoAlterar: true,
            habilitarBotaoRemover: true,
            filmeSelecionado: filme
        })
    }

    addFilme(e) {
        e.preventDefault();
        let { nome, filmeForm } = this.refs;
        let { filmes } = this.state;

        let novoFilme = {
            nome: nome.value,
            generoId: this.state.generoSelecionado
        }

        Axios.post(this.getUrl('/filme/adicionar'), JSON.stringify(novoFilme), {
            headers: {
                'Authorization': this.token,
                'Content-type': 'application/json'
            }
        })
            .then(({ status, data }) => {
                if (status === 200) {

                    novoFilme.id = data.id;
                    filmes.push(novoFilme);

                    this.setState({
                        filmes: filmes,
                        ultimoId: ultimoId
                    });

                    this.props.onMovieChanged(filmes);

                    filmeForm.reset();
                }
            }).catch(err => {
                console.error(err);
            })
    }

    removeFilme(e) {
        e.preventDefault();
        let { filmes, filmeSelecionado } = this.state;
        let selecionados = document.querySelectorAll("input:checked");

        if (filmeSelecionado != null || selecionados.length != 0) {
            let ids = filmeSelecionado != null ? [filmeSelecionado.id] : Array.from(selecionados).map(check =>
                parseInt(check.getAttribute("data-id"))
            );

            Axios.delete(this.getUrl('/filme/apagar'), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                },
                data: JSON.stringify(ids)
            })
                .then(({ status }) => {
                    if (status === 200) {
                        let filtered = filmes.filter(el => ids.indexOf(el.id) < 0);

                        this.setState({
                            filmes: filtered,
                            habilitarBotoes: true,
                            filmeSelecionado: null
                        })

                        this.props.onMovieChanged(filtered);
                        this.refs.filmeForm.reset();
                    }
                }).catch(err => console.error(err));
        }
    }

    updateFilme(e) {
        e.preventDefault();
        let { filmes, filmeSelecionado, generos } = this.state;
        let found = generos.find(gen => gen.id === this.state.generoSelecionado);

        Object.assign(filmeSelecionado, {
            nome: this.refs.nome.value,
            genero: found.nome,
            generoId: found.id
        });

        if (filmeSelecionado != null) {
            Axios.put(this.getUrl('/filme/alterar'), JSON.stringify(filmeSelecionado), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            })
                .then(({ status }) => {
                    if (status === 200) {
                        filmes[filmes.findIndex((f) => f.id === filmeSelecionado.id)] = filmeSelecionado;

                        this.setState({
                            filmes: filmes,
                            habilitarBotaoAdicicionar: true,
                            habilitarBotaoAlterar: false,
                            habilitarBotaoRemover: false,
                            filmeSelecionado: null
                        })

                        this.props.onMovieChanged(filmes);
                        this.refs.filmeForm.reset();
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        let {
            filmes,
            generos,
            handlers } = this.state;

        return (
            <div className="filmes">
                <h3> Filmes </h3>
                <form ref="filmeForm">
                    <div className="container">
                        <div className="row">
                            <div className="form-group col-8 movie-name">
                                <input
                                    type="text"
                                    ref="nome"
                                    placeholder="Nome"
                                    className="form-control" />
                            </div>
                            <div className="form-group col-sm genres">
                                <GeneroDropdown
                                    generos={generos}
                                    selected={handlers.generoSelecionado}
                                    onChange={handlers.handleChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col" style={{ paddingLeft: "0px" }}>
                                <BotaoBase
                                    valor="Adicionar"
                                    enabled={this.state.habilitarBotaoAdicicionar}
                                    action={(e) => {
                                        e.preventDefault(); 
                                        this.addFilme(e) 
                                    }} />
                            </div>
                            <div className="form-group col" style={{ padding: "0px" }}>
                                <BotaoBase
                                    valor="Remover"
                                    enabled={this.state.habilitarBotaoRemover}
                                    action={(e) => { 
                                        e.preventDefault();
                                        this.removeFilme(e) 
                                    }} />
                            </div>
                            <div className="form-group col" style={{ paddingRight: "0px" }}>
                                <BotaoBase
                                    valor="Concluir alteração"
                                    enabled={this.state.habilitarBotaoAlterar}
                                    action={(e) => { 
                                        e.preventDefault();
                                        this.updateFilme(e) 
                                    }} />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="well">
                    <table id="tableFilmes" className="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Genero</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filmes.map(
                                (f =>
                                    <FilmeGenero
                                        key={f.id} {...f}
                                        generos={generos}
                                        containerId={"#tableFilmes"}
                                        onClickAlterar={handlers.onClickAlterar}
                                        onCheckChange={handlers.onCheckChange} />))
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        );
    }
}