// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import { Modal } from "react-bootstrap";
import Component from "../Components";
import DeleteModal from "./DeleteModal";

import { withRouter } from "react-router-dom";

export class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditModal: false,
      showDeleteModal: false,
      isDeleting: false,
    };
  }

  setShowEditModal = () => {
    this.setState({ showEditModal: true });
  };

  setHideEditModal = () => {
    this.setState({ showEditModal: false });
  };

  handleSubmitEdit = (hasEdit) => {
    this.setHideEditModal();

    if (hasEdit) {
      this.props.onSubmitEdit();
    }
  }

  setShowDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  setHideDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  handleSubmitDelete = () => {
    this.props.onSubmitDelete();
  }

  render() {
    return (
      <span>
        <div
          className="row"
          style={{ backgroundColor: "", position: "relative", left: "20px" }}
        >
          <div
            onClick={() => this.setShowDeleteModal()}
            className="d-flex justify-content-center"
            style={{
              border: "2px solid",
              borderColor: "grey",
              color: "black",
              width: "60px",
              alignText: "center",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "12px",
              marginRight: "12px",
              height: "25px"
            }}
          >
            Delete
          </div>
          <div
            onClick={() => this.setShowEditModal()}
            className="d-flex justify-content-center"
            style={{
              border: "2px solid",
              borderColor: "grey",
              color: "black",
              width: "60px",
              alignText: "center",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "12px",
              height: "25px"
            }}
          >
            Edit
          </div>

          {this.props.data.lastmodified ? (
            <span
              className="align-items-center col"
              style={{ postition: "absolute", marginTop: "10px" }}
            >
              <small style={{ color: "grey" }}>
                {" "}
                Last Modified:{" "}
                {new Date(this.props.data.lastmodified.toDate()).toDateString()}
              </small>
            </span>
          ) : null}
        </div>
        <Modal
          onHide={this.setHideEditModal}
          show={this.state.showEditModal}
          dialogClassName="modal-dialog modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ "margin-top": "50px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Edit Hawker Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Component.ListForm
              toggle="edit"
              id={this.props.id}
              data={this.props.data}
              onSubmitEdit={this.handleSubmitEdit}
            />
          </Modal.Body>
        </Modal>
        <DeleteModal 
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={this.setHideDeleteModal}
          docId={this.props.id}
          originalName={this.props.data.name} 
          onSubmitDelete={this.handleSubmitDelete}
          />
      </span>
    );
  }
}

export default withRouter(Popup);
