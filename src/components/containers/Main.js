import React from 'react';
import Axios from 'axios';

import Filmes from './Filmes';
import Generos from './Generos';
import Locacao from './Locacao';
import ComponentBase from '../ComponentBase';

/**
 * Container principal da aplicação, aqui são carregados os dados necessários 
 * aos componentes filhos {@see Filmes}, {@see Generos} e {@see Locacao}, assim 
 * que o componente pai Main e carregado, no evento de ciclo de vida 
 * *componentWillMount* são feitas requisições ao servidor. Após preparar os 
 * dados recebidos para os seus devidos filhos os restantes dos componentes são 
 * renderizados, este componente envia aos seus filhos alguns listeners que vão 
 * em tempo real atualizar o estado do {@see state} permitindo assim acompanhar 
 * as alterações feitas por um componente filho em outro componente filho
 */
export default class Main extends ComponentBase {

    constructor() {
        super();

        this.state = {
            filmes: [], generos: [], locacoes: [],
            //Event handlers para serem repassados aos componentes filhos
            handlers: {
                onMovieChanged: this.onMoviesChanged.bind(this),
                onGenresChanged: this.onGenresChanged.bind(this),
                onHiresChanged: this.onHiresChanged.bind(this)
            }
        }
    }

    /**
     * Evento disparado pelo componente {@see Filmes} ao realizar alguma ação
     * sobre o estado da propriedade `filmes`
     * @param {Array} movies Lista de filmes previamente carregados do servidor 
     */
    onMoviesChanged(movies) {
        this.setState({
            filmes: movies
        })
    }

    /**
     * Evento disparado pelo componente {@see Locacao} ao realizar alguma ação
     * sobre o estado da propriedade `hires`
     * @param {Array} hires Lista de locações previamente carregados do servidor 
     */
    onHiresChanged(hires) {
        this.setState({
            locacoes: hires
        })
    }

    /**
     * Evento disparado pelo componente {@see Generos} ao realizar alguma ação
     * sobre o estado da propriedade `generos`
     * @param {Array} genres Lista de generos previamente carregados do servidor 
     */
    onGenresChanged(genres) {
        this.setState({
            generos: genres
        })
    }

    /**
     * Executa o carregamento dos dados dos componentes filhos {@see Filmes}, {@see Generos} e {@see Locacao}
     * para poder enviar uma referência destes dados carregados a cada filho (de forma contextualizada),
     * será enviado também um listener para notificar o componente pai (this), que houve alteraçã na
     * propriedade enviada para o filho, diante deste cenário, todos os filhos que recebem mais de uma 
     * cópia de uma determinada propriedade {@see Filmes} serão atualizados de forma automática.
     */
    componentWillMount() {
        //Obtém de forma paralela os dados que serão utilizados pelos componentes filhos
        Promise.all([
            Axios.get(this.getUrl('/filme/pegar-todos'), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            }),
            Axios.get(this.getUrl('/genero/pegar-todos'), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            }),
            Axios.get(this.getUrl('/locacao/pegar-todas'), {
                headers: {
                    'Authorization': this.token,
                    'Content-type': 'application/json'
                }
            })
        ]).then((response) => {
            let [movies, genres, hires] = response;
            //Somente continua se todas as requisições obtiverem sucesso
            if (movies.status === 200 && genres.status === 200 && hires.status === 200) {
                this.setState({
                    filmes: movies.data,
                    generos: genres.data,
                    locacoes: hires.data
                });
            }
        }).catch(err => console.error(err));
    }

    /*
     * Renderiza o container principal 
     */
    render() {
        const {
            filmes,
            generos,
            locacoes,
            handlers } = this.state;

        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col col-lg-2">
                    </div>
                    <div className="col-7">
                        <ul className="nav nav-pills nav-fill">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="#movie"
                                    id="movie-tab"
                                    data-toggle="tab"
                                    role="tab"
                                    aria-controls="movie"
                                    aria-selected="true"
                                >Filmes</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="genres-tab"
                                    data-toggle="tab"
                                    href="#genres"
                                    role="tab"
                                    aria-controls="genres"
                                    aria-selected="false"
                                >Gêneros</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="hires-tab"
                                    data-toggle="tab"
                                    href="#hires"
                                    role="tab"
                                    aria-controls="hires"
                                    aria-selected="false"
                                >Locações</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div
                                className="tab-pane fade show active"
                                id="movie"
                                role="tabpanel"
                                aria-labelledby="movie-tab">
                                <Filmes
                                    movies={filmes}
                                    genres={generos}
                                    onMovieChanged={handlers.onMovieChanged}
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="genres"
                                role="tabpanel"
                                aria-labelledby="genres-tab">
                                <Generos
                                    genres={generos}
                                    onGenresChanged={handlers.onGenresChanged}
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="hires"
                                role="tabpanel"
                                aria-labelledby="hires-tab">
                                <Locacao
                                    hires={locacoes}
                                    movies={filmes}
                                    onHiresChanged={handlers.onHiresChanged}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col col-lg-2">
                    </div>
                </div>
            </div>
        )
    }
}