import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Translator from './components/Translator';
import CameraTranslator from './components/CameraTranslator';

export default function Home() {
    return (
        <div>
            <Flashcard />
            <Translator />
            <CameraTranslator />
        </div>
    );
}
