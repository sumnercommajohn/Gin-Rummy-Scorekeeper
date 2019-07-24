import React from 'react';
import PropTypes from 'prop-types';

class PreviousGame extends React.Component {
    static propTypes = {
        game: PropTypes.object,
        id: PropTypes.number,
        deleteGame: PropTypes.func,
    };

    handleDelete = () => {
        const index = this.props.id;
        this.props.deleteGame(index);
    };

    render() {
        const { game } = this.props;
        const { p1, p2 } = this.props.playerNames;
        const index = this.props.id;
        const date = new Date(+game.finished);
        const p1Gins = '️️️⭐️'.repeat(game.p1Gins);
        const p2Gins = '⭐️'.repeat(game.p2Gins);
        return (
            <li className={`game ${game.winner}`}>
                <button type="button" className="delete-game" onClick={this.handleDelete}>
                    x
                </button>
                <h2 className="game-heading">
                    <span>Game {index + 1}</span>
                    <span> - </span>
                    <span>
                        <small>{date.toDateString()}</small>
                    </span>
                </h2>
                <div className="scores">
                    <div className="player-box">
                        <h3 className="player">{p1 || 'Player 1'}</h3>
                        <h4 className="score">{game.p1Total}</h4>
                        <span className="gins">{p1Gins}</span>
                    </div>
                    <div className="player-box">
                        <h3 className="player">{p2 || 'Player 2'}</h3>
                        <h4 className="score">{game.p2Total}</h4>
                        <span className="gins">{p2Gins}</span>
                    </div>
                </div>
            </li>
        );
    }
}

export default PreviousGame;
