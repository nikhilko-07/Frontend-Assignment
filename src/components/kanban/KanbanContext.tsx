import React, { createContext, useReducer, ReactNode } from "react";

export type CardType = {
    id: string;
    title: string;
};

export type ColumnType = {
    id: string;
    title: string;
    cards: CardType[];
};

type State = {
    columns: ColumnType[];
};

type Action =
    | { type: "ADD_CARD"; columnId: string; title: string }
    | { type: "DELETE_CARD"; columnId: string; cardId: string }
    | { type: "EDIT_CARD"; columnId: string; cardId: string; title: string }
    | {
        type: "MOVE_CARD";
        fromColumnId: string;
        toColumnId: string;
        cardId: string;
    };

const initialState: State = {
    columns: [
        {
            id: "todo",
            title: "Todo",
            cards: [
                { id: crypto.randomUUID(), title: "Design UI" },
                { id: crypto.randomUUID(), title: "Setup project" },
            ],
        },
        {
            id: "inprogress",
            title: "In Progress",
            cards: [],
        },
        {
            id: "done",
            title: "Done",
            cards: [],
        },
    ],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADD_CARD":
            return {
                columns: state.columns.map((col) =>
                    col.id === action.columnId
                        ? {
                            ...col,
                            cards: [
                                ...col.cards,
                                { id: crypto.randomUUID(), title: action.title },
                            ],
                        }
                        : col
                ),
            };

        case "DELETE_CARD":
            return {
                columns: state.columns.map((col) =>
                    col.id === action.columnId
                        ? {
                            ...col,
                            cards: col.cards.filter((c) => c.id !== action.cardId),
                        }
                        : col
                ),
            };

        case "EDIT_CARD":
            return {
                columns: state.columns.map((col) =>
                    col.id === action.columnId
                        ? {
                            ...col,
                            cards: col.cards.map((c) =>
                                c.id === action.cardId ? { ...c, title: action.title } : c
                            ),
                        }
                        : col
                ),
            };

        case "MOVE_CARD": {
            const { fromColumnId, toColumnId, cardId } = action;

            let cardToMove: CardType | null = null;

            const updatedColumns = state.columns.map((col) => {
                if (col.id === fromColumnId) {
                    const found = col.cards.find((c) => c.id === cardId);
                    if (found) cardToMove = found;

                    return {
                        ...col,
                        cards: col.cards.filter((c) => c.id !== cardId),
                    };
                }
                return col;
            });

            if (!cardToMove) return state;

            return {
                columns: updatedColumns.map((col) =>
                    col.id === toColumnId
                        ? { ...col, cards: [...col.cards, cardToMove!] }
                        : col
                ),
            };
        }

        default:
            return state;
    }
}

export const KanbanContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <KanbanContext.Provider value={{ state, dispatch }}>
            {children}
        </KanbanContext.Provider>
    );
};