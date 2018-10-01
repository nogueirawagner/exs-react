import React from 'react';
import { 
    Route, 
    BrowserRouter, 
    Switch, 
    Redirect 
} from 'react-router-dom'

import Login from './views/Login';
import Account from './views/Account';
import Main from './containers/Main';

/**
 * Verifica se o usuário que está tentando acessar uma determinada 
 * rota da aplicação está logado no sistema e se os dados de login
 * previamente armazenados não estão expirados.
 * 
 * @private
 * @returns {boolean} Indicação de validade da autenticação previamente
 * armazenada
 */
function isLoggedIn() {
    const auth = localStorage.auth;

    if(auth != null) {
        const { expires_in } = JSON.parse(auth);
        return auth != null && new Date(expires_in).getTime() >= new Date().getTime()
    }

    return false;
}

/**
 * Gerenciador de rotas da aplicação
 * 
 * @private
 */
class Router extends React.Component {

    /**
     * Renderiza a rota padrão
     */
    render() {
        return (
            <BrowserRouter>
                <Route path='/' component={Switcher} />
            </BrowserRouter>
        )
    }
}


/**
 * Componente para centralização das rotas disponíveis, sendo que a rota de acesso
 * a aplicação principal exige que o usuário esteja logadado (ou seja com os dados presentes
 * dentro do {@see localStorage})
 */
const Switcher = () => (
    <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/account' component={Account} />
        <Route path='/index' render={() => {
            return (!isLoggedIn() ? <Redirect to='/' /> : <Main />)
        }} />
    </Switch>
)

/**
 * Inicializador da aplicação, aqui a rota inicial('/') junto com o componente
 * responsável por responder por esta rota {@link Login} são carregados.
 */
export default class Bootstrap extends React.Component {

    render() {
        return (
            <div className="main">
                <Router />
            </div>
        )
    }
}