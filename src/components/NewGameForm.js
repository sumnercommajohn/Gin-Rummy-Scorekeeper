import React from 'react';
import PropTypes from 'prop-types';

class NewGameForm extends React.Component {
    static propTypes = {
        newGame: PropTypes.func,
        winner: PropTypes.string,
    };

    render() {
        return (
            <form action="" className="score-input" onSubmit={this.props.newGame}>
                <div className="round-row">
                    <button className={`new-game ${this.props.winner}`} type="submit">
                        New Game
                    </button>
                </div>
            </form>
        );
    }
}

export default NewGameForm;
