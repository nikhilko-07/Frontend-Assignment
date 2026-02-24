import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import type TreeNodeType from "./types";

/* ------------------- MAIN COMPONENT ------------------- */

export default function TreeView() {
    const [nodes, setNodes] = useState<TreeNodeType[]>([
        {
            id: uuid(),
            name: "A",
            parentId: null,
            hasLoaded: false,
        },
    ]);

    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    /* -------- Helpers -------- */

    const getChildren = (parentId: string | null) =>
        nodes.filter((n) => n.parentId === parentId);

    const toggleExpand = (id: string) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

        const newSet = new Set(expanded);

        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);

            // Proper lazy loading
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
                        },
                        {
                            id: uuid(),
                            name: "Lazy Child 2",
                            parentId: id,
                        },
                    ]);
                }, 1000);
            }
        }

        setExpanded(newSet);
    };

    const addNode = (parentId: string | null) => {
        const name = prompt("Enter node name");
        if (!name) return;

        setNodes([...nodes, { id: uuid(), name, parentId }]);
    };

    const deleteNode = (id: string) => {
        if (!confirm("Delete this node and its subtree?")) return;

        const getAllChildren = (parentId: string): string[] => {
            const children = nodes.filter((n) => n.parentId === parentId);
            return children.flatMap((c) => [
                c.id,
                ...getAllChildren(c.id),
            ]);
        };

        const toDelete = [id, ...getAllChildren(id)];

        setNodes(nodes.filter((n) => !toDelete.includes(n.id)));
    };

    const editNode = (id: string, name: string) => {
        setNodes(
            nodes.map((n) =>
                n.id === id ? { ...n, name } : n
            )
        );
    };

    /* -------- Drag Logic -------- */

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        const activeNode = nodes.find((n) => n.id === active.id);
        const overNode = nodes.find((n) => n.id === over.id);
        if (!activeNode || !overNode) return;

        // Prevent circular nesting
        const isDescendant = (parentId: string, childId: string): boolean => {
            const children = nodes.filter((n) => n.parentId === parentId);
            for (const child of children) {
                if (child.id === childId) return true;
                if (isDescendant(child.id, childId)) return true;
            }
            return false;
        };

        if (isDescendant(activeNode.id, overNode.id)) return;

        setNodes(
            nodes.map((n) =>
                n.id === active.id
                    ? { ...n, parentId: overNode.parentId }
                    : n
            )
        );
    };

    /* -------- Recursive Render -------- */

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
                        editNode={editNode}
                        renderTree={renderTree}
                    />
                ))}
            </SortableContext>
        );
    };

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow">
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {renderTree(null)}
            </DndContext>

            <button
                onClick={() => addNode(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Add Root Node
            </button>
        </div>
    );
}

/* ------------------- NODE COMPONENT ------------------- */

function TreeNode({
    node,
    expanded,
    toggleExpand,
    addNode,
    deleteNode,
    editNode,
    renderTree,
}: any) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: node.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(node.name);

    return (
        <div ref={setNodeRef} style={style} className="ml-6">
            <div className="flex items-center gap-2 bg-white p-2 rounded shadow mb-2">
                <span {...attributes} {...listeners} className="cursor-move">
                    ☰
                </span>

                <button
                    onClick={() => toggleExpand(node.id)}
                    className="font-bold"
                >
                    {expanded.has(node.id) ? "−" : "+"}
                </button>

                {editing ? (
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => {
                            editNode(node.id, value);
                            setEditing(false);
                        }}
                        autoFocus
                        className="border px-1"
                    />
                ) : (
                    <span
                        onDoubleClick={() => setEditing(true)}
                        className="flex-1 cursor-pointer"
                    >
                        {node.name}
                    </span>
                )}

                {node.isLoading && (
                    <span className="text-sm text-gray-400 animate-pulse">
                        Loading...
                    </span>
                )}

                <button
                    onClick={() => addNode(node.id)}
                    className="text-green-600"
                >
                    +
                </button>

                <button
                    onClick={() => deleteNode(node.id)}
                    className="text-red-600"
                >
                    ×
                </button>
            </div>

            {expanded.has(node.id) && renderTree(node.id)}
        </div>
    );
}