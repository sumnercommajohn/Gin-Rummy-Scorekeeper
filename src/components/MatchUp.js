import React from 'react';
import PropTypes from 'prop-types';

class MatchUp extends React.Component {
    p1Input = React.createRef();

    p2Input = React.createRef();

    static propTypes = {
        history: PropTypes.object,
    };

    // Takes both player names, joins them with a hyphen and sticks it into the url bar using the history.push() method provided by Router
    // This method also takes an object containing the player names to be stored in state for that route.
    // This is how I get to the player names in the app itself

    goToMatch = e => {
        e.preventDefault();
        const p1 = this.p1Input.current.value;
        const p2 = this.p2Input.current.value;
        const playerNames = [p1, p2].join('-');
        this.props.history.push(`/matches/${playerNames}`, { p1, p2 });
    };

    render() {
        return (
            <main className="match-wrap">
                <div className="match-up">
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
                    <h1 className="title">Gin Scorekeeper</h1>
                    <h2>Who's Playing?</h2>
                    <form action="" className="match-up-form" onSubmit={this.goToMatch}>
                        <div className="wrap">
                            <div className="form-group">
                                <label htmlFor="p1">
                                    Player 1 Name
                                    <input id="p1" name="p1" ref={this.p1Input} type="text" />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="p2">
                                    Player 2 Name
                                    <input id="p2" name="p2" ref={this.p2Input} type="text" />
                                </label>
                            </div>
                        </div>
                        <button className="go-match" type="submit">
                            Go To Match
                        </button>
                    </form>
                </div>
            </main>
        );
    }
}

export default MatchUp;
