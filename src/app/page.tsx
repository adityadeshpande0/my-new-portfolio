import { About } from "@/components/sections/About";
import { Articles } from "@/components/sections/Articles";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Recognition } from "@/components/sections/Recognition";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Recognition />
      <Articles />
      <Contact />
    </>
  );
}
