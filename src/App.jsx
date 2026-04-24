import { ReactLenis } from 'lenis/react';
import Navbar from './components/UI/Navbar';
import Cursor from './components/UI/Cursor';
import ScrollSpy from './components/UI/Scrollspy';

import PageLoader from './components/UI/PageLoader';
import Hero from './components/Hero';
import About from './components/About';
import Carousel from './components/Carousel';
import Projects from './components/Projects';
import Skills from './components/Skills';
import { Experience, Credentials } from './components/Experience';
import Contact from './components/Contact';

function App() {
  return (
    <ReactLenis root>
      <PageLoader />

      <div className="app-container">
        <Cursor />
        <Navbar />
        <ScrollSpy />


        <main>
          <Hero />
          <About />
          <Carousel />
          <Projects />
          <Skills />
          <Experience />
          <Credentials />
        </main>

        <Contact />
      </div>
    </ReactLenis>
  );
}

export default App;