import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from 'react-redux';
import * as a from './../actions';
import { withFirestore } from 'react-redux-firebase'
import PropTypes from "prop-types";



class TicketControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      selectedTicket: null,
      editing: false
    }
  }


  componentWillUnmount() {
    console.log("component unmounted!");
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.masterTicketList).forEach(ticket => {
      const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    });
  }



  handleEditClick = () => {
    this.setState({ editing: true });
  }

  // handleEditingTicketInList = (ticketToEdit) => {
  //   const { dispatch } = this.props;
  //   const action = a.addTicket(ticketToEdit);
  //   dispatch(action);
  //   this.setState({
  //     editing: false,
  //     selectedTicket: null
  //   });
  // }

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = a.deleteTicket(id);
    dispatch(action);
    this.setState({ selectedTicket: null });
  }

  handleChangingSelectedTicket = (id) => {
    this.props.firestore.get({ collection: 'tickets', doc: id }).then((ticket) => {
      const firestoreTicket = {
        names: ticket.get("names"),
        location: ticket.get("location"),
        issue: ticket.get("issue"),
        id: ticket.id
      }
      this.setState({ selectedTicket: firestoreTicket });
    });
  }

  handleAddingNewTicketToList = (newTicket) => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({

        selectedTicket: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  render() {
    let currentlyVisibleState;
    let buttonText;

    if (this.state.editing) {
      currentlyVisibleState = <EditTicketForm ticket={this.state.selectedTicket} onEditTicket={this.handleEditingTicketInList} />
      buttonText = "Return to Ticket List";
    }
    else if (this.state.selectedTicket != null) {

      currentlyVisibleState = <TicketDetail ticket={this.state.selectedTicket} onClickingDelete={this.handleDeletingTicket} onClickingEdit={this.handleEditClick} />
      buttonText = "Return to Ticket List";
    }
    else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList} />; buttonText = buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList ticketList={this.props.masterTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
      buttonText = "Add Ticket";
    }

    return (
      <React.Fragment>
        <div>{currentlyVisibleState}</div>
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );

  }

}


const mapStateToProps = state => {
  return {
    masterTicketList: state.masterTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

TicketControl.propTypes = {
  formVisibleOnPage: PropTypes.bool
};

export default withFirestore(TicketControl);