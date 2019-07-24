import React from 'react';
import PropTypes from 'prop-types';

class RoundRow extends React.Component {
    static propTypes = {
        round: PropTypes.shape({
            p1Score: PropTypes.number,
            p2Score: PropTypes.number,
            gin: PropTypes.bool,
            winner: PropTypes.string,
        }),
        id: PropTypes.number,
        updateRound: PropTypes.func,
        deleteRound: PropTypes.func,
    };

    state = {
        edit: false,
    };

    p1ScoreRef = React.createRef();

    p2ScoreRef = React.createRef();

    ginRef = React.createRef();

    editRef = React.createRef();

    componentWillMount() {
        console.log('mounting...');
        const initialRound = { ...this.props.round };
        this.setState({ initialRound });
    }

    handleEdit = e => {
        e.preventDefault();
        const { edit } = this.state;
        this.setState({ edit: !edit });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { edit } = this.state;
        const initialRound = { ...this.state.initialRound };
        const key = this.props.id;
        const updatedRound = {
            p1Score: parseFloat(this.p1ScoreRef.current.value) || 0,
            p2Score: parseFloat(this.p2ScoreRef.current.value) || 0,
            gin: this.ginRef.current.checked,
        };
        updatedRound.winner = updatedRound.p1Score > updatedRound.p2Score ? 'p1' : 'p2';
        if (
            (!updatedRound.p1Score && !updatedRound.p2Score) ||
            (updatedRound.p1Score && updatedRound.p2Score) ||
            (updatedRound.gin && updatedRound[`${updatedRound.winner}Score`] < 25)
        ) {
            console.log('You done messed up.');
            this.props.updateRound(key, initialRound);
        } else {
            this.props.updateRound(key, updatedRound);
        }

        this.setState({ edit: !edit });
    };

    handleChange = e => {
        const key = this.props.id;
        const round = { ...this.props.round };
        const thisInput = e.currentTarget;
        if (thisInput.type === 'number') {
            const other = thisInput.name === 'p1Score' ? 'p2Score' : 'p1Score';
            round[other] = 0;
            round[thisInput.name] = thisInput.value;
        } else {
            round[thisInput.name] = thisInput.checked;
        }

        if (round.p1Score !== round.p2Score) {
            round.winner = round.p1Score > round.p2Score ? 'p1' : 'p2';
        }

        this.props.updateRound(key, round);
    };

    handleDelete = () => {
        console.log('Handling..');
        const index = this.props.id;
        this.props.deleteRound(index);
    };

    render() {
        const round = { ...this.props.round };
        const { id } = this.props;
        const p1Gin = round.gin && round.winner === 'p1' ? 'gin' : '';
        const p2Gin = round.gin && round.winner === 'p2' ? 'gin' : '';

        if (this.state.edit) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <div className="round-row">
                        <span>
                            <button type="submit" className="submit-row">
                                Done
                            </button>
                            <input
                                type="number"
                                name="p1Score"
                                ref={this.p1ScoreRef}
                                onChange={this.handleChange}
                                value={round.p1Score || ''}
                            />
                        </span>
                        <span>
                            <label htmlFor="gin" className="gin">
                                Gin?{' '}
                            </label>
                            <input
                                type="checkbox"
                                name="gin"
                                id="gin"
                                checked={round.gin}
                                ref={this.ginRef}
                                onChange={this.handleChange}
                            />
                        </span>
                        <span>
                            <input
                                type="number"
                                name="p2Score"
                                ref={this.p2ScoreRef}
                                onChange={this.handleChange}
                                value={round.p2Score || ''}
                            />
                            <button type="button" className="delete-row-edit" onClick={this.handleDelete}>
                                X
                            </button>
                        </span>
                    </div>
                </form>
            );
        }

        return (
            <div className={`round-row ${round.winner}`}>
                <button type="button" className="edit-row" onClick={this.handleEdit}>
                    Edit
                </button>
                <h4>
                    <span className={p1Gin}>{round.p1Score || '-'}</span>
                </h4>
                <h3>Round {id + 1}</h3>
                <h4>
                    <span className={p2Gin}>{round.p2Score || '-'}</span>
                </h4>
                <button type="button" className="delete-row" onClick={this.handleDelete}>
                    X
                </button>
            </div>
        );
    }
}

export default RoundRow;

// Write function that
