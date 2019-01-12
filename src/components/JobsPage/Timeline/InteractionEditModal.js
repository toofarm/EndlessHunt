import React, { Component } from "react";
import Modal from "react-modal";

import { SlideDown } from "react-slidedown";
import "../../../../node_modules/react-slidedown/lib/slidedown.css";

import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

import { toggleModal, updateInteraction, deleteInteraction } from "../../../actions";
import { byPropKey } from "../../../constants/utilities";

import { connect } from "react-redux";

const INITIAL_STATE = {
  type: "",
  notes: "",
  dateNumeric: 0,
  dateSanitized: "Application date?",
  showCustomInput: false,
  selectedDay: undefined,
  showDate: false,
  interaction: {},
  typeHidden: undefined
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    maxHeight: "90%",
    overflow: "scroll",
    border: "2px solid #5299E5"
  }
};

class InteractionModal extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.closeModal = this.closeModal.bind(this);
    this.selectManage = this.selectManage.bind(this);
    this.dateToggle = this.dateToggle.bind(this);
    this.selectDay = this.selectDay.bind(this);
    this.submit = this.submit.bind(this)
  }

  selectManage(value) {
    this.setState({ 
        interaction : {
            type: value 
        },
        type: value
    }, () => {
      if (this.state.type === "Other") {
        this.setState({
          showCustomInput: true
        });
      } else {
        this.setState({
          showCustomInput: false
        });
      }
    });
    this.setState(byPropKey("typeHidden", value));
  }

  dateToggle() {
    this.state.showDate
      ? this.setState({
          showDate: false
        })
      : this.setState({
          showDate: true
        });
  }

  selectDay(day) {
    const months = [
      "Jan",
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    let month = months[day.getMonth()];

    let cleanDay = day.getDate() + " " + month + ", " + day.getFullYear();
    let numericDay = Date.parse(day);

    this.setState({
      selectedDay: numericDay,
      showDate: false,
      dateSanitized: cleanDay
    });
  }

  submit() {
      const { submitEdits, toggleModal } = this.props
      let id = this.props.interaction.userId
      let jobId = this.props.interaction.jobId
      let ref = this.props.interaction.ref
      let data = {}
      data['type'] = this.state.typeHidden
      data['date'] = this.state.dateSanitized
      data['notes'] = this.state.notes
      submitEdits(id, jobId, ref, data)
      toggleModal(false, null)
  }

  closeModal() {
    const { toggleModal } = this.props;
    toggleModal(false, null);
  }

  componentDidMount() {
    Modal.setAppElement("#app");
  }

  componentWillReceiveProps(props) {
    if (props.interaction !== null) {
      this.setState(
        {
          interaction: props.interaction,
          dateSanitized: props.interaction.date,
          type: props.interaction.type,
          typeHidden: props.interaction.type,
          notes: props.interaction.notes
        },
        () => console.log(this.state.interaction)
      );
    }
  }

  render() {
    const { 
        dateSanitized,
        type
    } = this.state;

    const isInvalid = type === "" || 
            dateSanitized === "Application date?"

    return (
      <div className="modal-wrap">
        <Modal
          isOpen={this.props.modalState}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Edit Interaction"
          closeTimeoutMS={200}
        >
          <div className="modal-inner ui-panel-wrap">
            <h2>Edit timeline event</h2>
            {isInvalid && <div className="ui-info">Interactions require an event type and date</div>}
            <div className="jobs-input-group">
                <label>Event type{isInvalid && <span className="required">*</span>}</label>
                <select
                id="interaction-dropdown-edit"
                name="interaction-dropdown-edit"
                onChange={e => this.selectManage(e.target.value)}
                value={this.state.interaction ? this.state.interaction.type : '--'}
                >
                    <option value="--" disabled>
                        Interaction type
                    </option>
                    <option value="Email response">Email response</option>
                    <option value="Phone interview">Phone interview</option>
                    <option value="First interview">First in-person interview</option>
                    <option value="Second interview">
                        Second in-person interview
                    </option>
                    <option value="Third interview">Third in-person interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Other">Other</option>
                </select>
                {this.state.showCustomInput && <input type="text" name="interaction-custom-input"       id="interaction-custom-input"
                className="ui-input"
                placeholder="Interaction type" 
                onChange={e => this.setState(byPropKey('typeHidden', e.target.value))} />}
            </div>
            <div className="jobs-date-wrap">
                <label>Date</label>
                <span
                    onClick={this.dateToggle}
                        className={"cntrl-link " + (this.state.showDate ? "highlight" : "")}>{this.state.dateSanitized}
                        {isInvalid &&<span className="required">*</span>}
                </span>
                <SlideDown className="job-app-slidedown">
                    {this.state.showDate && <DayPicker 
                      onDayClick={this.selectDay}
                      selectedDay={this.state.selectedDay}
                    />}
                </SlideDown>
            </div>
            <div className="jobs-input-group">
                <label htmlFor="interaction-notes">Notes</label>
                <textarea
                    name="interaction-notes"
                    id="interaction-notes"
                    onChange={event => this.setState({ 
                        interaction: {
                            notes: event.target.value   
                        },
                        notes: event.target.value   
                    })}
                    value={this.state.interaction ? this.state.interaction.notes : ''}>
                </textarea>
            </div>
            <div className="btn-wrap">
                <button className="modal-submit-btn" disabled={isInvalid}
                    onClick={this.submit}>Submit</button>
                <button className="modal-cancel-btn" 
                    onClick={this.closeModal}>Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modalState: state.modalState.interactionModal,
  interaction: state.modalState.interaction
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (order, interaction) =>
    dispatch(toggleModal(false, order, null, interaction)),
  submitEdits: (id, jobId, ref, data) =>
    dispatch(updateInteraction(id, jobId, ref, data)),
  sendDelete: (userId, jobId, ref) => dispatch(deleteInteraction(userId, jobId, ref))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InteractionModal);
