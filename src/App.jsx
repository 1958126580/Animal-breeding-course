import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chapters from './pages/Chapters';
import ChapterDetail from './pages/ChapterDetail';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Docs from './pages/Docs';
import NotFound from './pages/NotFound';
import GeneticParams from './pages/labs/GeneticParams';
import PedigreeMME from './pages/labs/PedigreeMME';
import BreedingSimulator from './pages/labs/BreedingSimulator';
import GenomicSelection from './pages/labs/GenomicSelection';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/chapters" element={<Chapters />} />
                    <Route path="/chapters/:id" element={<ChapterDetail />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/lab/genetic-params" element={<GeneticParams />} />
                    <Route path="/lab/pedigree-mme" element={<PedigreeMME />} />
                    <Route path="/lab/breeding-sim" element={<BreedingSimulator />} />
                    <Route path="/lab/genomic-selection" element={<GenomicSelection />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
