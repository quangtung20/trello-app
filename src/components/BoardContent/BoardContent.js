import React, { useState, useEffect } from "react";
import Column from "../Column/Column";
import { mapOrder } from "../../ultilities/sorts";
import { applyDrag } from "../../ultilities/dragDrop";
import "./BoardContent.scss";
import { initialData } from "../../actions/initialData";
import { drop, isEmpty } from "lodash";
import { Container, Draggable } from 'react-smooth-dnd';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        const boardFromDB = initialData.boards.find(
            (board) => board.id === "board-1"
        );
        if (boardFromDB) {
            setBoard(boardFromDB);
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

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
        console.log(newBoard);
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
            <div className="add-new-column">
                <i className="fa fa-plus">Add another column</i>
            </div>
        </div>
    );
}
export default BoardContent;
