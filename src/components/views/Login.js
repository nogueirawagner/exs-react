import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'
import BotaoBase from '../BotaoBase';

/**
 * Classe responsável por atender a roda '/' do app
 */
export default class Login extends React.Component {

    /**
     * Realiza o login do usuário junto ao servidor autenticando o usário com os dados
     * fornecidos e caso esteja tudo certo, armazena os dados de autenticação recebidos
     * do server dentro do {@see localStorage}
     */
    doLogin() {
        let { username, pass } = this.refs;
        let { history } = this.props;
        let user = {
            cpf: username.value,
            senha: pass.value
        }

        if (user.cpf === "" || user.senha === "")
            return;

        Axios.post('http://18.228.109.23/api/v1/conta', JSON.stringify(user), {
            headers: {
                'Content-type': 'application/json'
            }
        }).then(({ status, data }) => {
            if (status === 200) {
                localStorage.setItem('auth', JSON.stringify(data.result));
                history.push("/index");
            }
        }).catch(err => console.error(err));
    }

    /**
     * Renderização do componente de login
     */
    render() {
        return (
            <div>
                <div>
                    <div className="container" style={{ marginTop: "40px" }}>
                        <div className="row">
                            <div className="col-sm-6 col-md-4 col-md-offset-4">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-10  col-md-offset-1 ">
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="glyphicon glyphicon-user"></i>
                                                            </span>
                                                            <input
                                                                type="text"
                                                                ref="username"
                                                                name="username"
                                                                id="username"
                                                                placeholder="CPF"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="glyphicon glyphicon-lock"></i>
                                                            </span>
                                                            <input
                                                                type="password"
                                                                ref="pass"
                                                                name="pass"
                                                                id="pass"
                                                                placeholder="Senha"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <BotaoBase valor="Login" action={() => { this.doLogin() }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="panel-footer ">
                                        <Link to="/account" style={{ marginLeft: `${5}px` }}> Criar nova conta </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


