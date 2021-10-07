import React from "react";
import Task from "../Task/Task";
import './Column.scss';

function Column() {
    return (
        <div className="column">
            <header>Brainstorm</header>
            <ul className="task-list">
                <Task />
                <li className="task-item">Hehehehehehehe</li>
                <li className="task-item">Hehehehehehehe</li>
                <li className="task-item">Hehehehehehehe</li>
                <li className="task-item">Hehehehehehehe</li>
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}
export default Column