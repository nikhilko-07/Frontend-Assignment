import { useContext, useState } from "react";
import { KanbanContext } from "./KanbanContext";
import type { ColumnType } from "./KanbanContext";
import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ column }: { column: ColumnType }) {
    const { dispatch } = useContext(KanbanContext);
    const [newTitle, setNewTitle] = useState("");

    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const handleAdd = () => {
        if (!newTitle.trim()) return;

        dispatch({
            type: "ADD_CARD",
            columnId: column.id,
            title: newTitle,
        });

        setNewTitle("");
    };

    return (
        <div
            ref={setNodeRef}
            className="bg-white rounded-xl shadow p-4 flex flex-col max-h-[70vh]"
        >
            <h2 className="font-semibold mb-3">{column.title}</h2>

            <div className="flex-1 overflow-y-auto space-y-3">
                {column.cards.map((card) => (
                    <Card key={card.id} card={card} columnId={column.id} />
                ))}
            </div>

            <div className="mt-3">
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New task..."
                    className="w-full p-2 border rounded text-sm"
                />
                <button
                    onClick={handleAdd}
                    className="mt-2 w-full bg-blue-500 text-white p-2 rounded text-sm"
                >
                    Add
                </button>
            </div>
        </div>
    );
}