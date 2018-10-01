import React from 'react';

/**
 * Componente de botão genério, onde uma ação será enviada
 * por aquele que fizer uso deste componente, informando ainda se o botão
 * estará ou não habilitado.
 */
export default class BotaoBase extends React.Component {

    constructor() {
        super();

        this.types = [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark",
            "link"
        ]
    }

    /**
     * Renderização do componente de botão
     */
    render() {
        const { action, enabled } = this.props;
        let { buttonType } = this.props;

        if (buttonType == null || buttonType === "" || this.types.indexOf(buttonType) === -1)
            buttonType = "primary"

        return (
            <button
                className={`btn btn-small btn-${buttonType} btn-block form-control`}
                onClick={(e) => { 
                    e.preventDefault();
                    action(e) 
                }}
                disabled={enabled === undefined ? false : !enabled}>{this.props.valor}</button>
        );
    }
}