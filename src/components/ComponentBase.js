import React from 'react';

/**
 * Abstração básica de um componente utilizado por esta aplicação, onde comportamentos
 * padrão são definidos, para simplificar a manipulação de certos dados.
 */
export default class ComponentBase extends React.Component {

    /**
     * Obtém o token previamente armazenado no {@see localStorage}
     * 
     * @public
     * @property
     */
    get token() {
        return `bearer ${JSON.parse(localStorage.auth).access_token}`;
    }

    /**
     * Obtém o cpf do usário armazenado, no momento de logar-se,
     * dentro da {@see localStorage}
     * 
     * @public
     * @property
     */
    get userCpf() {
        return JSON.parse(localStorage.auth).user.cpf;
    }

    /**
     * Obtém todos os inputs que estejam checkados dentro de um determinado container.
     * 
     * @param {string} containerId Identificador do element que contém os inputs 
     */
    checkeds({ containerId }) {
        return Array.from(document.querySelectorAll(`${containerId} input:checked`));
    }

    /**
     * Retorna a url que identifica o servidor e o caminho desejado.
     * 
     * @param {string} path Caminho que se deseja acessar no servidor
     * @returns {string} Url completa de acesso ao servidor, jutamente do path fornecido
     */
    getUrl(path) {
        return `http://18.228.109.23/api/v1${path}`;
    }
}