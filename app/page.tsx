import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Leaderboard from './components/Leaderboard'; 
import Translator from './components/Translator';
import CameraTranslator from './components/CameraTranslator';
import MenuBar from './components/MenuBar';

export default function Home() {
    return (
        <div>
            {/* <MenuBar /> */}
            <Flashcard />
            <Translator />
            <CameraTranslator />
            {/* <Leaderboard /> */}
            {/* <MemoryGame /> */}
        </div>
    );
}
