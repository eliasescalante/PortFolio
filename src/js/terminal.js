const output = document.getElementById("output");
const input = document.getElementById("input");
const aboutPhoto = document.getElementById("about-photo");
const terminal = document.querySelector(".terminal");
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


// --- PLACEHOLDERS ROTATIVOS ---
const placeholders = [
    "Escribí 'help' para ver las opciones...",
    "Proba: about",
    "¿Buscás proyectos? -> projects",
    "Contactarme -> contact",
];

let pIndex = 0;
setInterval(() => {
    input.placeholder = placeholders[pIndex];
    pIndex = (pIndex + 1) % placeholders.length;
}, 2500);


// --- COMANDOS FIJOS ---
let commands = {
    help: `
Comandos disponibles:

  help             - mostrar comandos
  about            - sobre mí
  skills           - stack técnico
  education        - formación y certificaciones
  projects         - proyectos dinámicos
  project <id>     - mostrar datos de un proyecto
  projects <tag>   - filtrar proyectos
  theme <tema>     - cambiar tema (matrix | cyberpunk | github)
  cv               - descargar mi CV
  contact          - contacto
  clear            - limpiar pantalla
`,
    about: `
> Hola, soy Elías Escalante.

> Desarrollador Full Stack con especialización en desarrollo Backend.
> Estudiante avanzado de la Tecnicatura Superior en Programación (TECLAB).
> Estudiante de la Tecnicatura en Programación Universitaria (UNQUI).
> Profesor particular de lógica de programación y desarrollo de software.
> Experiencia en desarrollo Backend con MERN, Django, Flask y NestJS.
> Diseño e implementación de APIs RESTful.
> Manejo de bases de datos SQL y NoSQL.
> Contenerización con Docker y kubernetes. 
> Desarrollo de videojuegos con Godot y GDScript.
> Control de versiones con Git/GitHub y trabajo con metodologías ágiles.
`,
    skills: `
> Skills :: Backend (Primary)

  - Node.js · Express · NestJS · TypeScript 
  - Python · Django · Flask
  - PostgreSQL · MySQL · MariaDB · MongoDB
  - APIs RESTful · JWT · WebSockets
  - Docker · Arquitectura MVC / Services
  - Git · Control de versiones

> Skills :: FrontEnd (Secondary)

  - HTML · CSS · JavaScript
  - React.js + Vite
  - Wordpress
  - Bootstrap

> Skills GameDeveloper: 

  - GODOT ENGINE · GDScript
  - Diseño de mecánicas de juego
  - Sistemas de inventario
  - IA básica y Pathfinding
  - Señales, animaciones y escenas
  - Prototipado rápido
`,
    contact: `
> Contacto:

  Email:    eliasw.escalante@gmail.com
  LinkedIn: https://www.linkedin.com/in/elias-escalante/
  GitHub:   https://github.com/eliasescalante
  Itch.io:  https://elias-escalante.itch.io/
`,
    clear: "clear",
    education: `
> Formación & Certificaciones:

> Educación formal:

  - Tecnicatura Superior en Programación — TECLAB (en curso)
  - Tecnicatura Universitaria en Programación — UNQ (en curso)

> Diplomaturas & Carreras:

  - Diplomatura en Desarrollo Backend con Django & Python — UTN
  - Diplomatura en Python — UTN
  - Diplomatura en Desarrollo y Programación de Videojuegos — UNQ
  - Carrera de Desarrollo Full Stack (Node.js · Express · MongoDB · REACT) — Coderhouse
  - Carrera de Desarrollo Backend (Node.js · Express · MongoDB) — Coderhouse

> Cursos complementarios:

  - Bases de Datos SQL — Coderhouse
  - JavaScript — Coderhouse
  - Desarrollo Web — Coderhouse
  - WordPress — Coderhouse
  - Testing QA Manual — Coderhouse
  - Java (Nivel Inicial e Intermedio) — UTN
  - Python & Django — Coderhouse
  - Introducción a Inteligencia Artificial — TECLAB
  - Curso de GODOT ENGINE  2D | estructura y mecánicas de juego — UDEMY

> Otros:

  - Actualización Profesional en Inteligencia Artificial — TECLAB
  - Inglés A1 — CUI

> Formación continua y aprendizaje autodidacta.
`,


};


// --- FUNCIONES AUXILIARES ---
function hideAboutPhoto() {
    aboutPhoto.classList.remove("show");
}


