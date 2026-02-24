import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ColumnType } from "./types";
import Card from "./Card";
import { v4 as uuid } from "uuid";

interface Props {
    column: ColumnType;
    updateColumn: (column: ColumnType) => void;
}

export default function Column({ column, updateColumn }: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const addCard = () => {
        const title = prompt("Enter card title");
        if (!title) return;

        updateColumn({
            ...column,
            cards: [...column.cards, { id: uuid(), title }],
        });
    };

    const deleteCard = (id: string) => {
        updateColumn({
            ...column,
            cards: column.cards.filter((c) => c.id !== id),
        });
    };

    const editCard = (id: string, title: string) => {
        updateColumn({
            ...column,
            cards: column.cards.map((c) =>
                c.id === id ? { ...c, title } : c
            ),
        });
    };

    return (
        <div
            ref={setNodeRef}
            className="bg-gray-100 rounded-xl p-4 min-h-[350px]"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">
                    {column.title} ({column.cards.length})
                </h2>
                <button
                    onClick={addCard}
                    className="bg-blue-500 text-white px-2 rounded"
                >
                    +
                </button>
            </div>

            <SortableContext
                items={column.cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {column.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            onDelete={() => deleteCard(card.id)}
                            onEdit={(title) => editCard(card.id, title)}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}