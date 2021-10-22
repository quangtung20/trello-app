import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import "./Column.scss";
import { mapOrder } from "../../ultilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown, Form, Button } from 'react-bootstrap';
import ConfirmModal from "../Common/ConfirmModal";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../ultilities/constants';
import { saveContentAfterPressEnter, selectAllInText } from '../../ultilities/contentEditable';
import { cloneDeep } from 'lodash';
import { createNewCard, createNewColumn, updateColumn } from '../../actions/ApiCall/index';

function Column(props) {
    const { column, onCardDrop, onUpdateColumnState } = props;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [columnTitle, setColumnTitle] = useState('');
    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const newCardTextareaRef = useRef(null);

    const [newCardTitle, setNewCardTitle] = useState('');
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus();
            newCardTextareaRef.current.select();
        }
    }, [openNewCardForm]);

    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
    const cards = mapOrder(column.cards, column.cardOrder, '_id');

    // Remove column
    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                onUpdateColumnState(updatedColumn);
            })

        }
        toggleShowConfirmModal();
    }
    // update column title
    const handleColumnTitleBlur = () => {
        if (columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle
            }
            //call api update column
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                updatedColumn.cards = newColumn.cards;
                onUpdateColumnState(updatedColumn);
            })
        }
    }



    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);


    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus();
            return;
        }
        const newCardToAdd = {
            boardId: column.boardId,
            columnId: column._id,
            title: newCardTitle.trim()
        }
        // call api
        createNewCard(newCardToAdd).then(card => {
            let newColumn = cloneDeep(column);
            newColumn.cards.push(card);
            newColumn.cardOrder.push(card._id);

            onUpdateColumnState(newColumn);
            setNewCardTitle('');
            toggleOpenNewCardForm();
        })

    }

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-title">

                    <Form.Control size="sm" type="text"
                        className="quangtung-content-editable"
                        onChange={handleColumnTitleChange}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterPressEnter}
                        value={columnTitle}
                        onClick={selectAllInText}
                        onMouseDown={e => e.preventDefault()}
                        spellCheck="false"

                    />
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" size="sm" className="dropdown-btn" />

                        <Dropdown.Menu>
                            <Dropdown.Item >Add card ...</Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowConfirmModal}>Remove Column</Dropdown.Item>
                            <Dropdown.Item >Move all cards</Dropdown.Item>
                            <Dropdown.Item >Archie all cards</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="Card-list">

                <Container
                    orientation="vertical"
                    groupName="tung-col"
                    onDrop={dropResult => onCardDrop(column._id, dropResult)}
                    getChildPayload={(index) => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"

                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: "card-drop-preview",
                    }}
                    dropPlaceholderAnimationDuration={200}
                >

                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card} />
                        </Draggable>
                    ))}
                </Container>
                {openNewCardForm &&
                    <div className="add-new-card-area">
                        <Form.Control size="sm"
                            as="textarea"
                            row="3"
                            placeholder="Enter card title..."
                            className="textarea-enter-new-card"
                            ref={newCardTextareaRef}
                            value={newCardTitle}
                            onChange={onNewCardTitleChange}
                            onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                        />
                        {/* <Button variant="primary" size="sm">Add column</Button>
                        <span className="cancel-icon" onClick={toggleOpenNewCardForm}><i className="fa fa-trash icon" /></span> */}
                    </div>
                }
            </div>
            <footer>
                {openNewCardForm &&
                    <div className="add-new-card-area">
                        <Button variant="primary" size="sm" onClick={addNewCard}>Add Card</Button>
                        <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                            <i className="fa fa-trash icon" /></span>
                    </div>
                }
                {!openNewCardForm &&
                    <div className="footer-actions" onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-plus"> Add another card</i>
                    </div>
                }
            </footer>
            <ConfirmModal
                show={showConfirmModal}
                onAction={onConfirmModalAction}
                title='remove column'
                content={`Are you sure to remove <strong>${column.title}</strong>!`}
            />
        </div>
    );
}
export default Column;
