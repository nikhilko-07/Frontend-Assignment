import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardType } from "./types";

interface Props {
    card: CardType;
    onDelete: () => void;
    onEdit: (title: string) => void;
}

export default function Card({ card, onDelete, onEdit }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(card.title);

    const handleBlur = () => {
        if (value.trim() !== "") {
            onEdit(value);
        }
        setEditing(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white border rounded-lg p-3 shadow-sm flex justify-between items-center cursor-grab"
        >
            {editing ? (
                <input
                    className="border px-2 py-1 text-sm w-full"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                <p
                    onClick={() => setEditing(true)}
                    className="text-sm w-full"
                >
                    {card.title}
                </p>
            )}

            <button
                onClick={onDelete}
                className="text-red-500 text-sm ml-2"
            >
                ✕
            </button>
        </div>
    );
}