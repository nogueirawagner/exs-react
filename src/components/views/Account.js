import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'

import BotaoBase from '../BotaoBase';

/**
 * Classe que responde a rota '/account' da aplicação, nesta view
 * o usuário irá criar uma nova conta que já estará apta a poder 
 * realizar login no sistema e começar a utilizar o CRUD
 */
export default class Account extends React.Component {

    /**
     * Criação do usário dentro do servidor utilizando os dados fornecidos
     */
    create() {
        const { 
            cpf, 
            senha, 
            resenha } = this.refs;

        if (senha.value != resenha.value)
            return;

        //Requisição POST para enviar os dados do usuário ao servidor
        Axios.post('http://18.228.109.23/api/v1/nova-conta',
            JSON.stringify({
                cpf: cpf.value,
                senha: senha.value,
                confirmaSenha: resenha.value
            }), {
                headers: {
                    'Content-type': 'application/json'
                }
            }
        )
            .then(({ status }) => {
                if (status === 200) {
                    alert('Conta criada com sucesso!');
                    cpf.value = senha.value = resenha.value = ""
                }
            }).catch(err => console.error(err));
    }

    /**
     * Renderização do componente de de criação de contas
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
                                                                    placeholder="CPF"
                                                                    type="text"
                                                                    ref="cpf"
                                                                    name="cpf"
                                                                    id="cpf"
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
                                                                    placeholder="Senha"
                                                                    type="password"
                                                                    ref="senha"
                                                                    name="senha"
                                                                    id="senha"
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
                                                                    placeholder="Confirma senha"
                                                                    type="password"
                                                                    ref="resenha"
                                                                    name="resenha"
                                                                    id="resenha"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <BotaoBase valor="Criar conta" action={() => { this.create() }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        
                                    </div>
                                    <div className="panel-footer ">
                                        <Link to='/'>← Voltar</Link><br></br>
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