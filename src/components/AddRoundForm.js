import React from 'react';
import PropTypes from 'prop-types';

class AddRoundForm extends React.Component {
    static propTypes = {
        addRound: PropTypes.func,
    };

    state = {
        error: '',
    };

    p1ScoreRef = React.createRef();

    p2ScoreRef = React.createRef();

    ginRef = React.createRef();

    newRound = e => {
        e.preventDefault();

        const round = {
            p1Score: parseFloat(this.p1ScoreRef.current.value) || 0,
            p2Score: parseFloat(this.p2ScoreRef.current.value) || 0,
            gin: this.ginRef.current.checked,
        };
        round.winner = round.p1Score > round.p2Score ? 'p1' : 'p2';

        this.checkScoresAndSetState(round, e);
    };

    zeroOther = e => {
        const thisInput = e.currentTarget;
        const p1ScoreInput = this.p1ScoreRef.current;
        const p2ScoreInput = this.p2ScoreRef.current;

        const other = thisInput === p1ScoreInput ? p2ScoreInput : p1ScoreInput;

        other.value = 0;
    };

    checkScoresAndSetState = (round, e) => {
        if (!round.p1Score && !round.p2Score) {
            this.setState({
                error: 'You must enter a score for one player.',
            });
        } else if (round.p1Score && round.p2Score) {
            this.setState({
                error: 'Only one player may score points in a round.',
            });
        } else if (round.gin && round[`${round.winner}Score`] < 25) {
            this.setState({
                error: 'It is not possible to score below 25 with a Gin.',
            });
        } else {
            this.props.addRound(round);
            this.setState({ error: '' });
            e.currentTarget.reset();
        }
    };

    render() {
        return (
            <form action="" className="score-input" onSubmit={this.newRound}>
                <div className="round-error">{this.state.error}</div>
                <div className="round-row">
                    <input type="number" name="p1-score" ref={this.p1ScoreRef} onChange={this.zeroOther} />
                    <span>
                        <label htmlFor="gin" className="gin">
                            Gin? <input type="checkbox" name="gin" id="gin" ref={this.ginRef} />
                        </label>
                    </span>
                    <input type="number" name="p2-score" ref={this.p2ScoreRef} onChange={this.zeroOther} />
                </div>
                <div className="round-row">
                    <button className="add-round" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}

export default AddRoundForm;
