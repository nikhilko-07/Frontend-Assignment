import {
    DndContext,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { KanbanProvider, KanbanContext } from "./KanbanContext";
import Column from "./Column";
import Card from "./Card";
import { useContext, useState } from "react";
import type { CardType } from "./KanbanContext";

function BoardContent() {
    const { state, dispatch } = useContext(KanbanContext);
    const [activeCard, setActiveCard] = useState<CardType | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const [columnId, cardId] = event.active.id.toString().split("::");

        const column = state.columns.find((c) => c.id === columnId);
        const card = column?.cards.find((c) => c.id === cardId);

        if (card) {
            setActiveCard(card);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const [fromColumnId, cardId] = active.id.toString().split("::");
        const toColumnId = over.id.toString();

        if (!fromColumnId || !cardId) return;

        dispatch({
            type: "MOVE_CARD",
            fromColumnId,
            toColumnId,
            cardId,
        });
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {state.columns.map((col) => (
                    <Column key={col.id} column={col} />
                ))}
            </div>

            {/* 🔥 DRAG OVERLAY FIX */}
            <DragOverlay>
                {activeCard ? (
                    <div className="bg-gray-200 p-3 rounded-lg shadow-lg w-60 opacity-90">
                        {activeCard.title}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default function KanbanBoard() {
    return (
        <KanbanProvider>
            <BoardContent />
        </KanbanProvider>
    );
}