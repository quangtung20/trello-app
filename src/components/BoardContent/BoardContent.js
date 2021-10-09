import React, { useState, useEffect, useRef, useCallback } from "react";
import Column from "../Column/Column";
import { mapOrder } from "../../ultilities/sorts";
import { applyDrag } from "../../ultilities/dragDrop";
import "./BoardContent.scss";
import { initialData } from "../../actions/initialData";
import { drop, isEmpty } from "lodash";
import { Container, Draggable } from 'react-smooth-dnd';
import {
    Container as BootstrapContainer, Row, Col, Form, Button
} from 'react-bootstrap';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const newColumnInputRef = useRef(null);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), []);

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }
        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5),//random character, will remove when we implement code Api
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }
        let newColumns = [...columns]
        newColumns.push(newColumnToAdd);
        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        setNewColumnTitle('');
        toggleOpenNewColumnForm();
    }

    useEffect(() => {
        const boardFromDB = initialData.boards.find(
            (board) => board.id === "board-1"
        );
        if (boardFromDB) {
            setBoard(boardFromDB);
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);


    if (isEmpty(board)) {
        return (
            <div className="not-found" style={{ padding: "10px", color: "white" }}>
                Board not found !
            </div>
        );
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);

    }

    const onCardDrop = (columnId, dropResult) => {

        if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];
            let currentColumn = newColumns.find(c => c.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id);
            setColumns(newColumns);
            console.log(dropResult);
        }
    }
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);
    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index =>
                    columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column key={index} column={column} onCardDrop={onCardDrop} />
                    </Draggable>

                ))}
            </Container>
            <BootstrapContainer className="quangtung-trello-container">
                {!openNewColumnForm &&
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
                            <i className="fa fa-plus"></i><span>Add another column</span>
                        </Col>
                    </Row>
                }

                {openNewColumnForm &&
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control size="sm" type="text" placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="primary" size="sm" onClick={addNewColumn}>Add column</Button>
                            <span className="cancel-new-column"><i className="fa fa-trash icon" onClick={() => {
                                toggleOpenNewColumnForm();
                            }}
                            /></span>
                        </Col>
                    </Row>
                }
            </BootstrapContainer>
        </div>
    );
}
export default BoardContent;