// --- TYPING ANIMATION ---
function typeWriter(text, speed = 5) {
    return new Promise((resolve) => {
        let i = 0;
        let interval = setInterval(() => {
            output.innerHTML += text.charAt(i);
            i++;
            output.scrollTop = output.scrollHeight;

            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

async function typeWriterLines(lines, speed = 80) {
    for (let line of lines) {
        output.innerHTML += line + "\n";
        output.scrollTop = output.scrollHeight;
        await new Promise(r => setTimeout(r, speed));
    }
}



// --- MENSAJE DE BIENVENIDA ---
async function welcomeMessage() {
    await typeWriter("Bienvenido a mi portfolio ...", 25);
    await new Promise((r) => setTimeout(r, 400));
    await typeWriter("\nEscribi ", 25);
    await typeWriter("'help'", 25);
    await typeWriter(" para comenzar.\n\n", 25);
}
welcomeMessage();


// --- APPEND OUTPUT ---
function appendOutput(text) {
    output.innerHTML += text + "\n";
    output.scrollTop = output.scrollHeight;
}


// --- HISTORIAL ---
let history = [];
let hIndex = -1;

input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        if (history.length === 0) return;
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex];
    }
    if (e.key === "ArrowDown") {
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || "";
    }
});


// --- AUTOCOMPLETADO ---
const ALL_COMMANDS = [
    "help", "about", "skills", "projects",
    "contact", "clear", "theme", "project", "cv"
];

input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        const val = input.value;

        const match = ALL_COMMANDS.find(cmd => cmd.startsWith(val));
        if (match) input.value = match;
    }
});


