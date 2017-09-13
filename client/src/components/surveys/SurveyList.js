import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
    componentDidMount() {
        console.log(this.props);
        this.props.fetchSurveys();
    }

    renderSurveys() {
        return this.props.surveys.reverse().map((survey) => {
            return (
                <div className="card blue-grey darken-1" key={survey._id}>
                    <div className="card-content white-text">
                        <span className="card-title">{survey.title}</span>
                        <p>
                            {survey.body}
                        </p>
                        <p className="right">
                            Sent On: {new Date(survey.dateSent).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="card-action">
                        <a>Yes votes: {survey.yes} </a>
                        <a>No votes: {survey.no} </a>
                    </div>
                </div>

            );
        });
    }

    render() {
        return (
            <div>
                {this.renderSurveys()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { surveys: state.surveys };
};

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);