import TreeView from "./components/tree/TreeView";
import KanbanBoard from "./components/kanban/KanbanBoard";
export default function App() {
  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Tree View
          </h2>
          <TreeView />
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Kanban Board
          </h2>
          <KanbanBoard />
        </section>

      </div>
    </div>
  );
}