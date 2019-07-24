import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import AddRoundForm from './AddRoundForm';
import NewGameForm from './NewGameForm';
import RoundRow from './RoundRow';

class CurrentGame extends React.Component {
    static propTypes = {
        currentGame: PropTypes.shape({
            p1Total: PropTypes.number,
            p2Total: PropTypes.number,
            p1Gins: PropTypes.number,
            p2Gins: PropTypes.number,
            rounds: PropTypes.array,
            finished: PropTypes.string,
            winner: PropTypes.string,
        }),
        previousGames: PropTypes.array,
        playerNames: PropTypes.object,
        updateRound: PropTypes.func,
        addRound: PropTypes.func,
        newgame: PropTypes.func,
        deleteRound: PropTypes.func,
    };

    renderRows = game =>
        game.rounds
            .map((round, index) => {
                const transitionOptions = {
                    classNames: 'game-row',
                    key: index,
                    timeout: { enter: 250, exit: 0 },
                };
                return (
                    <CSSTransition {...transitionOptions}>
                        <RoundRow
                            round={round}
                            key={index}
                            id={index}
                            updateRound={this.props.updateRound}
                            deleteRound={this.props.deleteRound}
                        />
                    </CSSTransition>
                );
            })
            .reduceRight((accum, row) => [...accum, row], []);

    render() {
        const game = this.props.currentGame;
        if (!game.rounds) {
            game.rounds = []; // to prevent 'undefined' error that occurs with firebase syncState
        }
        const { p1, p2 } = this.props.playerNames;
        const currentRound = `Round ${game.rounds.length + 1}`;
        const p1Gins = '⭐️'.repeat(game.p1Gins);
        const p2Gins = '⭐️'.repeat(game.p2Gins);
        const winnerName = game.finished && game.winner === 'p1' ? p1 || 'Player 1' : p2 || 'Player 2';
        const previousGames = this.props.previousGames.length;

        const tickerTransOptions = {
            classNames: 'ticker',
            timeout: { enter: 500, exit: 500 },
        };
        return (
            <div className="current-game">
                <div className={`game ${game.winner || ''}`}>
                    <div className="info-links">
                        <a
                            href="https://www.wikihow.com/Play-Gin-Rummy"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="How To Play"
                        >
                            <i className="fas fa-question-circle" />
                        </a>
                        <a
                            href="https://github.com/sumnercommajohn/gin-scorekeep"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on GitHub"
                        >
                            <i className="fab fa-github" />
                        </a>
                    </div>
                    <h1 className={`game-heading ${game.winner || ''}`}>
                        {game.finished ? `${winnerName} Wins!` : `Game ${previousGames + 1}`}
                    </h1>
                    <h3>{game.finished ? `Game Over` : currentRound}</h3>
                    <div className="scores">
                        <div className="player-box p1">
                            <h2 className="">{p1 || 'Player 1'}</h2>
                            <h3 className="ticker">
                                <TransitionGroup component="span" className="ticker">
                                    <CSSTransition key={game.p1Total} {...tickerTransOptions}>
                                        <span>{game.p1Total}</span>
                                    </CSSTransition>
                                </TransitionGroup>
                                <br />
                                <span className="gins">{p1Gins}</span>
                            </h3>
                        </div>
                        <span />
                        <div className="player-box p2">
                            <h2 className="">{p2 || 'Player 2'}</h2>
                            <h3 className="ticker">
                                <TransitionGroup component="span" className="ticker">
                                    <CSSTransition key={game.p2Total} {...tickerTransOptions}>
                                        <span>{game.p2Total}</span>
                                    </CSSTransition>
                                </TransitionGroup>
                                <br />
                                <span className="gins">{p2Gins}</span>
                            </h3>
                        </div>
                    </div>
                    <div className="game-form">
                        <hr />
                        {game.finished ? (
                            <NewGameForm newGame={this.props.newGame} winner={game.winner} />
                        ) : (
                            <AddRoundForm addRound={this.props.addRound} />
                        )}
                        <hr />
                    </div>
                    <TransitionGroup className="rows" component="div">
                        {this.renderRows(game)}
                    </TransitionGroup>
                </div>
            </div>
        );
    }
}

export default CurrentGame;
