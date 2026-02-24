import {
    DndContext,
    closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import Column from "./Column";
import type { ColumnType } from "./types";
import { v4 as uuid } from "uuid";

const initialData: ColumnType[] = [
    {
        id: "todo",
        title: "Todo",
        cards: [
            { id: uuid(), title: "Create initial project plan" },
            { id: uuid(), title: "Design landing page" },
        ],
    },
    {
        id: "progress",
        title: "In Progress",
        cards: [
            { id: uuid(), title: "Implement authentication" },
        ],
    },
    {
        id: "done",
        title: "Done",
        cards: [
            { id: uuid(), title: "Write API documentation" },
        ],
    },
];

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let sourceColumn = columns.find(col =>
            col.cards.some(card => card.id === activeId)
        );

        let targetColumn = columns.find(col =>
            col.cards.some(card => card.id === overId)
        );

        // Dropped in empty column
        if (!targetColumn) {
            targetColumn = columns.find(col => col.id === overId);
        }

        if (!sourceColumn || !targetColumn) return;

        // SAME COLUMN REORDER
        if (sourceColumn.id === targetColumn.id) {
            const oldIndex = sourceColumn.cards.findIndex(c => c.id === activeId);
            const newIndex = targetColumn.cards.findIndex(c => c.id === overId);

            if (newIndex === -1) return;

            const updatedCards = arrayMove(
                sourceColumn.cards,
                oldIndex,
                newIndex
            );

            setColumns(prev =>
                prev.map(col =>
                    col.id === sourceColumn!.id
                        ? { ...col, cards: updatedCards }
                        : col
                )
            );
        } else {
            // MOVE TO DIFFERENT COLUMN
            const movingCard = sourceColumn.cards.find(c => c.id === activeId);
            if (!movingCard) return;

            setColumns(prev =>
                prev.map(col => {
                    if (col.id === sourceColumn!.id) {
                        return {
                            ...col,
                            cards: col.cards.filter(c => c.id !== activeId),
                        };
                    }
                    if (col.id === targetColumn!.id) {
                        return {
                            ...col,
                            cards: [...col.cards, movingCard],
                        };
                    }
                    return col;
                })
            );
        }
    };

    const updateColumn = (updated: ColumnType) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === updated.id ? updated : col
            )
        );
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">
                Kanban Board
            </h1>

            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            updateColumn={updateColumn}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}