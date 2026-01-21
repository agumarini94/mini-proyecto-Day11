import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { loginFailure } from './store/authSlice'; // Asegúrate de tener esta acción
import { Login } from './components/Login';
import { StoryList } from './components/StoryList';
import { CreateStory } from './components/CreateStory';
import { StoryDetail } from './components/StoryDetail';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const dispatch = useDispatch();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root'); // Limpia la persistencia de Redux
    window.location.reload(); // Recarga para resetear el estado
  };

  // Si no hay usuario, mostramos el Login
  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <Login />
      </div>
    );
  }

  // Si hay usuario, mostramos la aplicación principal
  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* Navbar Principal */}
      <nav className="navbar bg-primary text-primary-content shadow-lg mb-8 px-4 md:px-10">
        <div className="flex-1">
          <button
            className="text-2xl font-black tracking-tighter"
            onClick={() => setSelectedStory(null)}
          >
            STORY<span className="text-secondary-content">APP</span>
          </button>
        </div>
        <div className="flex-none gap-4">
          <div className="hidden sm:block">
            <p className="text-xs opacity-70">Conectado como</p>
            <p className="font-bold">{user.username}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm border-white/20">
            Salir
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        {selectedStory ? (
          /* VISTA 1: DETALLE DE UNA HISTORIA */
          <StoryDetail
            story={selectedStory}
            onBack={() => setSelectedStory(null)}
          />
        ) : (
          /* VISTA 2: DASHBOARD PRINCIPAL */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Columna Izquierda: Formulario para crear */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CreateStory />
              </div>
            </div>

            {/* Columna Derecha: Lista de historias */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
                <span className="text-primary">#</span> Historias Recientes
              </h2>
              <StoryList onSelectStory={setSelectedStory} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;