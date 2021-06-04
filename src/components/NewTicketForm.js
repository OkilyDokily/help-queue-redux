import React from "react";
import PropTypes from "prop-types"; //import PropTypes
import ReusableForm from "./ReusableForm";
import { useFirestore } from 'react-redux-firebase'



function NewTicketForm(props) {
  const firestore = useFirestore();

  function addTicketToFirestore(event) {
    event.preventDefault();
    props.onNewTicketCreation();
    
    return firestore.collection('tickets').add({
      names: event.target.names.value,
      location: event.target.location.value,
      issue: event.target.issue.value,
      timeOpen: firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      })
  }

  return (    
      <React.Fragment>
        <ReusableForm
          formSubmissionHandler={addTicketToFirestore}
          buttonText="Help!" />
      </React.Fragment>
  );
}

NewTicketForm.propTypes = {
  onNewTicketCreation: PropTypes.func
};

export default NewTicketForm;