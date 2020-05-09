// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import { Modal } from "react-bootstrap";
import Component from "../Components";

import { withRouter } from "react-router-dom";

export class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      setShow: false,
    };
  }

  setShow = () => {
    this.setState({ show: true });
  };

  setHide = () => {
    this.setState({ show: false });
  };

  handleSubmitEdit = (hasEdit) => {
    this.setHide();

    if (hasEdit) {
      this.props.onSubmitEdit();
    }
  }

  render() {
    return (
      <span>
        <div
          class="row"
          style={{ backgroundColor: "", position: "relative", left: "20px" }}
        >
          <div
            onClick={() => this.setShow()}
            class="d-flex justify-content-center"
            style={{
              border: "2px solid",
              "border-color": "grey",
              color: "black",
              width: "60px",
              alignText: "center",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "12px",
            }}
          >
            Edit
          </div>

          {this.props.data.lastmodified ? (
            <span
              class="align-items-center col"
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
          onHide={this.setHide}
          show={this.state.show}
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
      </span>
    );
  }
}

export default withRouter(Popup);
