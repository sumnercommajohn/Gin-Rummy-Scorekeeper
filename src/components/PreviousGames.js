import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PreviousGame from './PreviousGame';

class PreviousGames extends React.Component {
    static propTypes = {
        games: PropTypes.array,
        playerNames: PropTypes.object,
        deleteGame: PropTypes.func,
    };

    renderGames = games =>
        games
            .map((game, index) => {
                const transitionOptions = {
                    classNames: 'prev-game-trans',
                    key: index,
                    timeout: { enter: 250, exit: 0 },
                };

                return (
                    <CSSTransition {...transitionOptions}>
                        <PreviousGame
                            game={game}
                            key={index}
                            id={index}
                            playerNames={this.props.playerNames}
                            deleteGame={this.props.deleteGame}
                        />
                    </CSSTransition>
                );
            })
            .reduceRight((accum, game) => [...accum, game], []);

    render() {
        return (
            <div className="previous-games">
                <TransitionGroup component="ol">{this.renderGames(this.props.games)}</TransitionGroup>
            </div>
        );
    }
}

export default PreviousGames;