// --- COMMAND HANDLER ---
input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const cmd = input.value.trim();
    output.innerHTML +=
        `\n<span class="color-prompt">elias@portfolio:~$</span> ${cmd}\n`;
    output.scrollTop = output.scrollHeight;

    history.push(cmd);
    hIndex = history.length;

    hideAboutPhoto(); // Oculta la foto al escribir cualquier comando EXCEPTO about


    // =========================================================
    // --- COMMAND: theme <name>
    // =========================================================
    if (cmd.startsWith("theme ")) {
        const t = cmd.split(" ")[1];

        if (t === "matrix") {
            document.body.style.background = "#000";
            document.body.style.color = "#0f0";
        }
        else if (t === "cyberpunk") {
            document.body.style.background = "#07041a";
            document.body.style.color = "#f0f";
        }
        else if (t === "github") {
            document.body.style.background = "#0d1117";
            document.body.style.color = "#c9d1d9";
        }
        else {
            await typeWriter("> Tema no encontrado\n");
            return;
        }

        await typeWriter(`> Tema cambiado a: ${t}\n`);
        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: cv
    // =========================================================
    if (cmd === "cv") {
        await typeWriter("> Generando descarga del CV...\n", 20);

        const link = document.createElement("a");
        link.href = "src/assets/CV_Elias_BACKEND.pdf";
        link.download = "CV_ELIAS_BACKEND.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await typeWriter("> Descarga iniciada ✔\n");
        await typeWriter("Si no se descargó automáticamente, podés abrir:\n", 15);

        output.innerHTML += `<a href="src/assets/CV_ELIAS_BACKEND.pdf" target="_blank" class="color-link">Ver CV aquí</a><br>`;
        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: ABOUT (coloreado + imagen)
    // =========================================================
    if (cmd === "about") {
        await typeWriter(commands.about);

        output.innerHTML = output.innerHTML.replace(
            commands.about,
            `<span class="color-about">${commands.about}</span>`
        );

        // Mostrar imagen
        aboutPhoto.style.backgroundImage = "url('src/img/profile.jpg')";
        aboutPhoto.classList.add("show");

        appendOutput("");
        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: SKILLS (coloreado)
    // =========================================================
    if (cmd === "skills") {
        await typeWriter(commands.skills);

        output.innerHTML = output.innerHTML.replace(
            commands.skills,
            `<span class="color-skills">${commands.skills}</span>`
        );

        appendOutput("");
        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: project <id>
    // =========================================================
    if (cmd.startsWith("project ")) {
        const id = cmd.split(" ")[1];

        try {
            const res = await fetch("src/data/projects.json");
            const projects = await res.json();
            const p = projects.find(pr => pr.id === id);

            if (!p) {
                await typeWriter(`> No existe el proyecto '${id}'\n`);
                input.value = "";
                return;
            }

            await typeWriter(`\n----------------------------------------\n`);
            await typeWriter(`ID: `, 5);
            output.innerHTML += `<span class="color-id">${p.id}</span>\n`;

            await typeWriter(`Nombre: `, 5);
            output.innerHTML += `<span class="color-name">${p.name}</span>\n`;

            await typeWriter(`Stack: `, 5);
            output.innerHTML += `<span class="color-stack">${p.stack}</span>\n\n`;

            output.innerHTML += `<span class="color-desc">${p.description}</span>\n\n`;
            output.innerHTML += `Repo: <a href="${p.repo}" target="_blank">${p.repo}</a>\n`;

            if (p.demo) {
                output.innerHTML += `Demo: <a href="${p.demo}" target="_blank">${p.demo}</a>\n`;
            }

            output.innerHTML += "----------------------------------------\n";

        } catch {
            await typeWriter("> Error leyendo proyectos.\n");
        }

        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: projects <filter>
    // =========================================================
    if (cmd.startsWith("projects ")) {
        const filter = cmd.split(" ")[1];

        await typeWriter(`> Filtrando proyectos por '${filter}'\n`);

        try {
            const res = await fetch("src/data/projects.json");
            const projects = await res.json();

            const filtered = projects.filter(p =>
                p.tags.includes(filter.toLowerCase())
            );

            if (filtered.length === 0) {
                await typeWriter("> No se encontraron proyectos.\n");
                input.value = "";
                return;
            }

            for (let p of filtered) {
                await typeWriter(`- ${p.name} (${p.id})\n`, 20);
            }

        } catch {
            await typeWriter("> Error leyendo proyectos.\n");
        }

        input.value = "";
        return;
    }


    // =========================================================
    // --- COMMAND: projects (listado dinámico)
    // =========================================================
    if (cmd === "projects") {
        appendOutput("");
        await typeWriter("> Cargando proyectos...\n");

        try {
            const res = await fetch("src/data/projects.json");
            const projects = await res.json();

            for (let p of projects) {
                await typeWriter("\n----------------------------------------\n", 10);

                await typeWriter(`ID: `, 5);
                output.innerHTML += `<span class="color-id">${p.id}</span>\n`;

                await typeWriter(`Nombre: `, 5);
                output.innerHTML += `<span class="color-name">${p.name}</span>\n`;

                await typeWriter(`Stack: `, 5);
                output.innerHTML += `<span class="color-stack">${p.stack}</span>\n`;

                await typeWriter(`Repo: `, 5);
                output.innerHTML += `<span class="color-link"><a href="${p.repo}" target="_blank">${p.repo}</a></span>\n`;

                if (p.demo) {
                    await typeWriter(`Demo: `, 5);
                    output.innerHTML += `<span class="color-link"><a href="${p.demo}" target="_blank">${p.demo}</a></span>\n`;
                }

                await typeWriter(`Descripción: `, 5);
                output.innerHTML += `<span class="color-desc">${p.description}</span>\n`;

                output.innerHTML += "\n";
                output.scrollTop = output.scrollHeight;

                await new Promise(r => setTimeout(r, 200));
            }

            await typeWriter("----------------------------------------\n", 10);

        } catch {
            await typeWriter("> Error al cargar proyectos 😢\n");
        }

        input.value = "";
        return;
    }

    // =========================================================
    // --- COMANDOS EDUCATION
    // =========================================================

    if (cmd === "education") {

        let coloredEducation = commands.education
            // Títulos en amarillo
            .replace(/^> ([^:\n]+):/gm,
                `<span class="color-edu-title">> $1:</span>`
            )
            // Instituciones en verde
            .replace(/— ([A-Za-zÁÉÍÓÚáéíóú .]+)/g,
                `— <span class="color-edu-inst">$1</span>`
            );

        // 👉 animación tipo consola (línea por línea)
        const lines = coloredEducation.split("\n");
        await typeWriterLines(lines, 60);

        appendOutput("");
        input.value = "";
        return;
    }


    // =========================================================
    // --- COMANDOS FIJOS
    // =========================================================
    if (commands[cmd]) {
        if (cmd === "clear") {
            await resetTerminal();
        } else {
            await typeWriter(commands[cmd]);
            appendOutput("");
        }
    } else {
        await typeWriter(
            `Comando no encontrado: ${cmd}\nEscribí "help" para ver opciones.\n`
        );
    }

    input.value = "";
});

/* Mobile: el teclado aparece SOLO tras interacción */
if (!isMobile) {
    input.focus();
}

async function resetTerminal() {
    output.innerHTML = "";
    hideAboutPhoto();
    await welcomeMessage();
}