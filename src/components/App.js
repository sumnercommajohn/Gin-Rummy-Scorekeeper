import React from 'react';
import base from '../base';
import CurrentGame from './CurrentGame';
import PreviousGames from './PreviousGames';

class App extends React.Component {
    state = {
        currentGame: {
            p1Total: 0,
            p1Gins: 0,
            p2Total: 0,
            p2Gins: 0,
            rounds: [],
            finished: '',
            winner: '',
        },

        previousGames: [],

        playerNames: {},
    };

    componentDidMount() {
        // Grab the url path
        const { params } = this.props.match;

        // Grab names from URL as a fallback in case they didn't navigate in from MatchUp Screen
        // !! This will get messed up if either player name contains a hyphen !!
        const names = params.playerNames.split('-');

        // Grab player names, checking the history prop provided by Router first
        // and using the url version only if there are no names stored in the location prop,
        const playerNames = this.props.location.state
            ? { ...this.props.location.state }
            : { p1: names[0], p2: names[1] };

        // Firebase syncs....This is not dry but I think firebase has
        // Sync currentGame state in firebase
        this.ref = base.syncState(`${params.playerNames}/currentGame`, {
            context: this,
            state: 'currentGame',
            defaultValue: {
                p1Total: 0,
                p1Gins: 0,
                p2Total: 0,
                p2Gins: 0,
                rounds: [],
                finished: '',
                winner: '',
            },
        });

        // Sync previousGames
        this.ref2 = base.syncState(`${params.playerNames}/previousGames`, {
            context: this,
            state: 'previousGames',
            asArray: true,
        });

        // Sync player names
        this.ref3 = base.syncState(`${params.playerNames}/playerNames`, {
            context: this,
            state: 'playerNames',
        });

        // Set player names if we haven't already
        if (!Object.values(this.state.playerNames).length) {
            this.setState({ playerNames });
        }
    }

    componentWillUnmount() {
        // unbind the database to prevent memory leak
        base.removeBinding(this.ref);
        base.removeBinding(this.ref2);
        base.removeBinding(this.ref3);
    }

    calculateScores = currentGame => {
        const game = { ...currentGame };
        // Total the scores
        game.p1Total = currentGame.rounds.reduce((accum, currentRound) => accum + currentRound.p1Score, 0);
        game.p2Total = currentGame.rounds.reduce((accum, currentRound) => accum + currentRound.p2Score, 0);
        // Total the gins
        game.p1Gins = currentGame.rounds.reduce((accum, currentRound) => {
            if (currentRound.gin && currentRound.winner === 'p1') accum++;
            return accum;
        }, 0);
        game.p2Gins = currentGame.rounds.reduce((accum, currentRound) => {
            if (currentRound.gin && currentRound.winner === 'p2') accum++;
            return accum;
        }, 0);
        // Check for winner and game-over
        if (Math.max(game.p1Total, game.p2Total) >= 100) {
            game.finished = Date.now();
            game.winner = game.p1Total > game.p2Total ? 'p1' : 'p2';
        } else {
            game.finished = '';
            game.winner = '';
        }

        return game;
    };

    addRound = newRound => {
        let currentGame = { ...this.state.currentGame };
        currentGame.rounds = [...currentGame.rounds, newRound];
        currentGame = this.calculateScores(currentGame);

        this.setState({ currentGame });
    };

    updateRound = (key, updatedRound) => {
        let currentGame = { ...this.state.currentGame };

        const round = {
            p1Score: parseFloat(updatedRound.p1Score) || 0,
            p2Score: parseFloat(updatedRound.p2Score) || 0,
            gin: updatedRound.gin,
            winner: updatedRound.winner,
        };
        currentGame.rounds[key] = round;
        currentGame = this.calculateScores(currentGame);
        this.setState({ currentGame });
    };

    deleteRound = index => {
        let currentGame = { ...this.state.currentGame };
        const { rounds } = currentGame;
        currentGame.rounds = rounds.slice(0, index).concat(rounds.slice(index + 1, rounds.length));
        currentGame = this.calculateScores(currentGame);

        this.setState({ currentGame });
    };

    newGame = e => {
        e.preventDefault();
        const previousGames = [...this.state.previousGames, this.state.currentGame];
        const currentGame = {
            p1Total: 0,
            p1Gins: 0,
            p2Total: 0,
            p2Gins: 0,
            rounds: [],
            finished: null,
            winner: null,
        };

        this.setState({ previousGames });
        this.setState({ currentGame });
    };

    deleteGame = index => {
        const games = [...this.state.previousGames];
        const previousGames = games.slice(0, index).concat(games.slice(index + 1, games.length));
        this.setState({ previousGames });
    };

    renderPrevious = previousGames => {
        if (previousGames.length > 0) {
            return (
                <PreviousGames
                    playerNames={this.state.playerNames}
                    games={this.state.previousGames}
                    deleteGame={this.deleteGame}
                />
            );
        }
    };

    render() {
        return (
            <div className="app">
                <CurrentGame
                    playerNames={this.state.playerNames}
                    currentGame={this.state.currentGame}
                    addRound={this.addRound}
                    updateRound={this.updateRound}
                    deleteRound={this.deleteRound}
                    newGame={this.newGame}
                    previousGames={this.state.previousGames}
                />

                {this.renderPrevious(this.state.previousGames)}
            </div>
        );
    }
}

export default App;
