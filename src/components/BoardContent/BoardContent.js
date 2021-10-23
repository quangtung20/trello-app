import React, { useState, useEffect, useRef } from "react";
import Column from "../Column/Column";
import { mapOrder } from "../../ultilities/sorts";
import { applyDrag } from "../../ultilities/dragDrop";
import "./BoardContent.scss";
import { isEmpty, cloneDeep } from "lodash";
import { Container, Draggable } from 'react-smooth-dnd';
import {
    Container as BootstrapContainer, Row, Col, Form, Button
} from 'react-bootstrap';
import { fetchBoardDetails, createNewColumn, updateBoard } from '../../actions/ApiCall/index';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);
    const newColumnInputRef = useRef(null);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

    useEffect(() => {
        const boardId = '6167fbc0afaccded61d09827'
        fetchBoardDetails(boardId).then(board => {
            console.log(board);
            setBoard(board);
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
        })
    }, []);

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);



    const onUpdateColumnState = (newColumnToUpdate) => {

        const columnIdToUpdate = newColumnToUpdate._id;
        let newColumns = [...columns];
        const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate);

        if (newColumnToUpdate._destroy) {
            newColumns.splice(columnIndexToUpdate, 1);

        } else {
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
        }
        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }
        const newColumnToAdd = {
            boardId: board._id,
            title: newColumnTitle.trim(),
        }
        //call api post culumn
        createNewColumn(newColumnToAdd).then(column => {
            let newColumns = [...columns]
            newColumns.push(column);

            let newBoard = { ...board };
            newBoard.columnOrder = newColumns.map(c => c._id);
            newBoard.columns = newColumns;

            setColumns(newColumns);
            setBoard(newBoard);
            setNewColumnTitle('');
            toggleOpenNewColumnForm();
        })


    }


    if (isEmpty(board)) {
        return (
            <div className="not-found" style={{ padding: "10px", color: "white" }}>
                Board not found !
            </div>
        );
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = cloneDeep(columns);
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumns.map(c => c._id);
        newBoard.columns = newColumns;
        setColumns(newColumns);
        setBoard(newBoard);
        // call api update column order in board details
        updateBoard(newBoard._id, newBoard).catch(() => {
            setColumns(columns);
            setBoard(board);
        })

    }

    const onCardDrop = (columnId, dropResult) => {

        if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];
            let currentColumn = newColumns.find(c => c._id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(i => i._id);
            setColumns(newColumns);
            console.log(dropResult);
        }
    }


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
                        <Column
                            column={column}
                            onCardDrop={onCardDrop}
                            onUpdateColumnState={onUpdateColumnState}
                        />
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
                            <span className="cancel-icon"><i className="fa fa-trash icon" onClick={() => {
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
