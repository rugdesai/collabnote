import Sidebar from "../components/layout/sideBar";
import Topbar from "../components/layout/topBar";
import NotesList from "../components/notes/notesList";

export default function Dashboard() {
  
  return (
    <div className="h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 p-8 overflow-y-auto">

            <NotesList
            />
          </div>
        </div>

      </div>
  );
}