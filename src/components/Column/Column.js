import React, { useCallback, useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Column.scss";
import { mapOrder } from "../../ultilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown, Form } from 'react-bootstrap';
import ConfirmModal from "../Common/ConfirmModal";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../ultilities/constants';
import { saveContentAfterPressEnter, selectAllInText } from '../../ultilities/contentEditable';

function Column(props) {
    const { column, onCardDrop, onUpdateColumn } = props;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [columnTitle, setColumnTitle] = useState('');
    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title]);

    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
    const cards = mapOrder(column.cards, column.cardOrder, 'id');
    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }

            onUpdateColumn(newColumn);
        }
        toggleShowConfirmModal();
    }

    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newColumn);
    }



    const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

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
                    onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
            </div>
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus"> Add another card</i>
                </div>
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
