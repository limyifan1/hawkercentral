// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import { Button, Modal, Spinner } from "react-bootstrap";
import Helpers from "../Helpers/helpers";

const sendDeleteEmail = async(docid, originalName) => {
  await Helpers.sendEmailToUpdateListing(docid, originalName, "delete", {})
    .then((result) => {
      console.log(result);
    })
    .catch(function (error) {
      console.error("Error sending email: ", error);
    });
};

export class DeleteModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteModal: false,
      isDeleting: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.showDeleteModal !== prevProps.showDeleteModal) {
      this.setState({ showDeleteModal: this.props.showDeleteModal });
    }
  }

  setHideDeleteModal = () => {
    this.props.hideDeleteModal();
  };

  handleSubmitDelete = async () => {
    this.setState({ isDeleting: true });
    await sendDeleteEmail(this.props.docId, this.props.originalName)
      .then(() => {
        this.setHideDeleteModal();
        this.setState({ isDeleting: false });
        this.props.onSubmitDelete();
      });
  }

  render() {
    return (
        <Modal
          onHide={this.setHideDeleteModal}
          show={this.state.showDeleteModal}
          dialogClassName="modal-dialog modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ "marginTop": "50px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Delete Hawker Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this hawker listing?</p>
            <Button
              class="shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#b48300",
                float: "right",
                marginLeft: "12px",
              }}
              onClick={this.setHideDeleteModal}
              disabled={this.state.isDeleting}
            >
              <p style={{ 
                margin: "0rem",
                color: "black", 
              }}>No</p>
            </Button>
            <Button
              class="shadow-sm"
              style={{
                backgroundColor: "#b48300",
                borderColor: "#b48300",
                float: "right",
              }}
              onClick={this.handleSubmitDelete}
              disabled={this.state.isDeleting}
            >
              { this.state.isDeleting 
              ? <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              : <p style={{ margin: "0rem" }}>Yes</p> }
            </Button>
          </Modal.Body>
        </Modal>
    );
  }
}

export default DeleteModal;
