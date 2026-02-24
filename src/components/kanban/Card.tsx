import { useContext, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { KanbanContext } from "./KanbanContext";
import type { CardType } from "./KanbanContext";

export default function Card({
    card,
    columnId,
}: {
    card: CardType;
    columnId: string;
}) {
    const { dispatch } = useContext(KanbanContext);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(card.title);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `${columnId}::${card.id}`,
    });

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-100 p-3 rounded-lg shadow"
        >
            {/* DRAG HANDLE ONLY */}
            <div
                {...listeners}
                {...attributes}
                className="cursor-grab text-gray-400 text-xs mb-2"
            >
                ⠿ Drag
            </div>

            {/* TITLE */}
            {editing ? (
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                        dispatch({
                            type: "EDIT_CARD",
                            columnId,
                            cardId: card.id,
                            title,
                        });
                        setEditing(false);
                    }}
                    autoFocus
                    className="w-full p-1 border rounded text-sm"
                />
            ) : (
                <p
                    onDoubleClick={() => setEditing(true)}
                    className="text-sm"
                >
                    {card.title}
                </p>
            )}

            {/* DELETE BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // 🔥 IMPORTANT
                    dispatch({
                        type: "DELETE_CARD",
                        columnId,
                        cardId: card.id,
                    });
                }}
                className="text-red-500 text-xs mt-2"
            >
                Delete
            </button>
        </div>
    );
}