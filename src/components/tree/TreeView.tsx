import {
    DndContext,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import type {
    DragEndEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import type TreeNodeType from "./types";

/* ======================= MAIN ======================= */

export default function TreeView() {
    const [nodes, setNodes] = useState<TreeNodeType[]>([
        {
            id: uuid(),
            name: "Root",
            parentId: null,
            hasLoaded: false,
        },
    ]);

    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string | null>(null);

    /* ------------ Helpers ------------ */

    const getChildren = (parentId: string | null) =>
        nodes.filter((n) => n.parentId === parentId);

    const getNode = (id: string) =>
        nodes.find((n) => n.id === id);

    /* ------------ Expand + Lazy ------------ */

    const toggleExpand = (id: string) => {
        const node = getNode(id);
        if (!node) return;

        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

        if (!node.hasLoaded) {
            setNodes((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, isLoading: true } : n
                )
            );

            setTimeout(() => {
                setNodes((prev) => [
                    ...prev.map((n) =>
                        n.id === id
                            ? { ...n, hasLoaded: true, isLoading: false }
                            : n
                    ),
                    {
                        id: uuid(),
                        name: "Lazy Child 1",
                        parentId: id,
                        hasLoaded: false,
                    },
                    {
                        id: uuid(),
                        name: "Lazy Child 2",
                        parentId: id,
                        hasLoaded: false,
                    },
                ]);
            }, 800);
        }
    };

    /* ------------ Add ------------ */

    const addNode = (parentId: string | null, name: string) => {
        if (!name.trim()) return;

        setNodes((prev) => [
            ...prev,
            {
                id: uuid(),
                name: name.trim(),
                parentId,
                hasLoaded: false,
            },
        ]);

        if (parentId) {
            setExpanded((prev) => new Set(prev).add(parentId));
        }
    };

    /* ------------ Delete ------------ */

    const deleteNode = (id: string) => {
        setNodes((prev) => {
            const getAllChildren = (parentId: string): string[] => {
                const children = prev.filter(
                    (n) => n.parentId === parentId
                );
                return children.flatMap((c) => [
                    c.id,
                    ...getAllChildren(c.id),
                ]);
            };

            const toDelete = [id, ...getAllChildren(id)];
            return prev.filter((n) => !toDelete.includes(n.id));
        });

        setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    /* ------------ Drag ------------ */

    const isDescendant = (
        parentId: string,
        childId: string
    ): boolean => {
        const children = nodes.filter(
            (n) => n.parentId === parentId
        );

        for (const child of children) {
            if (child.id === childId) return true;
            if (isDescendant(child.id, childId))
                return true;
        }
        return false;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;
        if (active.id === over.id) return;

        const activeNode = getNode(active.id.toString());
        const overNode = getNode(over.id.toString());
        if (!activeNode || !overNode) return;

        // Prevent circular nesting
        if (isDescendant(activeNode.id, overNode.id))
            return;

        setNodes((prev) =>
            prev.map((n) =>
                n.id === active.id
                    ? { ...n, parentId: overNode.parentId }
                    : n
            )
        );
    };

    /* ------------ Render ------------ */

    const renderTree = (parentId: string | null) => {
        const children = getChildren(parentId);

        return (
            <SortableContext
                items={children.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
            >
                {children.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        addNode={addNode}
                        deleteNode={deleteNode}
                        renderTree={renderTree}
                    />
                ))}
            </SortableContext>
        );
    };

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg max-h-[80vh] overflow-auto">
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {renderTree(null)}

                <DragOverlay>
                    {activeId ? (
                        <div className="bg-blue-100 px-3 py-2 rounded shadow-lg">
                            {getNode(activeId)?.name}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

/* ======================= NODE ======================= */

function TreeNode({
    node,
    expanded,
    toggleExpand,
    addNode,
    deleteNode,
    renderTree,
}: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: node.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [editing, setEditing] = useState(false);
    const [adding, setAdding] = useState(false);
    const [value, setValue] = useState(node.name);
    const [newName, setNewName] = useState("");

    return (
        <div ref={setNodeRef} style={style} className="ml-6">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow mb-2 hover:bg-gray-50">
                <span
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-gray-400"
                >
                    ☰
                </span>

                <button
                    onClick={() => toggleExpand(node.id)}
                    className="font-bold w-6"
                >
                    {expanded.has(node.id) ? "−" : "+"}
                </button>

                {editing ? (
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => setEditing(false)}
                        className="border px-2 py-1 text-sm rounded w-full"
                        autoFocus
                    />
                ) : (
                    <span
                        onDoubleClick={() => setEditing(true)}
                        className="flex-1"
                    >
                        {node.name}
                    </span>
                )}

                {node.isLoading && (
                    <span className="text-xs text-gray-400 animate-pulse">
                        Loading...
                    </span>
                )}

                <button
                    onClick={() => setAdding(!adding)}
                    className="text-green-600"
                >
                    +
                </button>

                <button
                    onClick={() => deleteNode(node.id)}
                    className="text-red-500"
                >
                    ×
                </button>
            </div>

            {adding && (
                <div className="ml-10 mb-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter child name"
                        className="border px-2 py-1 text-sm rounded"
                    />
                    <button
                        onClick={() => {
                            addNode(node.id, newName);
                            setNewName("");
                            setAdding(false);
                        }}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                        Add
                    </button>
                </div>
            )}

            {expanded.has(node.id) && renderTree(node.id)}
        </div>
    );
}